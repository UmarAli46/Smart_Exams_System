import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, Typography, Alert, Link } from '@mui/material';
import AuthLayout from '../../layout/AuthLayout';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = () => {
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
        Reset Password
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
        Enter your registered email address to receive password reset instructions.
      </Typography>

      {submitted ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset link has been sent to your email!
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5, mt: 2 }}>
            Send Reset Link
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" variant="body2" underline="hover">
          Back to Sign In
        </Link>
      </Box>
    </AuthLayout>
  );
}
