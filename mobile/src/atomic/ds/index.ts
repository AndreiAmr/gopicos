/**
 * Biblioteca de componentes do GoPicos Design System (mobile, GP-003).
 * Fica em `atomic/ds` para conviver com os atoms antigos (`atomic/atoms`) até
 * as telas migrarem (GP-005); depois a pasta pode ser achatada.
 */
export { Text } from './atoms/Text';
export { Button } from './atoms/Button';
export { Input } from './atoms/Input';
export { Card } from './atoms/Card';
export { Skeleton } from './atoms/Skeleton';
export { Loader } from './atoms/Loader';
export { StarRating } from './atoms/StarRating';
export { EmptyState } from './molecules/EmptyState';
export {
  Sheet,
  SheetContent,
  SheetFrame,
  SheetHandle,
} from './molecules/Sheet';
export { BottomSheet } from './molecules/BottomSheet';
export type { SheetBackdrop } from './molecules/BottomSheet';
export { MapSheet } from './molecules/MapSheet';
export { SpotCard, SpotCardSkeleton } from './molecules/SpotCard';
export { SpotPin } from './molecules/SpotPin';
export { SpotPreview } from './molecules/SpotPreview';
export {
  CheckboxRow,
  ChoiceChips,
  Segmented,
  SwitchRow,
} from './molecules/FormControls';
export { PhotoPicker } from './molecules/PhotoPicker';
export { InfoRow } from './molecules/InfoRow';
export { Toast, ToastProvider, useToast } from './molecules/Toast';
export type { ToastPlacement } from './molecules/Toast';
export {
  BrandTitle,
  ConeIllustration,
  ControlBadge,
  CornerHalftone,
  MapControlButton,
  ScoreTape,
  SprayStroke,
  SpinningWheel,
  StickerChip,
  StickerSegmented,
  TapeLabel,
  useReduceMotion,
} from './brand';
export { AlertBanner } from './auth/AlertBanner';
export { TextLink } from './auth/TextLink';
export { PasswordInput } from './auth/PasswordInput';
export { Tape, Halftone, Wordmark } from './auth/BrandDecor';
export { Avatar, initialsOf } from './atoms/Avatar';
export { SettingsRow, SettingsGroup } from './molecules/SettingsRow';
