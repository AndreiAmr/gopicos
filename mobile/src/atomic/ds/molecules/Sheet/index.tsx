import { ReactNode } from 'react';
import { X } from 'lucide-react-native';
import { View, styled, useTheme } from 'tamagui';
import {
  elevation,
  radius,
  size,
  space,
} from '../../../../config/tamagui/tokens';
import { dsStrings } from '../../strings';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { BrandTitle } from '../../brand';

/** Superfície do sheet: `surface`, raio `xl` no topo e elevação 3. */
export const SheetFrame = styled(View, {
  name: 'GPSheetFrame',
  backgroundColor: '$surface',
  borderTopLeftRadius: radius.xl,
  borderTopRightRadius: radius.xl,
  paddingHorizontal: space[4],
  paddingBottom: space[6],
  ...elevation[3],
});

/** Alça de arraste exibida no topo do sheet. */
export const SheetHandle = () => (
  <View alignItems="center" paddingVertical={space[3]}>
    <View
      width={40}
      height={4}
      borderRadius={radius.full}
      backgroundColor="$border"
    />
  </View>
);

type SheetContentProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  /** Mostra o botão "X" de fechar no cabeçalho. */
  onClose?: () => void;
  /** Rótulo do "X" (padrão "Fechar"). */
  closeLabel?: string;
  /** Título fixo em Permanent Marker com spray (D43). */
  brandTitle?: boolean;
  /** Elemento à direita do título (ex.: ilustração do vazio). */
  titleAccessory?: ReactNode;
};

/** Conteúdo padrão de um sheet: título, descrição, corpo e ações. */
export const SheetContent = ({
  title,
  description,
  children,
  primaryLabel,
  onPrimaryPress,
  primaryLoading,
  secondaryLabel,
  onSecondaryPress,
  onClose,
  closeLabel,
  brandTitle = false,
  titleAccessory,
}: SheetContentProps) => {
  const theme = useTheme();

  return (
    <View gap={space[4]}>
      <View flexDirection="row" alignItems="flex-start" gap={space[2]}>
        <View flex={1} gap={space[1]}>
          {brandTitle ? (
            <BrandTitle fontSize={24} sprayWidth={80}>
              {title}
            </BrandTitle>
          ) : (
            <Text variant="h2" accessibilityRole="header">
              {title}
            </Text>
          )}
          {description ? (
            <Text variant="body" tone="muted">
              {description}
            </Text>
          ) : null}
        </View>
        {titleAccessory}
        {onClose ? (
          <View
            width={size.touch}
            height={size.touch}
            marginTop={-space[2]}
            marginRight={-space[3]}
            alignItems="center"
            justifyContent="center"
            onPress={onClose}
            accessible
            accessibilityRole="button"
            accessibilityLabel={closeLabel ?? dsStrings.close}
            testID="ds-sheet-close"
          >
            <X size={24} color={theme.text.val} />
          </View>
        ) : null}
      </View>
      {children}
      {primaryLabel || secondaryLabel ? (
        <View gap={space[2]}>
          {primaryLabel ? (
            <Button
              label={primaryLabel}
              onPress={onPrimaryPress}
              loading={primaryLoading}
              fullWidth
            />
          ) : null}
          {secondaryLabel ? (
            <Button
              label={secondaryLabel}
              variant="ghost"
              onPress={onSecondaryPress}
              fullWidth
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

type SheetProps = SheetContentProps & {
  /** Oculta a alça (ex.: quando o sheet não é arrastável). */
  hideHandle?: boolean;
};

/**
 * Sheet estático (sem gesto): alça + conteúdo. Para o modal arrastável use
 * `BottomSheet`.
 */
export const Sheet = ({ hideHandle, ...content }: SheetProps) => (
  <SheetFrame accessibilityViewIsModal testID="ds-sheet">
    {hideHandle ? <View height={space[4]} /> : <SheetHandle />}
    <SheetContent {...content} />
  </SheetFrame>
);
