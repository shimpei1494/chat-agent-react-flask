import { createTheme } from '@mantine/core';

export const theme = createTheme({
  // プライマリカラーパレット（10色）
  colors: {
    primary: [
      '#f0f4ff',
      '#e0e7ff',
      '#c7d2fe',
      '#a5b4fc',
      '#818cf8',
      '#667eea', // メインカラー
      '#5b73e8',
      '#4c63d2',
      '#3b52b8',
      '#2d3e8f',
    ],
    accent: [
      '#f0fdfc',
      '#ccfbf1',
      '#99f6e4',
      '#5eead4',
      '#2dd4bf',
      '#14b8a6', // メインアクセントカラー
      '#0d9488',
      '#0f766e',
      '#115e59',
      '#134e4a',
    ],
  },

  // プライマリカラーを設定
  primaryColor: 'primary',

  // デフォルトの半径を設定
  defaultRadius: 'md',

  // 共通コンポーネントのスタイル設定
  components: {
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'xl',
      },
    },
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Avatar: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          color: 'var(--mantine-color-dark-9)',
        },
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          color: 'var(--mantine-color-dark-9)',
        },
      },
    },
    Text: {
      styles: {
        root: {
          color: 'var(--mantine-color-dark-8)',
        },
      },
    },
  },

  // カスタムプロパティ
  other: {
    // グラデーション
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundPattern: `
				radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
				radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
				radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
			`,
    },

    // ガラスモーフィズム効果
    glass: {
      white:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 255, 0.9) 100%)',
      light:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(248, 250, 255, 0.8) 100%)',
      subtle: 'rgba(255, 255, 255, 0.7)',
    },

    // エフェクト
    effects: {
      blur: 'blur(20px)',
    },

    // カスタムシャドウ
    shadows: {
      card: '0 4px 20px rgba(102, 126, 234, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
      cardLight:
        '0 4px 20px rgba(102, 126, 234, 0.06), 0 1px 3px rgba(0, 0, 0, 0.05)',
      avatar: '0 3px 12px rgba(0, 0, 0, 0.08)',
      button: '0 3px 12px rgba(102, 126, 234, 0.3)',
      userMessage:
        '0 4px 20px rgba(102, 126, 234, 0.25), 0 2px 8px rgba(0, 0, 0, 0.05)',
      aiMessage:
        '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.05)',
      icon: '0 20px 40px rgba(102, 126, 234, 0.3)',
    },

    // カスタムスペーシング
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },

    // カスタムボーダー半径
    borderRadius: {
      sm: '8px',
      md: '16px',
      lg: '20px',
      xl: '24px',
      round: '50%',
    },

    // アニメーション
    animation: {
      fadeIn: 'fadeIn 0.3s ease-in-out',
      typingDot: 'typingDotPulse 1.5s infinite ease-in-out',
    },

    // タイポグラフィ
    typography: {
      gradient: {
        background: 'linear-gradient(45deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 800,
        letterSpacing: '-0.5px',
      },
    },
  },
});
