import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPinOff } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { space } from '../../../config/tamagui/tokens';
import {
  AlertBanner,
  Button,
  EmptyState,
  Skeleton,
  Text,
} from '../../../atomic/ds';
import { TextLink } from '../../../atomic/ds/auth/TextLink';
import { SpotFormFields } from '../newSpot/details/SpotFormFields';
import { editSpotStrings as strings, useEditSpot } from './useEditSpot';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: space[4], gap: space[5], paddingBottom: space[8] },
});

const Header = ({ onCancel }: { onCancel: () => void }) => (
  <View
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    paddingHorizontal={space[4]}
    paddingVertical={space[2]}
  >
    <Text variant="h2" accessibilityRole="header">
      {strings.title}
    </Text>
    <TextLink label={strings.cancel} onPress={onCancel} />
  </View>
);

export const EditSpotTemplate = () => {
  const theme = useTheme();
  const screen = useEditSpot();

  if (!screen.ready) {
    return (
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View flex={1} backgroundColor="$bg">
          <Header onCancel={screen.cancel} />
          {screen.status === 'notFound' ? (
            <View flex={1} justifyContent="center" testID="edit-spot-not-found">
              <EmptyState
                title={strings.notFoundTitle}
                description={strings.notFoundDescription}
                icon={<MapPinOff size={32} color={theme.primaryText.val} />}
                actionLabel={strings.backToMap}
                onActionPress={screen.goHome}
              />
            </View>
          ) : screen.status === 'error' ? (
            <View padding={space[4]} testID="edit-spot-load-error">
              <AlertBanner
                type="error"
                message={strings.loadError}
                actionLabel={strings.retry}
                onActionPress={screen.retry}
              />
            </View>
          ) : (
            <View padding={space[4]} gap={space[4]} testID="edit-spot-loading">
              <Skeleton width="100%" height={100} shape="block" />
              <Skeleton width="100%" height={56} shape="block" />
              <Skeleton width="100%" height={120} shape="block" />
              <Skeleton width="100%" height={56} shape="block" />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.flex}>
      <View flex={1} backgroundColor="$bg">
        <Header onCancel={screen.cancel} />

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
                testID="edit-spot-error"
              />
            ) : null}
          </ScrollView>

          <View
            padding={space[4]}
            backgroundColor="$surface"
            borderTopWidth={1}
            borderTopColor="$divider"
          >
            <Button
              label={strings.submit}
              onPress={screen.submit}
              loading={screen.submitting}
              fullWidth
              testID="edit-spot-submit"
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
