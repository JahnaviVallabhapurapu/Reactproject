import React from 'react';
import { Box, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import StorageIcon from '@mui/icons-material/Storage';

function Toolbar({ onExecute, onFormat, onConnect, isConnected }) {
  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
      <Button
        variant="contained"
        startIcon={<PlayArrowIcon />}
        onClick={onExecute}
        disabled={!isConnected}
      >
        Execute
      </Button>
      <Button
        variant="outlined"
        startIcon={<FormatAlignLeftIcon />}
        onClick={onFormat}
      >
        Format
      </Button>
      <Button
        variant={isConnected ? "outlined" : "contained"}
        startIcon={<StorageIcon />}
        onClick={onConnect}
        color={isConnected ? "success" : "primary"}
      >
        {isConnected ? 'Connected' : 'Connect Database'}
      </Button>
    </Box>
  );
}

export default Toolbar;