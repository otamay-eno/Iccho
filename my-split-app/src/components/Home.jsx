import React, { useState } from 'react';
import {
  Typography, List, ListItem, ListItemText, Grid, Chip, Box, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack,
  InputAdornment, Avatar, CircularProgress
} from '@mui/material';
import PaidIcon from '@mui/icons-material/PaidRounded';
import ReceiptIcon from '@mui/icons-material/ReceiptLongRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthRounded';
import LabelIcon from '@mui/icons-material/LabelRounded';
import { postData } from '../api/gasClient';

const Home = ({ members, transactions, refreshData }) => {
  // State for Edit/Delete
  const [editTransaction, setEditTransaction] = useState(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    payer: '',
    for_whom: [],
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 収支計算ロジック
  const calculateBalances = () => {
    const balances = {};
    members.forEach(m => balances[m.name] = 0);

    transactions.forEach(t => {
      const amount = Number(t.amount);
      const payer = t.payer;
      const targets = t.for_whom;

      if (!targets || targets.length === 0) return;

      // 支払った人はプラス
      if (balances[payer] !== undefined) {
        balances[payer] += amount;
      }

      // 対象者はマイナス (一人当たりの金額)
      const splitAmount = amount / targets.length;
      targets.forEach(target => {
        if (balances[target] !== undefined) {
          balances[target] -= splitAmount;
        }
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  // Handlers
  const handleOpenEdit = (t) => {
    setEditTransaction(t);
    setFormData({
      title: t.title,
      amount: t.amount,
      payer: t.payer,
      for_whom: t.for_whom,
      date: t.date
    });
  };

  const handleUpdateTransaction = async () => {
    if (!formData.title || !formData.amount || formData.for_whom.length === 0) {
      alert("必須項目を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      await postData('updateTransaction', { id: editTransaction.id, ...formData });
      if (refreshData) refreshData();
      else window.location.reload(); // Fallback if refreshData not props
      setEditTransaction(null);
    } catch (e) {
      console.error(e);
      alert('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTransactionId) return;

    try {
      await postData('deleteTransaction', { id: deleteTransactionId });
      if (refreshData) refreshData();
      else window.location.reload();
      setDeleteTransactionId(null);
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 収支サマリー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <PaidIcon color="primary" /> 収支状況
        </Typography>
        <Grid container spacing={2}>
          {members.map((member) => {
            const bal = balances[member.name] || 0;
            const isPlus = bal >= 0;
            return (
              <Grid item xs={6} key={member.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderLeft: isPlus ? '6px solid #00A3E0' : '6px solid #B0B0B0',
                    transition: 'transform 0.2s',
                    '&:active': { transform: 'scale(0.98)' }
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    {member.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: isPlus ? '#00A3E0' : '#666',
                      fontWeight: 800,
                      my: 0.5
                    }}
                  >
                    {isPlus ? '+' : ''}{Math.round(bal).toLocaleString()}
                  </Typography>
                  <Chip
                    label={isPlus ? '受取' : '支払'}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      backgroundColor: isPlus ? 'rgba(0, 163, 224, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      color: isPlus ? '#0074AE' : '#666'
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* 取引履歴 */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <ReceiptIcon color="secondary" /> 最近の履歴
        </Typography>
        <List sx={{ width: '100%', p: 0 }}>
          {transactions.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed rgba(0,0,0,0.1)' }}>
              <Typography color="text.secondary">履歴がありません</Typography>
            </Paper>
          )}
          {transactions.map((t) => (
            <Paper
              key={t.id}
              elevation={1}
              sx={{
                mb: 1.5,
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.03)'
              }}
            >
              <ListItem
                alignItems="flex-start"
                sx={{ px: 2, py: 2 }}
                secondaryAction={
                  <Box display="flex" flexDirection="column" gap={0}>
                    <IconButton size="small" onClick={() => handleOpenEdit(t)} sx={{ color: 'primary.light' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteTransactionId(t.id)} sx={{ color: 'grey.300', '&:hover': { color: 'error.main' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5} pr={4}>
                      <Typography variant="subtitle1" fontWeight="700" color="primary.main">{t.title}</Typography>
                      <Typography variant="h6" fontWeight="700" color="primary.main">
                        ¥{Number(t.amount).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Chip
                          size="small"
                          label={`支払: ${t.payer}`}
                          icon={<PersonIcon style={{ fontSize: 14 }} />}
                          sx={{ borderRadius: 1, backgroundColor: 'rgba(0, 32, 91, 0.05)', color: 'text.secondary' }}
                        />
                        <Typography variant="caption" color="text.disabled">
                          {t.date.replace(/-/g, '/')}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        対象: {t.for_whom.join(', ')}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTransaction}
        onClose={() => setEditTransaction(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle fontWeight="bold" color="primary.main">取引の編集</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="日付" type="date" name="date" variant="filled"
              value={formData.date} onChange={handleChange} fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{ disableUnderline: true, style: { borderRadius: 12, backgroundColor: '#F5F5F5' }, startAdornment: (<InputAdornment position="start"><CalendarMonthIcon color="action" /></InputAdornment>) }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
            />
            <TextField
              label="用途" name="title" variant="filled"
              value={formData.title} onChange={handleChange} fullWidth
              InputProps={{ disableUnderline: true, style: { borderRadius: 12, backgroundColor: '#F5F5F5' }, startAdornment: (<InputAdornment position="start"><LabelIcon color="action" /></InputAdornment>) }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
            />
            <TextField
              label="金額" name="amount" type="number" variant="filled"
              value={formData.amount} onChange={handleChange} fullWidth
              InputProps={{ disableUnderline: true, style: { borderRadius: 12, backgroundColor: '#F5F5F5', fontWeight: 'bold' }, startAdornment: (<InputAdornment position="start">¥</InputAdornment>) }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#F5F5F5' } }}
            />

            <Box>
              <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom>支払った人</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {members.map(m => (
                  <Chip key={m.id} label={m.name} onClick={() => setFormData(p => ({ ...p, payer: m.name }))}
                    color={formData.payer === m.name ? "primary" : "default"} variant={formData.payer === m.name ? "filled" : "outlined"}
                    clickable sx={{ borderRadius: 20 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom>対象者</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {members.map(m => {
                  const isSelected = formData.for_whom.includes(m.name);
                  return (
                    <Chip key={m.id} label={m.name}
                      onClick={() => setFormData(p => ({ ...p, for_whom: isSelected ? p.for_whom.filter(n => n !== m.name) : [...p.for_whom, m.name] }))}
                      color={isSelected ? "secondary" : "default"} variant={isSelected ? "filled" : "outlined"}
                      clickable sx={{ borderRadius: 20 }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditTransaction(null)} sx={{ color: 'text.secondary', borderRadius: 2 }}>キャンセル</Button>
          <Button onClick={handleUpdateTransaction} variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2, boxShadow: 'none' }}>
            {isSubmitting ? <CircularProgress size={24} /> : '保存'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTransactionId} onClose={() => setDeleteTransactionId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="bold" color="error">取引の削除</DialogTitle>
        <DialogContent>
          <Typography>この取引履歴を削除してもよろしいですか？</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTransactionId(null)} sx={{ color: 'text.secondary' }}>キャンセル</Button>
          <Button onClick={handleDeleteTransaction} variant="contained" color="error" sx={{ borderRadius: 2, boxShadow: 'none' }}>削除</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Home;