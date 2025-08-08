import { createTheme } from '@mui/material/styles';

// 定义财报类网站的专业配色方案
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // 专业蓝色，适合财报数据展示
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f57c00', // 橙色，用于强调和警告
      light: '#ffb74d',
      dark: '#ef6c00',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32', // 绿色，用于上涨数据
      light: '#4caf50',
      dark: '#1b5e20',
    },
    error: {
      main: '#d32f2f', // 红色，用于下跌数据
      light: '#f44336',
      dark: '#c62828',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#e0e0e0',
  },
  
  typography: {
    fontFamily: [
      'var(--font-geist-sans)', // 使用Next.js项目中的Geist字体
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
  },
  
  spacing: 8, // 8px 基础间距单位
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  
  shape: {
    borderRadius: 8, // 圆角半径
  },
  
  components: {
    // Card 组件自定义样式
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    
    // Table 组件自定义样式
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        body: {
          fontSize: '0.875rem',
        },
      },
    },
    
    // Button 组件自定义样式
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 不自动转换为大写
          fontWeight: 500,
        },
      },
    },
    
    // Chip 组件自定义样式
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;