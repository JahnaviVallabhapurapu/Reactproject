from fastapi import FastAPI
import uvicorn
import pandas as pd

app = FastAPI(debug=True)


@app.get("/")
def home():
    return {"text": "moviedetails"}


df = pd.read_csv("/home/j2v2/React_projects/moviepage/movies.csv")


@app.get("/moviedetails")
def moviedetails(moviename):
    result = df[moviename]
    return result


if __name__ == "__main__":
    uvicorn.run(app)
