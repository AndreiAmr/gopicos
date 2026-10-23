import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { space } from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { AlertBanner } from '../../../../atomic/ds/auth/AlertBanner';
import { SpotFormFields } from './SpotFormFields';
import {
  newSpotDetailsStrings as strings,
  useNewSpotDetails,
} from './useNewSpotDetails';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: space[4], gap: space[5], paddingBottom: space[12] },
});

export const NewSpotDetailsTemplate = () => {
  const theme = useTheme();
  const screen = useNewSpotDetails();

  return (
    <SafeAreaView edges={['top']} style={styles.flex}>
      <View flex={1} backgroundColor="$bg">
        <View
          flexDirection="row"
          alignItems="center"
          gap={space[2]}
          padding={space[2]}
        >
          <View
            width={44}
            height={44}
            alignItems="center"
            justifyContent="center"
            onPress={screen.changeLocation}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={22} color={theme.text.val} />
          </View>
          <View>
            <Text variant="caption" tone="muted">
              {strings.step}
            </Text>
            <Text variant="h2" accessibilityRole="header">
              {strings.title}
            </Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <SpotFormFields screen={screen} />

            {screen.banner ? (
              <AlertBanner
                type="error"
                message={screen.banner}
                actionLabel={strings.retry}
                onActionPress={screen.submit}
                testID="new-spot-error"
              />
            ) : null}

            <Button
              label={strings.submit}
              onPress={screen.submit}
              loading={screen.submitting}
              fullWidth
              testID="new-spot-submit"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
