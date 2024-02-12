import React from 'react';
import { Box } from '@mui/material';

function ControlComp() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}
    >
      ControlComp
    </Box>
  );
}
export default ControlComp;
