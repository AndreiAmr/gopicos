import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { Input } from '../../../../atomic/ds/atoms/Input';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { AlertBanner } from '../../../../atomic/ds/auth/AlertBanner';
import { TextLink } from '../../../../atomic/ds/auth/TextLink';
import {
  CheckboxRow,
  ChoiceChips,
  Segmented,
  SwitchRow,
} from '../../../../atomic/ds/molecules/FormControls';
import { PhotoPicker } from '../../../../atomic/ds/molecules/PhotoPicker';
import {
  MODALITY_OPTIONS,
  PHOTO_LIMITS,
} from '../../../../domain/spot/newSpotForm';
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
  const { control, watch } = screen.form;
  const isPaid = watch('isPaid');
  const alwaysOpen = watch('alwaysOpen');
  const descriptionRef = useRef<TextInput>(null);
  const readOnly = screen.submitting;

  return (
    <SafeAreaView edges={['top']} style={styles.flex}>
      <View flex={1} backgroundColor="$bg">
        <View flexDirection="row" alignItems="center" gap={space[2]} padding={space[2]}>
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
            <View
              flexDirection="row"
              alignItems="center"
              gap={space[3]}
              padding={space[3]}
              borderRadius={radius.lg}
              borderWidth={1}
              borderColor="$divider"
              backgroundColor="$surface"
            >
              <MapPin size={20} color={theme.primaryText.val} />
              <Text variant="body" flex={1}>
                {strings.location(screen.pointsCount)}
              </Text>
              <TextLink label={strings.changeLocation} onPress={screen.changeLocation} />
            </View>

            <PhotoPicker
              label={strings.photos}
              photos={screen.photos}
              max={PHOTO_LIMITS.max}
              counter={screen.photoCounter}
              onAdd={screen.addPhoto}
              onRemove={screen.removePhoto}
              error={screen.photoError}
              disabled={readOnly}
            />

            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={strings.name}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  maxLength={80}
                  returnKeyType="next"
                  onSubmitEditing={() => descriptionRef.current?.focus()}
                  disabled={readOnly}
                  testID="new-spot-name"
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Input
                  ref={instance => {
                    field.ref(instance);
                    descriptionRef.current = instance;
                  }}
                  label={strings.description}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  multiline
                  maxLength={1000}
                  disabled={readOnly}
                  testID="new-spot-description"
                />
              )}
            />

            <Controller
              control={control}
              name="modality"
              render={({ field, fieldState }) => (
                <ChoiceChips
                  label={strings.modality}
                  options={MODALITY_OPTIONS}
                  value={field.value}
                  onChange={value => field.onChange(value)}
                  error={fieldState.error?.message}
                  disabled={readOnly}
                  testID="new-spot-modality"
                />
              )}
            />

            <Controller
              control={control}
              name="isPaid"
              render={({ field }) => (
                <Segmented
                  label={strings.entry}
                  options={[
                    { value: 'free', label: strings.free },
                    { value: 'paid', label: strings.paid },
                  ]}
                  value={field.value ? 'paid' : 'free'}
                  onChange={value => field.onChange(value === 'paid')}
                  disabled={readOnly}
                  testID="new-spot-entry"
                />
              )}
            />
            {isPaid ? (
              <Controller
                control={control}
                name="entryAmount"
                render={({ field, fieldState }) => (
                  <Input
                    ref={field.ref}
                    label={strings.entryAmount}
                    placeholder={strings.entryAmountPlaceholder}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    disabled={readOnly}
                    testID="new-spot-entry-amount"
                  />
                )}
              />
            ) : null}

            <Controller
              control={control}
              name="alwaysOpen"
              render={({ field }) => (
                <SwitchRow
                  label={strings.alwaysOpen}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={readOnly}
                  testID="new-spot-always-open"
                />
              )}
            />
            {!alwaysOpen ? (
              <Controller
                control={control}
                name="openingHours"
                render={({ field, fieldState }) => (
                  <Input
                    ref={field.ref}
                    label={strings.openingHours}
                    placeholder={strings.openingHoursPlaceholder}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    returnKeyType="done"
                    disabled={readOnly}
                    testID="new-spot-opening-hours"
                  />
                )}
              />
            ) : null}

            <View>
              <Controller
                control={control}
                name="hasCoverage"
                render={({ field }) => (
                  <CheckboxRow
                    label={strings.hasCoverage}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={readOnly}
                    testID="new-spot-coverage"
                  />
                )}
              />
              <Controller
                control={control}
                name="equipmentRequired"
                render={({ field }) => (
                  <CheckboxRow
                    label={strings.equipmentRequired}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={readOnly}
                    testID="new-spot-equipment"
                  />
                )}
              />
            </View>

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
