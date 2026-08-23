import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ p: 5, textAlign: 'center', maxWidth: 480, borderRadius: '20px' }}>
        <Box sx={{ color: 'error.main', mb: 2 }}>
          <ShieldAlert size={64} strokeWidth={1.5} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Montserrat, sans-serif' }}>
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You do not have the required role permissions to access this administrative page.
        </Typography>
        <Button variant="contained" startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
