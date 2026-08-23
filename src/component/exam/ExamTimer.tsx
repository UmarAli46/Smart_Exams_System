import React, { useState, useEffect } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getColor = () => {
    if (secondsLeft < 300) return 'error'; // < 5 mins
    if (secondsLeft < 600) return 'warning'; // < 10 mins
    return 'primary';
  };

  return (
    <Chip
      icon={<Clock size={16} />}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '15px' }}>
            {formattedTime}
          </Typography>
        </Box>
      }
      color={getColor()}
      variant="filled"
      sx={{ px: 1, py: 2, borderRadius: '8px' }}
    />
  );
}
