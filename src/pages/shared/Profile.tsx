import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Save, Key, Camera, CheckCircle2, ShieldAlert, AlertTriangle, BookOpen, Shield } from 'lucide-react';
import { detectHumanFaceStructure } from '../../component/exam/FaceVerificationModal';
import type { RootState } from '../../store/store';

export default function Profile() {
  const { user } = useSelector((s: RootState) => s.auth);
  const role = user?.role || 'STUDENT';

  // Camera & Face Registration States (For Students)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faceRegistered, setFaceRegistered] = useState(true);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [liveFaceValid, setLiveFaceValid] = useState<boolean>(false);
  const [liveInstruction, setLiveInstruction] = useState<string>(
    'Initializing camera... Align your face inside the oval frame.'
  );

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (openModal) {
      setErrorMsg(null);
      setStreamActive(false);
      setLiveFaceValid(false);
      setLiveInstruction('Initializing camera... Position your face inside the oval frame.');

      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
        .then((stream) => {
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              setStreamActive(true);
            };
          }
        })
        .catch((err) => {
          console.error('Camera access error:', err);
          setErrorMsg('Could not access camera for face registration. Check browser permissions.');
        });
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [openModal]);

  useEffect(() => {
    if (!openModal || !streamActive || loading) return;

    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const res = detectHumanFaceStructure(ctx, canvas.width, canvas.height);

      if (res.hasFace) {
        setLiveFaceValid(true);
        setLiveInstruction('✓ Face Aligned & Verified! Click "Capture & Register Face".');
        setErrorMsg(null);
      } else {
        setLiveFaceValid(false);
        setLiveInstruction(`⚠️ ${res.reason}`);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [openModal, streamActive, loading]);

  const handleSaveFaceSnapshot = () => {
    if (!videoRef.current || !canvasRef.current || !streamActive || !liveFaceValid) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detection = detectHumanFaceStructure(ctx, canvas.width, canvas.height);
    if (!detection.hasFace) {
      setErrorMsg(detection.reason || 'Facial validation failed.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setFaceRegistered(true);
      setOpenModal(false);
      setSuccessMsg(`Biometric face descriptor registered successfully (${detection.score}% AI Facial Confidence)!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 1000);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header with Role Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          {role === 'ADMIN' ? 'System Administrator Profile' : role === 'TEACHER' ? 'Faculty Academic Profile' : 'Student Account & Biometric Profile'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {role === 'ADMIN'
            ? 'Manage administrator credentials, security access levels, and system audit settings'
            : role === 'TEACHER'
            ? 'Manage faculty credentials, teaching subjects, and academic office hours'
            : 'Manage student academic records, course enrollments, and biometric face authentication'}
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="success" icon={<CheckCircle2 />} sx={{ mb: 3, fontWeight: 600 }}>
          {successMsg}
        </Alert>
      )}

      {/* Primary Account Info Header Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: role === 'ADMIN' ? '#d32f2f' : role === 'TEACHER' ? '#9c27b0' : '#1976d2',
              fontSize: '32px',
              fontWeight: 800,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || (role === 'ADMIN' ? 'A' : role === 'TEACHER' ? 'T' : 'S')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              {user?.name || (role === 'ADMIN' ? 'System Admin' : role === 'TEACHER' ? 'Dr. Sarah Connor' : 'Alex Johnson')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || (role === 'ADMIN' ? 'admin@smart.edu' : role === 'TEACHER' ? 'faculty@smart.edu' : 'student@smart.edu')}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                label={role}
                color={role === 'ADMIN' ? 'error' : role === 'TEACHER' ? 'secondary' : 'primary'}
                size="small"
                sx={{ fontWeight: 800 }}
              />
              {role === 'STUDENT' && (
                <Chip
                  label={faceRegistered ? 'FACE ENROLLED ✓' : 'NO BIOMETRICS'}
                  color={faceRegistered ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              )}
              {role === 'ADMIN' && <Chip label="SUPER ADMIN PRIVILEGES" color="warning" size="small" sx={{ fontWeight: 700 }} />}
              {role === 'TEACHER' && <Chip label="FULL FACULTY PRIVILEGES" color="info" size="small" sx={{ fontWeight: 700 }} />}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ROLE-SPECIFIC FIELD GRID */}
        {role === 'STUDENT' && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Full Name" defaultValue={user?.name || 'Alex Johnson'} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Student Registration ID" defaultValue="STU-1001" disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Department" defaultValue="Computer Science & Engineering" disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Current Semester" defaultValue="Semester 6 (Spring 2026)" disabled fullWidth />
            </Grid>
          </Grid>
        )}

        {role === 'TEACHER' && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Faculty Name" defaultValue={user?.name || 'Dr. Sarah Connor'} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Faculty ID" defaultValue="TCH-2041" disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Academic Department" defaultValue="Software Engineering" disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Designation / Rank" defaultValue="Associate Professor & Head of CS" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Office Location" defaultValue="Building B, Room 402" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Office Hours" defaultValue="Mon & Wed: 14:00 - 16:00" fullWidth />
            </Grid>
          </Grid>
        )}

        {role === 'ADMIN' && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Admin Name" defaultValue={user?.name || 'System Administrator'} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Admin Access ID" defaultValue="ADM-001" disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Security Level" defaultValue="Level 5 (Full System Authority)" disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Operations Unit" defaultValue="IT Security & Examination Control" disabled fullWidth />
            </Grid>
          </Grid>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" startIcon={<Save size={18} />}>
            Save Profile Details
          </Button>
        </Box>
      </Paper>

      {/* ROLE-SPECIFIC CARDS SECTION */}

      {/* 1. STUDENT SPECIFIC BIOMETRICS CARD */}
      {role === 'STUDENT' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Camera size={20} color="#1976d2" /> Facial Recognition Enrollment
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your registered face snapshot is used by the AI engine to authenticate your identity during online examinations.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f5f7fa', p: 2.5, borderRadius: '12px' }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Status: {faceRegistered ? 'Biometric Face Active' : 'Not Registered'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last updated: 2026-02-10 (Baseline 128D Embedding Stored)
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<Camera size={18} />} onClick={() => setOpenModal(true)}>
              {faceRegistered ? 'Update Face Photo' : 'Register My Face'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* 2. TEACHER SPECIFIC COURSES & STATS CARD */}
      {role === 'TEACHER' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookOpen size={20} color="#9c27b0" /> Assigned Teaching Subjects & Responsibilities
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {['Java Programming (CS-301)', 'Object-Oriented Design (SE-204)', 'Database Systems (CS-402)'].map((subject) => (
              <Grid size={{ xs: 12, sm: 4 }} key={subject}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: '12px' }}>
                  <Typography variant="subtitle2" fontWeight={700}>{subject}</Typography>
                  <Typography variant="caption" color="text.secondary">Primary Instructor</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>
              <Box sx={{ p: 2, bgcolor: '#f3e5f5', borderRadius: '12px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} color="secondary.main">142</Typography>
                <Typography variant="caption" color="text.secondary">Questions Authored</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: '12px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} color="primary.main">18</Typography>
                <Typography variant="caption" color="text.secondary">Exams Created</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: '12px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} color="success.main">366</Typography>
                <Typography variant="caption" color="text.secondary">Submissions Evaluated</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* 3. ADMIN SPECIFIC AUDIT & SECURITY CARD */}
      {role === 'ADMIN' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield size={20} color="#d32f2f" /> System Security & Audit Log
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ p: 2, bgcolor: '#fffde7', border: '1px solid #fff59d', borderRadius: '8px' }}>
              <Typography variant="subtitle2" fontWeight={700}>System Health: 100% Operational</Typography>
              <Typography variant="caption" color="text.secondary">PostgreSQL Database Connection: Active • Spring Boot API: Active</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
              <Typography variant="subtitle2" fontWeight={700}>Last Admin Session Login</Typography>
              <Typography variant="caption" color="text.secondary">IP: 192.168.1.45 • Session ID: #ADM-SESS-9821 • Timestamp: Today 14:22</Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Password Change Paper (Common to all) */}
      <Paper sx={{ p: 4, borderRadius: '16px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Key size={20} /> Password & Account Security
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField type="password" label="Current Password" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField type="password" label="New Password" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField type="password" label="Confirm New Password" fullWidth />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined">Update Security Password</Button>
        </Box>
      </Paper>

      {/* Student Self Facial Registration Modal Dialog */}
      {role === 'STUDENT' && (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth sx={{ zIndex: 1400 }}>
          <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
            Biometric Self Face Registration
          </DialogTitle>
          <DialogContent dividers>
            <Alert
              severity={liveFaceValid ? 'success' : 'warning'}
              icon={liveFaceValid ? <CheckCircle2 /> : <AlertTriangle />}
              sx={{ mb: 2, fontWeight: 600 }}
            >
              {liveInstruction}
            </Alert>

            {errorMsg && (
              <Alert severity="error" icon={<ShieldAlert />} sx={{ mb: 2, fontWeight: 500 }}>
                {errorMsg}
              </Alert>
            )}

            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 320,
                bgcolor: '#111',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <Box
                sx={{
                  position: 'absolute',
                  width: 190,
                  height: 240,
                  border: `3.5px dashed ${!streamActive ? '#777777' : liveFaceValid ? '#4caf50' : '#f44336'}`,
                  borderRadius: '50%',
                  boxShadow: liveFaceValid ? '0 0 24px rgba(76, 175, 80, 0.7)' : '0 0 24px rgba(244, 67, 54, 0.7)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  pointerEvents: 'none',
                }}
              />

              <Chip
                label={
                  liveFaceValid
                    ? 'FACE ALIGNED • READY ✓'
                    : streamActive
                    ? 'NO FACE / ALIGNMENT NEEDED ✖'
                    : 'INITIALIZING CAMERA'
                }
                color={liveFaceValid ? 'success' : streamActive ? 'error' : 'default'}
                size="small"
                sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveFaceSnapshot}
              variant="contained"
              color={liveFaceValid ? 'success' : 'error'}
              disabled={!streamActive || loading || !liveFaceValid}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Camera size={18} />}
              sx={{ px: 3, fontWeight: 700 }}
            >
              {loading ? 'Saving AI Descriptor...' : 'Capture & Register Face'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
