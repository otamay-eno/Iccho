import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Box, BottomNavigation, BottomNavigationAction, 
  Container, CircularProgress, CssBaseline, createTheme, ThemeProvider 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';

import Home from './components/Home';
import AddTransaction from './components/AddTransaction';
import Settings from './components/Settings';
import { fetchAllData } from './api/gasClient';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' }
  },
});

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
      alert("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const renderScreen = () => {
    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

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
      <Box sx={{ pb: 7, minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              割り勘アプリ
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ mt: 2, mb: 2 }}>
          {renderScreen()}
        </Container>

        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
          >
            <BottomNavigationAction label="ホーム" icon={<HomeIcon />} />
            <BottomNavigationAction label="登録" icon={<AddCircleIcon />} />
            <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
          </BottomNavigation>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;