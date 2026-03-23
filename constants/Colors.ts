// BrandScope Design System Colors
// Derived from design_brandscore.html Material Design token palette

export const DS = {
  // Core brand
  primary: '#3525CD',
  primaryContainer: '#4F46E5',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#DAD7FF',
  primaryFixed: '#E2DFFF',
  primaryFixedDim: '#C3C0FF',
  inversePrimary: '#C3C0FF',
  surfaceTint: '#4D44E3',

  // Secondary (green)
  secondary: '#006C49',
  secondaryContainer: '#6CF8BB',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#00714D',
  secondaryFixed: '#6FFBBE',
  secondaryFixedDim: '#4EDEA3',

  // Tertiary (red/error-like)
  tertiary: '#960014',
  tertiaryContainer: '#BC1D25',
  onTertiary: '#FFFFFF',
  tertiaryFixed: '#FFDAD7',
  tertiaryFixedDim: '#FFB3AD',
  onTertiaryContainer: '#FFD0CC',

  // Surface scale
  background: '#F7F9FB',
  surface: '#F7F9FB',
  surfaceBright: '#F7F9FB',
  surfaceDim: '#D8DADC',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F2F4F6',
  surfaceContainer: '#ECEEF0',
  surfaceContainerHigh: '#E6E8EA',
  surfaceContainerHighest: '#E0E3E5',
  surfaceVariant: '#E0E3E5',
  inverseOnSurface: '#EFF1F3',
  inverseSurface: '#2D3133',

  // On-surface
  onBackground: '#191C1E',
  onSurface: '#191C1E',
  onSurfaceVariant: '#464555',

  // Outline
  outline: '#777587',
  outlineVariant: '#C7C4D8',

  // Error
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onError: '#FFFFFF',
  onErrorContainer: '#93000A',

  // Semantic aliases used in screens
  scoreGreen: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',

  // Gradient
  gradientStart: '#3525CD',
  gradientEnd: '#4F46E5',
};

// Legacy Colors export kept for compatibility
const tintColorLight = DS.primary;
const tintColorDark = '#C3C0FF';

export const Colors = {
  light: {
    text: DS.onSurface,
    background: DS.background,
    tint: tintColorLight,
    icon: DS.onSurfaceVariant,
    tabIconDefault: DS.outline,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: DS.inverseOnSurface,
    background: DS.inverseSurface,
    tint: tintColorDark,
    icon: DS.outlineVariant,
    tabIconDefault: DS.outlineVariant,
    tabIconSelected: tintColorDark,
  },
};

export const zincColors = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
};

export const appleBlue = '#007AFF';
export const appleRed = '#FF3B30';
export const borderColor = '#C7C4D880';
export const appleGreen = '#34C759';

export const backgroundColors = [
  '#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171',
  '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c',
  '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
  '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24',
  '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f',
  '#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635',
  '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314',
  '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80',
  '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
  '#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399',
  '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
  '#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8',
  '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81',
];

export const emojies = [
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
  '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
  '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🥔', '🧄', '🧅',
  '🍄', '🍞', '🥖', '🥨', '🥐', '🥯', '🧀', '🥚', '🍳', '🥞',
  '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪',
  '🌮', '🌯', '🫔', '🥙', '🧆', '🍜', '🍝', '🍣', '🍤', '🍙',
  '🍚', '🍛', '🍲', '🥘', '🥗', '🍿', '🧈', '🥫', '🍱', '🥮',
  '🍠', '🍥', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪',
  '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍯', '🥜', '🌰',
  '🥛', '🧃', '🧉', '🥤', '🍶', '🍵', '🍺', '🍻', '🥂', '🍷',
  '🍸', '🍹', '🥃', '🍾', '☕️', '🫖', '🥄', '🍴', '🍽', '🥢',
  '🧂', '🛒', '🛍️', '🧺', '💳', '💸', '💵', '💰', '💲', '🧾',
  '🔖', '🏪', '🏬', '🏦', '🏧', '📦', '📮', '🏷️', '✅', '📋',
  '📜', '✏️', '📝', '🔍', '📆', '⏰', '📱', '💻', '🌐', '🔗',
  '🔒', '🔑', '🗃️', '🗂️', '🔄', '💡', '⭐️', '📌', '📍', '📊',
  '💯', '🎉', '🎊', '🎁', '🏆', '⚖️', '🏠', '🚗', '🏃‍♂️', '🏃‍♀️',
  '🚶‍♂️', '🚶‍♀️', '👕', '👖', '👗', '👔', '🩳', '👠', '👟', '🧥',
  '🧤', '🧣', '🧦', '🎒', '👜', '👛', '👓', '🕶️', '👒', '🪣',
  '🪑', '🛋️', '🚪', '🪟', '🏺', '🖼️', '📺', '📻', '🔌', '🧴',
  '🪥', '🧹', '🧽', '🗑️', '🪒', '💊', '💉', '🩹', '❤️', '💔',
  '💘', '💙', '💚', '💛', '💜',
];
