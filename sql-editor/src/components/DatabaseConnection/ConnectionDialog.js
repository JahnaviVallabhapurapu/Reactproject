import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

function ConnectionDialog({ open, onClose, onConnect }) {
  const [connection, setConnection] = useState({
    type: 'postgresql',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  });

  const handleConnect = () => {
    onConnect(connection);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Connect to Database</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Database Type</InputLabel>
            <Select
              value={connection.type}
              label="Database Type"
              onChange={(e) => setConnection({...connection, type: e.target.value})}
            >
              <MenuItem value="postgresql">PostgreSQL</MenuItem>
              <MenuItem value="mysql">MySQL</MenuItem>
              <MenuItem value="trino">Trino</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Host"
            value={connection.host}
            onChange={(e) => setConnection({...connection, host: e.target.value})}
            fullWidth
          />
          <TextField
            label="Port"
            value={connection.port}
            onChange={(e) => setConnection({...connection, port: e.target.value})}
            fullWidth
          />
          <TextField
            label="Database"
            value={connection.database}
            onChange={(e) => setConnection({...connection, database: e.target.value})}
            fullWidth
          />
          <TextField
            label="Username"
            value={connection.username}
            onChange={(e) => setConnection({...connection, username: e.target.value})}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={connection.password}
            onChange={(e) => setConnection({...connection, password: e.target.value})}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConnect} variant="contained">
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConnectionDialog;