import { useRef } from 'react';
import { TextInput } from 'react-native';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MapPin } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { Input } from '../../../../atomic/ds/atoms/Input';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { TextLink } from '../../../../atomic/ds/auth/TextLink';
import {
  CheckboxRow,
  ChoiceChips,
  Segmented,
  SwitchRow,
} from '../../../../atomic/ds/molecules/FormControls';
import { PhotoPicker } from '../../../../atomic/ds/molecules/PhotoPicker';
import type { PhotoItem } from '../../../../atomic/ds/molecules/PhotoPicker';
import {
  MODALITY_OPTIONS,
  NewSpotFormData,
  PHOTO_LIMITS,
} from '../../../../domain/spot/newSpotForm';
import { newSpotDetailsStrings as strings } from './useNewSpotDetails';

export type SpotFormScreen = {
  form: {
    control: Control<NewSpotFormData>;
    watch: UseFormWatch<NewSpotFormData>;
  };
  pointsCount: number;
  photos: PhotoItem[];
  photoCounter: string;
  photoError?: string;
  addPhoto: () => void;
  removePhoto: (index: number) => void;
  submitting: boolean;
  changeLocation: () => void;
};

/** Campos compartilhados entre criar (passo 2) e editar pico. */
export const SpotFormFields = ({ screen }: { screen: SpotFormScreen }) => {
  const theme = useTheme();
  const { control, watch } = screen.form;
  const isPaid = watch('isPaid');
  const alwaysOpen = watch('alwaysOpen');
  const descriptionRef = useRef<TextInput>(null);
  const readOnly = screen.submitting;

  return (
    <>
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
        <TextLink
          label={strings.changeLocation}
          onPress={screen.changeLocation}
        />
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
    </>
  );
};
