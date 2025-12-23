import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, CircularProgress,
  Chip, Stack, Avatar, Paper, InputAdornment
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { postData } from '../api/gasClient';
import PersonIcon from '@mui/icons-material/PersonRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthRounded';
import LabelIcon from '@mui/icons-material/LabelRounded';
import PaidIcon from '@mui/icons-material/PaidRounded';

const AddTransaction = ({ members, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    payer: members.length > 0 ? members[0].name : '',
    for_whom: members.map(m => m.name), // Default to everyone
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayerChange = (name) => {
    setFormData(prev => ({ ...prev, payer: name }));
  };

  const handleTargetChange = (name) => {
    setFormData(prev => {
      const current = prev.for_whom;
      const newTargets = current.includes(name)
        ? current.filter(n => n !== name)
        : [...current, name];
      return { ...prev, for_whom: newTargets };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.title || formData.for_whom.length === 0) {
      alert("必須項目を入力してください");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      id: uuidv4(),
      ...formData
    };

    try {
      await postData('addTransaction', payload);
      alert('登録しました');
      onComplete();
    } catch (error) {
      console.error(error);
      alert('送信に失敗しました');
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 2 }}>

      <Typography variant="h5" fontWeight="800" gutterBottom color="primary.main">
        新規取引
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          background: '#ffffff',
          border: '1px solid #E0E0E0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Stack spacing={3}>
          <TextField
            label="日付"
            type="date"
            name="date"
            variant="filled"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon color="action" />
                </InputAdornment>
              ),
              disableUnderline: true,
              style: { borderRadius: 12, backgroundColor: '#F5F5F5' }
            }}
            sx={{ '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
          />

          <TextField
            label="用途"
            name="title"
            placeholder="例: ランチ、タクシー"
            variant="filled"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LabelIcon color="action" />
                </InputAdornment>
              ),
              disableUnderline: true,
              style: { borderRadius: 12, backgroundColor: '#F5F5F5' }
            }}
            sx={{ '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
          />

          <TextField
            label="金額"
            name="amount"
            type="number"
            placeholder="0"
            variant="filled"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="h6" fontWeight="bold" color="primary.main">¥</Typography>
                </InputAdornment>
              ),
              disableUnderline: true,
              style: { fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 12, backgroundColor: '#F5F5F5' }
            }}
            sx={{ '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
          />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          background: '#ffffff',
          border: '1px solid #E0E0E0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaidIcon fontSize="small" /> 支払った人
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          {members.map(m => (
            <Chip
              key={m.id}
              avatar={<Avatar sx={{ bgcolor: formData.payer === m.name ? 'primary.dark' : 'grey.300' }}>{m.name[0]}</Avatar>}
              label={m.name}
              onClick={() => handlePayerChange(m.name)}
              color={formData.payer === m.name ? "primary" : "default"}
              variant={formData.payer === m.name ? "filled" : "outlined"}
              clickable
              sx={{
                height: 40,
                borderRadius: 20,
                borderWidth: formData.payer === m.name ? 0 : 1,
                fontSize: '1rem',
                p: 0.5,
                borderColor: '#cfd8dc'
              }}
            />
          ))}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          background: '#ffffff',
          border: '1px solid #E0E0E0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" /> 対象者 (割り勘する人)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          {members.map(m => {
            const isSelected = formData.for_whom.includes(m.name);
            return (
              <Chip
                key={m.id}
                label={m.name}
                onClick={() => handleTargetChange(m.name)}
                color={isSelected ? "secondary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                clickable
                sx={{
                  height: 36,
                  borderRadius: 18,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: '#cfd8dc',
                  opacity: isSelected ? 1 : 0.7
                }}
              />
            );
          })}
        </Stack>
      </Paper>

      <Button
        variant="contained"
        size="large"
        type="submit"
        disabled={isSubmitting}
        fullWidth
        sx={{
          height: 56,
          fontSize: '1.1rem',
          borderRadius: 4,
          mt: 2,
          boxShadow: '0 4px 14px 0 rgba(0, 32, 91, 0.3)'
        }}
        startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : null}
      >
        {isSubmitting ? '送信中...' : '登録する'}
      </Button>

    </Box>
  );
};

export default AddTransaction;