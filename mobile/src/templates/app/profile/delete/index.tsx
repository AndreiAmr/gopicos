import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { ArrowLeft, CheckCircle2, Info } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertBanner, Button, PasswordInput, Text } from '../../../../atomic/ds';
import { size, space } from '../../../../config/tamagui/tokens';
import { profileStrings } from '../logic';
import { deleteStrings } from './logic';
import { useDeleteAccount } from './useDeleteAccount';

export const DeleteAccountTemplate = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const s = useDeleteAccount();

  const items = [
    { key: 'hidden', text: deleteStrings.hiddenProfile, Icon: Info },
    { key: 'keeps', text: s.keepsActivity, Icon: CheckCircle2 },
    { key: 'averages', text: deleteStrings.averages, Icon: CheckCircle2 },
    { key: 'reactivate', text: deleteStrings.reactivate, Icon: CheckCircle2 },
  ].filter(item => item.text);

  return (
    <View flex={1} backgroundColor="$bg">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          flexDirection="row"
          alignItems="center"
          gap={space[2]}
          paddingHorizontal={space[4]}
          paddingTop={insets.top + space[2]}
          paddingBottom={space[2]}
        >
          <Pressable
            onPress={s.goBack}
            disabled={s.loading}
            accessibilityRole="button"
            accessibilityLabel={profileStrings.back}
            hitSlop={8}
            style={{
              width: size.touch,
              height: size.touch,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={24} color={theme.text.val} />
          </Pressable>
          <Text variant="h2" accessibilityRole="header">
            {deleteStrings.title}
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: space[4], gap: space[4] }}
        >
          <Text variant="bodyStrong">{deleteStrings.headline}</Text>

          <View gap={space[3]}>
            {items.map(({ key, text, Icon }) => (
              <View
                key={key}
                flexDirection="row"
                alignItems="flex-start"
                gap={space[3]}
                testID={`delete-item-${key}`}
              >
                <Icon size={20} color={theme.textMuted.val} />
                <Text variant="body" flex={1}>
                  {text}
                </Text>
              </View>
            ))}
          </View>

          <Controller
            control={s.control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                ref={field.ref}
                label={deleteStrings.passwordLabel}
                hint={deleteStrings.passwordHint}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={s.errors.password?.message}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={s.handleDelete}
                disabled={s.loading}
                testID="delete-password"
              />
            )}
          />

          {s.banner ? (
            <AlertBanner
              type="error"
              message={s.banner}
              actionLabel={profileStrings.retry}
              onActionPress={s.handleDelete}
              testID="delete-banner"
            />
          ) : null}
        </ScrollView>

        <View
          paddingHorizontal={space[4]}
          paddingTop={space[3]}
          paddingBottom={insets.bottom + space[3]}
          gap={space[3]}
          backgroundColor="$bg"
          borderTopWidth={1}
          borderTopColor="$divider"
        >
          <Button
            label={deleteStrings.cancel}
            variant="secondary"
            onPress={s.goBack}
            disabled={s.loading}
            fullWidth
            testID="delete-cancel"
          />
          <Button
            label={deleteStrings.submit}
            accessibilityLabel={
              s.loading ? deleteStrings.submitting : deleteStrings.submit
            }
            variant="destructive"
            onPress={s.handleDelete}
            loading={s.loading}
            fullWidth
            testID="delete-submit"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
