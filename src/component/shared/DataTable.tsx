import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, Box } from '@mui/material';
import EmptyState from './EmptyState';

interface DataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  loading?: boolean;
  height?: number | string;
  emptyMessage?: string;
  pageSize?: number;
}

export default function DataTable<T extends Record<string, any>>({
  rows,
  columns,
  loading = false,
  height = 450,
  emptyMessage = "No records found",
  pageSize = 10,
}: DataTableProps<T>) {
  return (
    <Paper sx={{ width: '100%', height, overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize } },
        }}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <EmptyState title={emptyMessage} />
            </Box>
          ),
        }}
      />
    </Paper>
  );
}
