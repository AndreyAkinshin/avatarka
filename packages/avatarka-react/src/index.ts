export { Avatar, type AvatarProps } from './Avatar';
export { AvatarEditor, type AvatarEditorProps } from './AvatarEditor';
export { AvatarPicker, type AvatarPickerProps } from './AvatarPicker';

// Re-export useful types and functions from core
export {
  themes,
  generateAvatar,
  generateParams,
  getDefaultParams,
  randomAvatar,
  getThemeNames,
  getTheme,
  svgToPng,
  svgToPngDataUrl,
  type ThemeName,
  type ThemeParams,
  type ThemeParamsMap,
  type AvatarParams,
  type ParamSchema,
  type ParamDefinition,
  type PngOptions,
  type PeopleParams,
  type AnimalParams,
  type MonsterParams,
  type RobotParams,
  type AliensParams,
  type GeometricParams,
} from 'avatarka';
