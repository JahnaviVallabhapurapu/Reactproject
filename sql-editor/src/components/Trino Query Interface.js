
import React, { useRef,useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Database, Table, Play, Save, Wand2, AlignJustify, X, FileCode } from 'lucide-react';
import { TextField, Button as MuiButton, IconButton, Tooltip } from '@mui/material';
import { format } from 'sql-formatter';
import styled from '@emotion/styled';
import MonacoEditor from "@monaco-editor/react";
import { css } from "@emotion/react";
import { CircularProgress } from '@mui/material';
// Define custom CSS for z-index
const editorStyles = css`
  .monaco-editor .inputarea {
    z-index: 1;
  }
`;
// Styled Components (keeping existing styles...)
const EditorContainer = styled.div`
  position: relative;
  height: 300px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;

    // Add styles to maintain focus on the Monaco editor
  .monaco-editor .inputarea {
    z-index: 1;
    background: transparent !important;
  }
`;

const EditorToolbar = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px;
  border-radius: 4px;
`;

const QueryTabs = styled.div`
  display: flex;
  gap: 2px;
  background: #f1f5f9;
  padding: 8px 8px 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const QueryTab = styled.div`
  padding: 8px 16px;
  background: ${props => props.active ? 'white' : '#e2e8f0'};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.active ? 'white' : '#f8fafc'};
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f8fafc;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
`;

const TableNameSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WandIcon = styled.div`
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#3b82f6' : 'white'};
  color: ${props => props.primary ? 'white' : '#1e293b'};
  border: 1px solid ${props => props.primary ? '#3b82f6' : '#e2e8f0'};
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.primary ? '#2563eb' : '#f8fafc'};
  }
`;


const ResultsTable = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const ResultsTableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-top: 20px;
  position: relative;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;  // Prevent overflow
  }
  
  th {
    background: #f1f5f9;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody tr:nth-child(even) {
    background: #f8fafc;
  }
  
  tbody tr:hover {
    background-color: #e2e8f0;
    cursor: pointer;
  }
