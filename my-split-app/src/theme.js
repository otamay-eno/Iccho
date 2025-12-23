import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#00205B', // ANA Inspiration Blue (Deep)
            light: '#1D4585',
            dark: '#000A33',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00A3E0', // Cyan (Triton Blue approximation / Accent)
            light: '#61D5FF',
            dark: '#0074AE',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F7F9FA', // Very light grey/white
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 700,
            color: '#00205B', // Headings in blue
        },
        h6: {
            fontWeight: 600,
            color: '#00205B',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8, // Sharp but approachable
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #EFF1F5 100%)',
                    minHeight: '100vh',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                    borderRadius: 12,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation10: {
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                }
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 24, // Pill shape
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0, 32, 91, 0.2)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(90deg, #00205B 0%, #1D4585 100%)',
                },
            },
        },
        MuiBottomNavigation: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: '#ffffff',
                    color: '#00205B',
                }
            }
        }
    },
});

export default theme;
