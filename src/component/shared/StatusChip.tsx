import React from 'react';
import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string;
}

export default function StatusChip({ status }: StatusChipProps) {
  const getChipProps = (stat: string) => {
    const upper = (stat || '').toUpperCase();
    switch (upper) {
      case 'ACTIVE':
      case 'PASS':
      case 'APPROVED':
      case 'COMPLETED':
        return { label: upper, color: 'success' as const };
      case 'INACTIVE':
      case 'FAIL':
      case 'CANCELLED':
        return { label: upper, color: 'error' as const };
      case 'UPCOMING':
      case 'PENDING':
        return { label: upper, color: 'info' as const };
      case 'DRAFT':
      default:
        return { label: upper || 'DRAFT', color: 'default' as const };
    }
  };

  const props = getChipProps(status);

  return <Chip label={props.label} color={props.color} size="small" sx={{ fontWeight: 600 }} />;
}
