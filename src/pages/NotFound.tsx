import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f7fa',
        p: 2,
      }}
    >
      <Paper sx={{ p: 5, textAlign: 'center', maxWidth: 480, borderRadius: '20px' }}>
        <Typography variant="h1" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '96px', fontFamily: 'Montserrat, sans-serif' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Montserrat, sans-serif' }}>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The portal page you are looking for does not exist or has been moved.
        </Typography>
        <Button variant="contained" startIcon={<Home size={18} />} onClick={() => navigate('/')}>
          Back to Portal Home
        </Button>
      </Paper>
    </Box>
  );
}
