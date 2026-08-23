import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  height?: string | number;
}

export default function LoadingSpinner({
  message = "Loading...",
  height = "300px",
}: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        width: '100%',
      }}
    >
      <CircularProgress size={40} thickness={4} />
      {message && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