`;

const LoadingOverlay = styled.div`
  display: ${({ loading }) => (loading ? 'flex' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #b91c1c;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const StyledTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 16px;
  
  & .MuiOutlinedInput-root {
    background-color: white;
  }
  
  & .MuiOutlinedInput-multiline {
    padding: 0;
  }
`;

const NLQueryContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const GeneratedQueryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
  
  pre {
    background: #1e1e1e;
    color: white;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
  }
`;
const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 16px;
`;

const TreeItem = styled.div`
  padding: 8px 12px;
  padding-left: ${props => props.level * 20}px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const ColumnList = styled.div`
  padding-left: 40px;
  font-size: 0.9em;
  color: #666;
`;

const ColumnItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
`;



const NLQueryInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SuggestionCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

const TrinoQueryInterface = () => {
  const editorRef = useRef(null);
  const [catalogs, setCatalogs] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [schemaData, setSchemaData] = useState({});
  const [tableData, setTableData] = useState({});
  const [columnData, setColumnData] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showSqlHelper, setShowSqlHelper] = useState(false);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [sqlSuggestions, setSqlSuggestions] = useState([]);
  const [expandedColumns, setExpandedColumns] = useState({});
  const [queries, setQueries] = useState([{ id: 1, content: '', name: 'Query 1', editable: false }]);
  const [activeQueryId, setActiveQueryId] = useState(1);
  const [editorInstance, setEditorInstance] = useState(null);
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const monacoConfig = {
    theme: 'vs-dark',
    language: 'sql',
    automaticLayout: true,
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    cursorStyle: 'line',
    fontSize: 14,
    tabSize: 2,
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const [metadataLoading, setMetadataLoading] = useState(false);

  const fetchMetadata = async () => {
    setMetadataLoading(true);
    try {
      const response = await fetch('http://localhost:8000/metadata');
      const data = await response.json();
      setCatalogs(data.catalogs);
    } catch (err) {
      setError('Failed to fetch metadata');
    } finally {
      setMetadataLoading(false);
    }
  };

  const [schemaLoading, setSchemaLoading] = useState({});
  const [tableLoading, setTableLoading] = useState({});
  const [columnLoading, setColumnLoading] = useState({});
  
  const fetchSchemas = async (catalog) => {
    setSchemaLoading((prev) => ({ ...prev, [catalog]: true }));
    try {
      const response = await fetch(`http://localhost:8000/catalog/${catalog}/schemas`);
      const data = await response.json();
      setSchemaData((prev) => ({ ...prev, [catalog]: data.schemas }));
    } catch (err) {
      setError('Failed to fetch schemas');
    } finally {
      setSchemaLoading((prev) => ({ ...prev, [catalog]: false }));
    }
  };
  
  const fetchTables = async (catalog, schema) => {
    setTableLoading((prev) => ({ ...prev, [`${catalog}.${schema}`]: true }));
    try {
      const response = await fetch(`http://localhost:8000/catalog/${catalog}/schema/${schema}/tables`);
      const data = await response.json();
      setTableData((prev) => ({ ...prev, [`${catalog}.${schema}`]: data.tables }));
    } catch (err) {
      setError('Failed to fetch tables');
    } finally {
      setTableLoading((prev) => ({ ...prev, [`${catalog}.${schema}`]: false }));
    }
  };
  
  const fetchColumns = async (catalog, schema, table) => {
    setColumnLoading((prev) => ({ ...prev, [`${catalog}.${schema}.${table}`]: true }));
    try {
      const response = await fetch(`http://localhost:8000/catalog/${catalog}/schema/${schema}/table/${table}/columns`);
      const data = await response.json();
      setColumnData((prev) => ({ ...prev, [`${catalog}.${schema}.${table}`]: data.columns }));
      setSqlSuggestions(generateSqlSuggestions(data.columns, `${catalog}.${schema}.${table}`));
    } catch (err) {
      setError('Failed to fetch columns');
    } finally {
      setColumnLoading((prev) => ({ ...prev, [`${catalog}.${schema}.${table}`]: false }));
    }
  };

  const toggleItem = async (key, type, catalog, schema, table) => {
    if (type === 'table') {
      setExpandedColumns(prev => ({ ...prev, [key]: !prev[key] }));
      if (!columnData[`${catalog}.${schema}.${table}`]) {
        await fetchColumns(catalog, schema, table);
      }
    }
    switch(type) {
      case 'catalog':
        await fetchSchemas(catalog);
        break;
      case 'schema':
        if (catalog && schema) {
          await fetchTables(catalog, schema);
        }
        break;
      default:
        break;
    }
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

 
  const openSqlHelper = (catalog, schema, table) => {
    const tablePath = `${catalog}.${schema}.${table}`;
    setSelectedTable({ catalog, schema, table, path: tablePath });
    const columns = columnData[tablePath] || [];
    setSqlSuggestions(generateSqlSuggestions(columns, tablePath));
    setShowSqlHelper(true);
  };
  const handleWandClick = (e, catalog, schema, table) => {
    e.stopPropagation(); // Prevent tree item click
    openSqlHelper(catalog, schema, table);
  };
    
  const generateSqlSuggestions = (columns, tablePath) => {
    // Filter columns by type for different types of analyses
    const numericColumns = columns.filter(col => 
      ['int', 'double', 'decimal', 'float', 'bigint'].includes(col.type.toLowerCase())
    );
    const dateColumns = columns.filter(col => 
      ['date', 'timestamp', 'datetime'].includes(col.type.toLowerCase())
    );
    const categoricalColumns = columns.filter(col => 
      ['varchar', 'char', 'text', 'string'].includes(col.type.toLowerCase())
    );
  
    // Basic data overview
    const suggestions = [
      {
        description: "Quick Data Overview",
        query: `SELECT * FROM ${tablePath}
  ORDER BY ${dateColumns[0]?.name || columns[0]?.name} DESC
  LIMIT 10`
      }
    ];
  
    // Time-based analysis suggestion, if date columns exist
    if (dateColumns.length > 0) {
      suggestions.push({
        description: "Time-based Analysis",
        query: `SELECT 
    DATE_TRUNC('day', ${dateColumns[0].name}) as date,
    COUNT(*) as daily_count${numericColumns.length > 0 ? `,
    ${numericColumns.map(col => `SUM(${col.name}) as total_${col.name}, AVG(${col.name}) as avg_${col.name}`).join(',\n  ')}` : ''}
  FROM ${tablePath}
  GROUP BY DATE_TRUNC('day', ${dateColumns[0].name})
  ORDER BY date DESC
  LIMIT 30`
      });
    }
  
    // Categorical distribution analysis, if categorical columns exist
    if (categoricalColumns.length > 0) {
      suggestions.push({
        description: "Category Distribution Analysis",
        query: `SELECT 
    ${categoricalColumns.map(col => col.name).join(', ')},
    COUNT(*) as count${numericColumns.length > 0 ? `,
    ${numericColumns.map(col => `SUM(${col.name}) as total_${col.name}, AVG(${col.name}) as avg_${col.name}`).join(',\n  ')}` : ''}
  FROM ${tablePath}
  GROUP BY ${categoricalColumns.map(col => col.name).join(', ')}
  ORDER BY count DESC
  LIMIT 20`
      });
    }
  
    // Outlier detection, if numeric columns exist
    if (numericColumns.length > 0) {
      suggestions.push({
        description: "Outlier Detection",
        query: `WITH stats AS (
    SELECT
      ${numericColumns.map(col => `AVG(${col.name}) as avg_${col.name}, STDDEV(${col.name}) as stddev_${col.name}`).join(',\n    ')}
    FROM ${tablePath}
  )
  SELECT *
  FROM ${tablePath}
  WHERE ${numericColumns.map(col => `${col.name} > (SELECT avg_${col.name} + 2 * stddev_${col.name} FROM stats)
    OR ${col.name} < (SELECT avg_${col.name} - 2 * stddev_${col.name} FROM stats)`).join(' OR\n  ')}
  LIMIT 100`
      });
    }
  
    // Ensure at least three unique suggestions by limiting the array
    return suggestions.slice(0, 3);
  };
  
 
  // / Update the applySuggestion function
const applySuggestion = (suggestedQuery) => {
  const activeQuery = queries.find(q => q.id === activeQueryId);
  if (!activeQuery) return;

  const editorInstance = editorRef.current;
  if (editorInstance) {
    const model = editorInstance.getModel();
    
    // Check if the model is disposed before accessing it
    if (model && !model.isDisposed()) {
      const existingContent = activeQuery.content || '';
      const newContent = `${existingContent}\n\n${suggestedQuery}`;

      updateQueryContent(activeQueryId, newContent);
      
      // Delay focusing to prevent accessing a disposed model
      setTimeout(() => {
        if (!model.isDisposed()) { // Recheck before setting position
          editorInstance.focus();
          editorInstance.setPosition({
            lineNumber: model.getLineCount(),
            column: model.getLineMaxColumn(model.getLineCount())
          });
        }
      }, 100); // Adjust delay if necessary
    }
  }
  setShowSqlHelper(false);
};

  
  const handleEditorChange = (value) => {
    updateQueryContent(activeQueryId, value);
  
    // Keep the editor focused after each update
    const editorInstance = editorRef.current;
    if (editorInstance) {
      editorInstance.focus();
  
      // Move cursor to the end of the text
      const model = editorInstance.getModel();
      const lineNumber = model.getLineCount();
      const column = model.getLineMaxColumn(lineNumber);
      editorInstance.setPosition({ lineNumber, column });
    }
  };
  
    const generateNLPQuery = async () => {
      if (!selectedTable || !naturalLanguageQuery.trim()) return;
    
      try {
        const tableColumns = columnData[selectedTable.path] || [];
      
      const response = await fetch('http://localhost:8000/sql-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_name: selectedTable.table,  // Table name only
          catalog: selectedTable.catalog,   // Catalog
          schema: selectedTable.schema,     // Use "schema" instead of "schema_"
          natural_language_query: naturalLanguageQuery,
          dialect: 'trino'// Specify Trino dialect
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // Ensure the generated query follows Trino syntax
      const trinoQuery = data.generated_query
        .replace(/"/g, '"')  // Replace double quotes with Trino-style quotes
        .replace(/`/g, '"')  // Replace backticks with Trino-style quotes
        .replace(/LIMIT (\d+) OFFSET (\d+)/gi, 'OFFSET $2 LIMIT $1'); // Fix LIMIT OFFSET syntax
      
      setGeneratedQuery(trinoQuery);
    } catch (err) {
      setError('Failed to generate SQL query. Please try again.');
    }
  };

  const handleNLQueryChange = (e) => {
    const newValue = e.target.value;
    setNaturalLanguageQuery(newValue);
  };

  const SQLHelperModal = () => {
    if (!showSqlHelper) return null;

    return (
      <Modal>
        <ModalContent>
          <ModalHeader>
            <h3>SQL Query Helper - {selectedTable?.path}</h3>
            <Button onClick={() => setShowSqlHelper(false)}>
              <X size={16} />
            </Button>
          </ModalHeader>
          
          <NLQueryContainer>
            <h4>Natural Language Query</h4>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={naturalLanguageQuery}
              onChange={handleNLQueryChange}
              placeholder="Describe what you want to query in plain English..."
              helperText="Example: Show me the total sales by region for the last 3 months"
              autoFocus
              InputProps={{
                autoFocus: true,
                onFocus: (e) => {
                  // Maintain cursor position on focus
                  const value = e.target.value;
                  e.target.value = '';
                  e.target.value = value;
                }
              }}
            />
            <MuiButton
              variant="contained"
              color="primary"
              onClick={generateNLPQuery}
              disabled={!naturalLanguageQuery.trim()}
            >
              Generate SQL
            </MuiButton>
            
            {generatedQuery && (
              <GeneratedQueryCard>
                <h4>Generated Trino Query:</h4>
                <pre>{generatedQuery}</pre>
                <MuiButton
                  variant="outlined"
                  color="primary"
                  onClick={() => applySuggestion(generatedQuery)}
                  style={{ marginTop: '12px' }}
                >
                  Use This Query
                </MuiButton>
              </GeneratedQueryCard>
            )}
          </NLQueryContainer>
          
          <ModalBody>
            <h4>Common Query Templates</h4>
            {sqlSuggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                onClick={() => applySuggestion(suggestion.query)}
              >
                <h4>{suggestion.description}</h4>
                <pre>{suggestion.query}</pre>
              </SuggestionCard>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  const trinoLanguageConfig = {
    keywords: [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
      'LIMIT', 'OFFSET', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
      'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
      'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION', 'ALL',
      'WITH', 'AS', 'CROSS', 'FULL', 'USING', 'NATURAL', 'DISTINCT',
      'ARRAY', 'MAP', 'ROW', 'DATE', 'TIME', 'TIMESTAMP', 'INTERVAL',
      'UNNEST', 'LATERAL', 'ORDINALITY', 'INTERSECT', 'EXCEPT'
    ],
    builtinFunctions: [
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'FIRST', 'LAST',
      'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'NTH_VALUE',
      'RANK', 'DENSE_RANK', 'ROW_NUMBER', 'NTILE', 'COALESCE',
      'NULLIF', 'CAST', 'TRY_CAST', 'EXTRACT', 'DATE_TRUNC'
    ],
    tokenizer: {
      root: [
        // Keywords and functions
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@builtinFunctions': 'function',
            '@default': 'identifier'
          }
        }],
        // Comments
        [/--.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        // Strings
        [/'[^']*'/, 'string'],
        [/"[^"]*"/, 'string'],
        // Numbers
        [/\b\d+(\.\d+)?\b/, 'number'],
        // SQL Operators
        [/==|>=|<=|<>|!=|[><=+\-*/%]/, 'operator'],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ]
    }
  };
  
  

  useEffect(() => {
    if (editorInstance) {
      // Register Trino SQL language
      editorInstance.languages.register({ id: 'trino-sql' });
      editorInstance.languages.setMonarchTokensProvider('trino-sql', {
        keywords: trinoLanguageConfig.keywords,
        operators: trinoLanguageConfig.operators,
        builtinFunctions: trinoLanguageConfig.builtinFunctions,
        tokenizer: {
          root: [
            [/[a-zA-Z_]\w*/, {
              cases: {
                '@keywords': 'keyword',
                '@builtinFunctions': 'predefined',
                '@default': 'identifier'
              }
            }],
            [/--.*$/, 'comment'],
            [/\/\*/, 'comment', '@comment'],
            [/'[^']*'/, 'string'],
            [/"[^"]*"/, 'string'],
            [/[0-9]+/, 'number'],
            [/[<>]=?|[-+*/%=]/, 'operator'],
          ],
          comment: [
            [/[^/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment']
          ]
        }
      });
    }
  }, [editorInstance]);
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.languages.register({ id: 'trino-sql' });
    monaco.languages.setMonarchTokensProvider('trino-sql', trinoLanguageConfig);
  };
  
  const formatQuery = () => {
    const activeQuery = queries.find(q => q.id === activeQueryId);
    if (activeQuery) {
      // Split by semicolons to identify separate queries
      const individualQueries = activeQuery.content.split(";");
  
      // Format each query, trim, and remove any trailing semicolons
      const formattedQueries = individualQueries.map((query) => {
        const formattedQuery = format(query.trim(), {
          language: 'trino',
          uppercase: true,
          linesBetweenQueries: 2
        });
        return formattedQuery.replace(/;\s*$/, "")+ ";"; // Remove trailing semicolon
      });
  
      // Join formatted queries with double line breaks
      const formattedContent = formattedQueries.join("\n\n");
      updateQueryContent(activeQueryId, formattedContent);
    }
  };
  

  const updateQueryContent = (id, content) => {
    setQueries(queries.map(q => 
      q.id === id ? { ...q, content } : q
    ));
  };

  const addNewQuery = () => {
    const newId = Math.max(...queries.map(q => q.id)) + 1;
    setQueries([...queries, { id: newId, content: '' }]);
    setActiveQueryId(newId);
  };

  const removeQuery = (id) => {
    if (queries.length > 1) {
      const newQueries = queries.filter(q => q.id !== id);
      setQueries(newQueries);
      if (activeQueryId === id) {
        setActiveQueryId(newQueries[0].id);
      }
    }
  };

  const executeSelectedQuery = () => {
    const activeQuery = queries.find(q => q.id === activeQueryId);
    if (!activeQuery?.content) return;
  
    const queryContent = editorInstance?.getSelection()?.toString() || activeQuery.content;
    const queriesToExecute = queryContent.split(";").map(query => query.trim()).filter(query => query);
  
    // Execute each query individually
    queriesToExecute.forEach(query => {
      executeQuery(query);
    });
  };
  
  const [queryLoading, setQueryLoading] = useState(false);

  const executeQuery = async (queryText) => {
    setQueryLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setQueryLoading(false);
    }
  };
// States
const [isRenameDialogOpen, setRenameDialogOpen] = useState(false);
const [newFilename, setNewFilename] = useState("");

// Handle file renaming
const handleRenameFile = () => {
  if (!newFilename.trim()) return;
  setFilename(newFilename);
  setRenameDialogOpen(false);
};

// Handle file uploads
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-file', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      updateQueryContent(activeQueryId, data.content); // Update with backend response
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};


// Save query to the backend
const saveQuery = async (query, filename) => {
  if (!query || !filename) {
    alert("Both query content and filename are required.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/save-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, filename }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to save query: ${error}`);
    }

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error("Error saving query:", error);
  }
};



// Update a query's name
const updateQueryName = (id, name) => {
  setQueries((prevQueries) =>
    prevQueries.map((query) =>
      query.id === id ? { ...query, name } : query
    )
  );
};

// Set a query's editable state
const setQueryEditable = (id, editable) => {
  setQueries((prevQueries) =>
    prevQueries.map((query) =>
      query.id === id ? { ...query, editable } : query
    )
  );
};

  const QuerySection = () => (
    <div>
      <QueryTabs>
        {queries.map(query => (
          <QueryTab
          key={query.id}
          active={query.id === activeQueryId}
          onClick={() => setActiveQueryId(query.id)}
        >
          {query.editable ? (
            <input
              type="text"
              value={query.name}
              onChange={(e) => {
                updateQueryName(query.id, e.target.value);
              }}
              onBlur={() => setQueryEditable(query.id, false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  setQueryEditable(query.id, false);
                }
              }}
              autoFocus
            />
          ) : (
            <span onDoubleClick={() => setQueryEditable(query.id, true)}>
              {query.name || `Query ${query.id}`}
            </span>
          )}
          {queries.length > 1 && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                removeQuery(query.id);
              }}
            >
              <X size={14} />
            </IconButton>
          )}
        </QueryTab>
        
        ))}
        <Tooltip title="Add new query">
          <IconButton onClick={addNewQuery}>
            <FileCode size={20} />
          </IconButton>
        </Tooltip>
      </QueryTabs>
      
      <EditorContainer>
        <EditorToolbar>
  
          {/* Save File Option */}
          <Tooltip title="Save Query">
            <IconButton
              onClick={() => {
                const activeQuery = queries.find(q => q.id === activeQueryId);
                const activeFilename = activeQuery?.name || `query_${activeQueryId}.sql`;
                saveQuery(activeQuery?.content, activeFilename);
              }}
              size="small"
            >
              <Save size={16} />
            </IconButton>
          </Tooltip>
  
          {/* Upload File Option */}
          <Tooltip title="Upload File">
            <MuiButton
              variant="contained"
              component="label"
            >
              Upload
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </MuiButton>
          </Tooltip>
  
          {/* Format SQL Option */}
          <Tooltip title="Format SQL">
            <IconButton onClick={formatQuery} size="small">
              <AlignJustify size={16} />
            </IconButton>
          </Tooltip>
  
          {/* Run SQL Option */}
          <Tooltip title="Run selected or all">
            <IconButton onClick={executeSelectedQuery} size="small">
              <Play size={16} />
            </IconButton>
          </Tooltip>
        </EditorToolbar>
  
        {queryLoading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress />
          </div>
        )}
  
        <MonacoEditor
          height="100%"
          defaultLanguage="trino-sql"
          theme="vs-dark"
          value={queries.find(q => q.id === activeQueryId)?.content || ''}
          options={{
            autoFocus: true,
            automaticLayout: true,
            fixedOverflowWidgets: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
          }}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      </EditorContainer>
  
      {/* Rename File Dialog */}
      {isRenameDialogOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h4>Rename File</h4>
              <Button onClick={() => setRenameDialogOpen(false)}><X size={16} /></Button>
            </ModalHeader>
            <ModalBody>
              <TextField
                label="New Filename"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
              />
              <MuiButton
                variant="contained"
                color="primary"
                onClick={handleRenameFile}
              >
                Rename
              </MuiButton>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
  
// In the ResultsTable component
const ResultsTable = ({ results, loading }) => (
  <ResultsTableContainer>
    <LoadingOverlay loading={loading}>
      <CircularProgress />
      <span style={{ marginLeft: '8px' }}>Loading data...</span>
    </LoadingOverlay>
    <StyledTable>
      <thead>
        <tr>
          {results.columns?.map((column, i) => (
            <th key={i}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results?.data?.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} title={cell.toString()}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  </ResultsTableContainer>
);

  const TreeItemWithContextMenu = ({ level, catalog, schema, table, children }) => {
    const itemKey = table ? `${catalog}.${schema}.${table}` : schema ? `${catalog}.${schema}` : catalog;
    const columns = columnData[itemKey] || [];
    const isColumnsExpanded = expandedColumns[itemKey];
    const isColumnLoading = columnLoading[itemKey] || false;
    const isSchemaLoading = schemaLoading[catalog] || false;
  
    return (
      <>
        <TreeItem
          level={level}
          onClick={() => {
            const itemType = table ? 'table' : schema ? 'schema' : 'catalog';
            toggleItem(itemKey, itemType, catalog, schema, table);
          }}
        >
          {table ? (
            <TableRow>
              <TableNameSection>
                <Table size={16} />
                {table}
                {columns.length > 0 && (
                  <>
                    {isColumnLoading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <ChevronRight
                        size={14}
                        style={{
                          transform: isColumnsExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s'
                        }}
                      />
                    )}
                  </>
                )}
              </TableNameSection>
              <WandIcon onClick={(e) => {
                e.stopPropagation();
                handleWandClick(e, catalog, schema, table);
              }}>
                <Wand2 size={16} />
              </WandIcon>
            </TableRow>
          ) : (
            <>
              {expandedItems[itemKey] ? (
                isSchemaLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <ChevronDown size={16} />
                )
              ) : (
                isSchemaLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <ChevronRight size={16} />
                )
              )}
              {schema ? <Table size={16} /> : <Database size={16} />}
              {children}
            </>
          )}
        </TreeItem>
  
        {table && isColumnsExpanded && (
          <ColumnList>
            {columns.map((column, index) => (
              <ColumnItem key={index}>
                <AlignJustify size={12} />
                {column.name} ({column.type})
              </ColumnItem>
            ))}
          </ColumnList>
        )}
      </>
    );
  };

    // Main component return statement
    return (
      <Container>

        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar>
            {catalogs?.map((catalog) => (
              <div key={catalog}>
                <TreeItemWithContextMenu level={1} catalog={catalog} schema={null} table={null}>
                  {catalog}
                </TreeItemWithContextMenu>
                {expandedItems[catalog] && schemaData[catalog]?.map((schemaName) => (
                  <div key={`${catalog}.${schemaName}`}>
                    <TreeItemWithContextMenu level={2} catalog={catalog} schema={schemaName} table={null}>
                      {schemaName}
                    </TreeItemWithContextMenu>
                    {expandedItems[`${catalog}.${schemaName}`] && tableData[`${catalog}.${schemaName}`]?.map((tableName) => (
                      <TreeItemWithContextMenu
                        key={`${catalog}.${schemaName}.${tableName}`}
                        level={3}
                        catalog={catalog}
                        schema={schemaName}
                        table={tableName}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </Sidebar>
          <MainContent>
            <QuerySection />

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {results && (
              <ResultsTable results={results} loading={queryLoading} />
            )}
            <SQLHelperModal />
          </MainContent>
        </div>
      </Container>
    );
  };

  export default TrinoQueryInterface;