'use client';

import React, { useState } from 'react';
import {
    Box, BottomNavigation, BottomNavigationAction,
    Container, Paper, CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeRounded';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import { useRouter } from 'next/navigation';

import Home from './Home';
import AddTransaction from './AddTransaction';
import Settings from './Settings';

const MainView = ({ members, transactions }) => {
    const [value, setValue] = useState(0); // Tab index
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        router.refresh(); // Triggers server-side re-render
        // router.refresh is async but doesn't return a promise we can await easily to know when "done".
        // But usually it's fast. We can fake a loading state or just let it happen.
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleTabChange = (newValue) => {
        setValue(newValue);
    };

    const renderScreen = () => {
        switch (value) {
            case 0:
                return <Home members={members} transactions={transactions} />;
            case 1:
                return (
                    <AddTransaction
                        members={members}
                        onComplete={() => {
                            setValue(0); // Return to Home
                            handleRefresh();
                        }}
                    />
                );
            case 2:
                return <Settings members={members} onUpdate={handleRefresh} />;
            default:
                return <Home members={members} transactions={transactions} />;
        }
    };

    return (
        <Box sx={{ pb: 8, pt: 2, minHeight: '100vh', position: 'relative' }}>
            <Container maxWidth="md" sx={{ mt: 0, mb: 12, px: 2 }}>
                {isRefreshing && (
                    <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
                        <CircularProgress size={20} />
                    </Box>
                )}
                {renderScreen()}
            </Container>

            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    overflow: 'hidden',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
                }}
                elevation={10}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => handleTabChange(newValue)}
                    sx={{
                        height: 80,
                        pb: 2,
                        '& .Mui-selected': {
                            color: 'primary.main',
                            '& .MuiSvgIcon-root': {
                                filter: 'drop-shadow(0 2px 4px rgba(0, 32, 91, 0.3))'
                            }
                        }
                    }}
                >
                    <BottomNavigationAction label="ホーム" icon={<HomeIcon />} />
                    <BottomNavigationAction label="登録" icon={<AddCircleIcon sx={{ fontSize: 36 }} />} />
                    <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default MainView;
