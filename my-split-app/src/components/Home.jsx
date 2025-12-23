import React from 'react';
import { Typography, List, ListItem, ListItemText, Grid, Chip, Box, Paper } from '@mui/material';
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
                    borderLeft: isPlus ? '6px solid #00A3E0' : '6px solid #B0B0B0', // Cyan for plus, Grey for minus (ANA style subtle)
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
              <ListItem alignItems="flex-start" sx={{ px: 2, py: 2 }}>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
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
    </Box>
  );
};

export default Home;