import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Grid, Chip, Box, Paper, Avatar } from '@mui/material';
import PaidIcon from '@mui/icons-material/PaidRounded';
import ReceiptIcon from '@mui/icons-material/ReceiptLongRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';

const Home = ({ members, transactions }) => {
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

  return (
    <Box sx={{ width: '100%' }}>
      {/* 収支サマリー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaidIcon color="primary" /> 収支状況
        </Typography>
        <Grid container spacing={2}>
          {members.map((member) => {
            const bal = balances[member.name] || 0;
            const isPlus = bal >= 0;
            return (
              <Grid item xs={6} key={member.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: isPlus
                      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
                    border: `1px solid ${isPlus ? 'rgba(33, 150, 243, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                    '&:active': { transform: 'scale(0.98)' }
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: isPlus ? '#4dabf5' : '#f44336',
                      fontWeight: 800,
                      my: 0.5
                    }}
                  >
                    {isPlus ? '+' : ''}{Math.round(bal).toLocaleString()}
                  </Typography>
                  <Chip
                    label={isPlus ? '受取' : '支払'}
                    size="small"
                    color={isPlus ? 'primary' : 'error'}
                    variant="soft" // Note: variant="soft" might need custom theme support or fallback to filled
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      opacity: 0.9,
                      fontWeight: 'bold',
                      backgroundColor: isPlus ? 'rgba(33, 150, 243, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                      color: isPlus ? '#90caf9' : '#ef5350'
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
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="secondary" /> 最近の履歴
        </Typography>
        <List sx={{ width: '100%', p: 0 }}>
          {transactions.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <Typography color="text.secondary">履歴がありません</Typography>
            </Paper>
          )}
          {transactions.map((t, index) => (
            <Paper
              key={t.id}
              sx={{
                mb: 1.5,
                overflow: 'hidden',
                backgroundColor: 'rgba(30, 30, 30, 0.6)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5 }}>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="subtitle1" fontWeight="600">{t.title}</Typography>
                      <Typography variant="h6" fontWeight="700" color="primary.light">
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
                          sx={{ borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }}
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
    </Box>
  );
};

export default Home;