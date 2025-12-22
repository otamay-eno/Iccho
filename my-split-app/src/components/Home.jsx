import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Grid, Chip, Box } from '@mui/material';

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
    <Box>
      {/* 収支サマリー */}
      <Typography variant="h6" gutterBottom>現在の収支状況</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {members.map((member) => {
          const bal = balances[member.name] || 0;
          const isPlus = bal >= 0;
          return (
            <Grid item xs={6} key={member.id}>
              <Card sx={{ borderLeft: `5px solid ${isPlus ? '#2196f3' : '#f44336'}` }}>
                <CardContent>
                  <Typography variant="subtitle1">{member.name}</Typography>
                  <Typography 
                    variant="h5" 
                    color={isPlus ? 'primary' : 'error'}
                    fontWeight="bold"
                  >
                    {isPlus ? '+' : ''}{Math.round(bal).toLocaleString()}円
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isPlus ? '受取予定' : '支払予定'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 取引履歴 */}
      <Typography variant="h6" gutterBottom>最近の履歴</Typography>
      <Card>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {transactions.length === 0 && (
            <ListItem><ListItemText primary="履歴がありません" /></ListItem>
          )}
          {transactions.map((t, index) => (
            <React.Fragment key={t.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle1" fontWeight="bold">{t.title}</Typography>
                      <Typography variant="subtitle1">{t.amount.toLocaleString()}円</Typography>
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        {t.payer} が支払い
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption">
                        {t.date} | 対象: {t.for_whom.join(', ')}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < transactions.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default Home;