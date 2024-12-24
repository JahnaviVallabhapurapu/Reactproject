from fastapi import FastAPI,UploadFile, File, HTTPException
from trino.dbapi import connect
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from trino.auth import BasicAuthentication
from typing import List, Dict
import openai  # You'll need to install openai package
import os
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse
import os

# Directory where query files will be saved
SAVE_PATH = "./saved_queries"
os.makedirs(SAVE_PATH, exist_ok=True)  # Ensure the directory exists

# Initialize FastAPI app
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class QueryRequest(BaseModel):
    query: str

class DatabaseMetadata(BaseModel):
    catalogs: List[str]
    current_catalog: str
    current_schema: str

class TableMetadata(BaseModel):
    table_name: str
    columns: List[Dict[str, str]]

# Trino connection function
def create_trino_connection():
    conn = connect(
        host='https://<server ip >',
        port="<port>",
        user='test',
        catalog='data_market',
        schema='rd_1_1_domain',
        http_scheme='https',
        auth=BasicAuthentication("test", "test@123"),
        verify=False 
    )
    return conn

# Get all catalogs and schemas
@app.get("/metadata")
async def get_metadata():
    try:
        with create_trino_connection() as conn:
            cursor = conn.cursor()
            
            # Get catalogs
            cursor.execute("SHOW CATALOGS")
            catalogs = [row[0] for row in cursor.fetchall()]
            
            # Get current catalog and schema
            cursor.execute("SELECT current_catalog, current_schema")
            current = cursor.fetchone()
            
            return {
                "catalogs": catalogs,
                "current_catalog": current[0],
                "current_schema": current[1]
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get schemas for a catalog
@app.get("/catalog/{catalog}/schemas")
async def get_schemas(catalog: str):
    try:
        with create_trino_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SHOW SCHEMAS FROM {catalog}")
            schemas = [row[0] for row in cursor.fetchall()]
            return {"schemas": schemas}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get tables for a schema
@app.get("/catalog/{catalog}/schema/{schema}/tables")
async def get_tables(catalog: str, schema: str):
    try:
        with create_trino_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SHOW TABLES FROM {catalog}.{schema}")
            tables = [row[0] for row in cursor.fetchall()]
            return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get table columns
@app.get("/catalog/{catalog}/schema/{schema}/table/{table}/columns")
async def get_table_columns(catalog: str, schema: str, table: str):
    try:
        with create_trino_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"DESCRIBE {catalog}.{schema}.{table}")
            columns = [{"name": row[0], "type": row[1]} for row in cursor.fetchall()]
            return {"columns": columns}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Execute query endpoint
@app.post("/execute-query")
async def execute_query(query_request: QueryRequest):
    query = query_request.query
    try:
        with create_trino_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            # Get column names
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
            return {"status": "success", "columns": columns, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Add this to the existing imports and configurations

# OpenAI Configuration
openai.api_key = os.getenv('OPENAI_API_KEY')  # Set this in your environment

class SQLHelperRequest(BaseModel):
    table_name: str
    catalog: str
    natural_language_query: str = ""
    schema_: str = Field(..., alias='schema')
    dialect: str ="trino"

class SQLSuggestionRequest(BaseModel):
    table_name: str
    catalog: str
    schema_: str = Field(..., alias='schema')

class SQLQuerySuggestion(BaseModel):
    description: str
    query: str


@app.post("/sql-helper")
async def generate_sql_query(request: SQLHelperRequest):
    try:
        # First, get table columns to provide context
        with create_trino_connection() as conn:
            cursor = conn.cursor()
            # Use schema_ instead of schema
            cursor.execute(f"DESCRIBE {request.catalog}.{request.schema_}.{request.table_name}")
            columns = [{"name": row[0], "type": row[1]} for row in cursor.fetchall()]
        
        # Only proceed with OpenAI if there's a natural language query
        if not request.natural_language_query:
            return {"generated_query": ""}

        # Prepare context for GPT
        column_context = "\n".join([f"{col['name']} ({col['type']})" for col in columns])
        
        prompt = f"""
        You are a SQL query generator. Given table named {request.catalog}.{request.schema_}.{request.table_name} with the following columns:
        {column_context}

        Generate a SQL query based on this natural language request: 
        "{request.natural_language_query}"

       Respond with only the SQL code, without any extra explanations, comments, or annotations.
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful SQL query assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        generated_query = response.choices[0].message.content.strip()
        # Clean up any extra text if it exists
        if generated_query.startswith('"""'):
            generated_query = generated_query.strip('"""').strip()
        return {"generated_query": generated_query}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/sql-suggestions")
async def generateSqlSuggestions(request: SQLSuggestionRequest):
    try:
        # Get table columns first
        with create_trino_connection() as conn:
            cursor = conn.cursor()
            # Use schema_ instead of schema
            cursor.execute(f"DESCRIBE {request.catalog}.{request.schema_}.{request.table_name}")
            columns = [{"name": row[0], "type": row[1]} for row in cursor.fetchall()]
        
        # Generate dynamic suggestions based on table columns
        numeric_columns = [col["name"] for col in columns if any(type_name in col["type"].lower() 
                         for type_name in ["int", "double", "decimal", "float"])]
        
        suggestions = [
            SQLQuerySuggestion(
                description="Preview Data",
                query=f"SELECT * FROM {request.catalog}.{request.schema_}.{request.table_name} LIMIT 10"
            ),
            SQLQuerySuggestion(
                description="Total Row Count",
                query=f"SELECT COUNT(*) as total_rows FROM {request.catalog}.{request.schema_}.{request.table_name}"
            )
        ]

        # Add aggregate suggestions for numeric columns
        if numeric_columns:
            col = numeric_columns[0]  # Use the first numeric column as an example
            suggestions.append(
                SQLQuerySuggestion(
                    description=f"Basic Statistics for {col}",
                    query=f"""SELECT 
                        COUNT({col}) as count,
                        AVG({col}) as average,
                        MIN({col}) as minimum,
                        MAX({col}) as maximum
                    FROM {request.catalog}.{request.schema_}.{request.table_name}"""
                )
            )
        
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

# Request model for saving queries
class SaveQueryRequest(BaseModel):
    query: str
    filename: str

@app.post("/save-query")
async def save_query(request: SaveQueryRequest):
    """Save the query as a file on the server."""
    try:
        # Construct the full path for the file
        file_path = os.path.join(SAVE_PATH, request.filename)
        
        # Save the query content to the file
        with open(file_path, "w") as file:
            file.write(request.query)
        
        return JSONResponse(content={"message": "Query file saved successfully!"}, status_code=200)
    except Exception as e:
        # Return an error response in case of failure
        raise HTTPException(status_code=500, detail=f"Failed to save query file: {str(e)}")
    
    
@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        return {"filename": file.filename, "content": content.decode("utf-8")}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to upload file: {str(e)}")


# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)