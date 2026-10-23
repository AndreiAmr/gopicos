import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, useTheme } from 'tamagui';
import {
  elevation,
  radius,
  size,
  space,
  zIndex,
} from '../../../../config/tamagui/tokens';
import { Text } from '../../atoms/Text';
import { dsStrings } from '../../strings';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export const TOAST_DURATION = 4000;

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

type ToastProps = {
  type?: ToastType;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
  onDismiss?: () => void;
};

/**
 * Aviso transitório: ícone + texto (nunca só cor), elevação 2, ação opcional e
 * botão de dispensar.
 */
export const Toast = ({
  type = 'info',
  message,
  actionLabel,
  onActionPress,
  onDismiss,
}: ToastProps) => {
  const theme = useTheme();
  const Icon = icons[type];

  return (
    <View
      flexDirection="row"
      alignItems="center"
      gap={space[3]}
      paddingLeft={space[4]}
      paddingVertical={space[2]}
      minHeight={size.touch}
      backgroundColor="$surface"
      borderRadius={radius.md}
      borderWidth={1}
      borderColor="$divider"
      accessibilityRole={type === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
      testID={`ds-toast-${type}`}
      {...elevation[2]}
    >
      <Icon size={20} color={theme[type].val} />
      <Text variant="bodySm" flex={1}>
        {message}
      </Text>
      {actionLabel ? (
        <View
          minHeight={size.touch}
          justifyContent="center"
          onPress={onActionPress}
          accessible
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text variant="label" tone="primary">
            {actionLabel}
          </Text>
        </View>
      ) : null}
      {onDismiss ? (
        <View
          width={size.touch}
          height={size.touch}
          alignItems="center"
          justifyContent="center"
          onPress={onDismiss}
          accessible
          accessibilityRole="button"
          accessibilityLabel={dsStrings.dismissToast}
          testID="ds-toast-dismiss"
        >
          <X size={18} color={theme.textMuted.val} />
        </View>
      ) : null}
    </View>
  );
};

export type ToastOptions = {
  type?: ToastType;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
  /** Erros com ação nunca somem sozinhos; use `duration: 0` para fixar. */
  duration?: number;
};

type ToastContextValue = {
  show: (options: ToastOptions) => void;
  hide: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/** Duração efetiva: erro com ação fica até o usuário agir. */
export const resolveToastDuration = (options: ToastOptions): number => {
  if (options.duration !== undefined) {
    return options.duration;
  }
  if (options.type === 'error' && options.actionLabel) {
    return 0;
  }
  return TOAST_DURATION;
};

/** Provider único na raiz; exibe um toast por vez (o mais recente substitui). */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState<ToastOptions | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const hide = useCallback(() => {
    clearTimer();
    setCurrent(null);
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      clearTimer();
      setCurrent(options);
      AccessibilityInfo.announceForAccessibility(options.message);

      const duration = resolveToastDuration(options);
      if (duration > 0) {
        timer.current = setTimeout(hide, duration);
      }
    },
    [hide],
  );

  useEffect(() => clearTimer, []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {current ? (
        <View
          position="absolute"
          top={insets.top + space[2]}
          left={space[4]}
          right={space[4]}
          zIndex={zIndex.toast}
          pointerEvents="box-none"
        >
          <Toast
            type={current.type}
            message={current.message}
            actionLabel={current.actionLabel}
            onActionPress={() => {
              current.onActionPress?.();
              hide();
            }}
            onDismiss={hide}
          />
        </View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  }
  return context;
};
