'use client';

import React, { useState } from 'react';
import {
    Typography, List, ListItem, ListItemText, Grid, Chip, Box, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack,
    InputAdornment, Avatar, CircularProgress
} from '@mui/material';
import PaidIcon from '@mui/icons-material/PaidRounded';
import ReceiptIcon from '@mui/icons-material/ReceiptLongRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthRounded';
import LabelIcon from '@mui/icons-material/LabelRounded';
import { updateTransaction, deleteTransaction } from '../actions/data';

const Home = ({ members, transactions }) => {
    // State for Edit/Delete
    const [editTransaction, setEditTransaction] = useState(null);
    const [deleteTransactionId, setDeleteTransactionId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        payer_id: '',
        for_who_ids: [],
        date: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 収支計算ロジック
    const calculateBalances = () => {
        const balances = {};
        members.forEach(m => balances[m.name] = 0); // Display uses Names

        transactions.forEach(t => {
            const amount = Number(t.amount);
            const payerName = t.payer_name; // Mapped in page.js
            const targetNames = t.for_who_names; // Mapped in page.js

            if (!targetNames || targetNames.length === 0) return;

            // 支払った人はプラス
            if (balances[payerName] !== undefined) {
                balances[payerName] += amount;
            }

            // 対象者はマイナス (一人当たりの金額)
            const splitAmount = amount / targetNames.length;
            targetNames.forEach(targetName => {
                if (balances[targetName] !== undefined) {
                    balances[targetName] -= splitAmount;
                }
            });
        });

        return balances;
    };

    const balances = calculateBalances();

    // Handlers
    const handleOpenEdit = (t) => {
        setEditTransaction(t);
        // YYYY-MM-DD
        const dateStr = t.date ? t.date.split('T')[0] : '';
        setFormData({
            title: t.title,
            amount: t.amount,
            payer_id: t.payer_id,
            for_who_ids: t.for_who_ids || [],
            date: dateStr
        });
    };

    const handleUpdateTransaction = async () => {
        if (!formData.title || !formData.amount || formData.for_who_ids.length === 0) {
            alert("必須項目を入力してください");
            return;
        }

        setIsSubmitting(true);
        try {
            // Server Action
            await updateTransaction(editTransaction.id, formData);
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

        setIsDeleting(true);
        try {
            await deleteTransaction(deleteTransactionId);
            setDeleteTransactionId(null);
        } catch (e) {
            console.error(e);
            alert('削除に失敗しました');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Toggle helpers
    const handleTogglePayer = (memberId) => {
        setFormData(p => ({ ...p, payer_id: memberId }));
    };

    const handleToggleTarget = (memberId) => {
        setFormData(p => {
            const current = p.for_who_ids;
            if (current.includes(memberId)) {
                return { ...p, for_who_ids: current.filter(id => id !== memberId) };
            } else {
                return { ...p, for_who_ids: [...current, memberId] };
            }
        });
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
                                        <Box mb={0.5}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Typography variant="subtitle1" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2 }}>
                                                    {t.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', mr: 4 }}>
                                                    {t.date ? t.date.split('T')[0].replace(/-/g, '/') : ''}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ mt: 0.5 }}>
                                                ¥{Number(t.amount).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box mt={1} display="flex" flexDirection="column" gap={0.5}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Chip
                                                    size="small"
                                                    label={t.payer_name}
                                                    avatar={<Avatar sx={{ bgcolor: 'primary.main', color: 'white', width: 20, height: 20, fontSize: '0.7rem' }}>{t.payer_name ? t.payer_name[0] : '?'}</Avatar>}
                                                    sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: 'transparent', border: '1px solid #e0e0e0' }}
                                                />
                                                <Typography variant="caption" color="text.secondary">が支払いました</Typography>
                                            </Box>
                                            <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
                                                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>対象:</Typography>
                                                {t.for_who_names && t.for_who_names.map(targetName => (
                                                    <Chip
                                                        key={targetName}
                                                        size="small"
                                                        label={targetName}
                                                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(0, 163, 224, 0.1)', color: '#0074AE' }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    }
                                    sx={{ my: 0 }}
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
                                    <Chip key={m.id} label={m.name} onClick={() => handleTogglePayer(m.id)}
                                        color={formData.payer_id === m.id ? "primary" : "default"} variant={formData.payer_id === m.id ? "filled" : "outlined"}
                                        clickable sx={{ borderRadius: 20 }}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom>対象者</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {members.map(m => {
                                    const isSelected = formData.for_who_ids.includes(m.id);
                                    return (
                                        <Chip key={m.id} label={m.name}
                                            onClick={() => handleToggleTarget(m.id)}
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
        </Box>
    );
};

export default Home;
