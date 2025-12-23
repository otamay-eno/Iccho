import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Box, BottomNavigation, BottomNavigationAction,
  Container, CircularProgress, CssBaseline, ThemeProvider, Paper, GlobalStyles
} from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeRounded';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';

import Home from './components/Home';
import AddTransaction from './components/AddTransaction';
import Settings from './components/Settings';
import theme from './theme';
import { fetchAllData } from './api/gasClient';

function App() {
  const [value, setValue] = useState(0); // Tab index
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllData();
      setMembers(data.members || []);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
      // In a real app we might show a snackbar here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const renderScreen = () => {
    if (loading) return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="secondary" />
      </Box>
    );

    switch (value) {
      case 0:
        return <Home members={members} transactions={transactions} />;
      case 1:
        return (
          <AddTransaction
            members={members}
            onComplete={() => {
              setValue(0); // ホームに戻る
              refreshData(); // データ更新
            }}
          />
        );
      case 2:
        return <Settings members={members} onUpdate={refreshData} />;
      default:
        return <Home members={members} transactions={transactions} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: { overflowX: 'hidden' }
      }} />
      <Box sx={{ pb: 8, minHeight: '100vh', position: 'relative' }}>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ top: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Iccho 割り勘
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 2, mb: 4, px: 2 }}>
          {renderScreen()}
        </Container>

        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, borderRadius: 0 }}
          elevation={10}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            sx={{
              height: 70,
              pb: 1, // Add some padding for safe area logic roughly
              '& .Mui-selected': { color: 'secondary.main' }
            }}
          >
            <BottomNavigationAction label="ホーム" icon={<HomeIcon />} />
            <BottomNavigationAction label="登録" icon={<AddCircleIcon sx={{ fontSize: 32 }} />} />
            <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;