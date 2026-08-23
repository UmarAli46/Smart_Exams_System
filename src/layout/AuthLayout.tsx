import React from 'react';
import { Box, Container, Card, Typography } from '@mui/material';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '16px',
              backgroundColor: 'primary.main',
              color: 'white',
              mb: 1.5,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            }}
          >
            <GraduationCap size={32} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: 'Montserrat, sans-serif' }}>
            SMART Exam
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Online Examination Portal
          </Typography>
        </Box>
        <Card sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
          {children}
        </Card>
      </Container>
    </Box>
  );
}
