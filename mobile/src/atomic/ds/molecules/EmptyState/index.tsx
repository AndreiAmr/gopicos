import { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { dsStrings } from '../../strings';

type EmptyStateProps = {
  /** `empty` (sem dados) ou `error` (falha; ação padrão "Tentar novamente"). */
  kind?: 'empty' | 'error';
  title?: string;
  description?: string;
  /** Ícone customizado; padrão depende do `kind`. */
  icon?: ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  testID?: string;
};

/**
 * Estado vazio / erro: ícone + texto + ação. Ex.: "Nenhum pico por aqui ainda.
 * Cadastre o primeiro." ou "Algo deu errado" + "Tentar novamente".
 */
export const EmptyState = ({
  kind = 'empty',
  title,
  description,
  icon,
  actionLabel,
  onActionPress,
  testID,
}: EmptyStateProps) => {
  const theme = useTheme();
  const isError = kind === 'error';
  const resolvedTitle =
    title ??
    (isError ? dsStrings.errorDefaultTitle : dsStrings.emptyDefaultTitle);
  const resolvedDescription =
    description ?? (isError ? dsStrings.errorDefaultDescription : undefined);
  const resolvedAction = actionLabel ?? (isError ? dsStrings.retry : undefined);

  return (
    <View
      alignItems="center"
      justifyContent="center"
      gap={space[4]}
      padding={space[6]}
      testID={testID ?? 'ds-empty-state'}
    >
      <View
        width={72}
        height={72}
        borderRadius={radius.full}
        alignItems="center"
        justifyContent="center"
        backgroundColor={isError ? '$sunken' : '$primarySoft'}
      >
        {icon ??
          (isError ? (
            <AlertTriangle size={32} color={theme.error.val} />
          ) : (
            <Inbox size={32} color={theme.primaryText.val} />
          ))}
      </View>
      <View gap={space[1]} alignItems="center">
        <Text
          variant="h3"
          align="center"
          accessibilityRole={isError ? 'alert' : 'header'}
        >
          {resolvedTitle}
        </Text>
        {resolvedDescription ? (
          <Text variant="body" tone="muted" align="center">
            {resolvedDescription}
          </Text>
        ) : null}
      </View>
      {resolvedAction && onActionPress ? (
        <Button
          label={resolvedAction}
          onPress={onActionPress}
          variant={isError ? 'secondary' : 'primary'}
        />
      ) : null}
    </View>
  );
};
