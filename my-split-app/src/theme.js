import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7c4dff', // Vivid Purple
            light: '#b47cff',
            dark: '#3f1dcb',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00e5ff', // Cyan Accent
            light: '#6effff',
            dark: '#00b2cc',
            contrastText: '#000000',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e', // Slightly lighter for cards
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none', // Modern feel
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 16, // More rounded corners for modern mobile feel
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', // Deep modern gradient
                    minHeight: '100vh',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(30, 30, 30, 0.8)', // Glassmorphism
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiBottomNavigation: {
            styleOverrides: {
                root: {
                    background: 'rgba(30, 30, 30, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Reset default gradient
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle transparency
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 25, // Pill shape
                    padding: '10px 24px',
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #7c4dff 30%, #00e5ff 90%)',
                    boxShadow: '0 3px 5px 2px rgba(124, 77, 255, .3)',
                },
            },
        },
    },
});

export default theme;
