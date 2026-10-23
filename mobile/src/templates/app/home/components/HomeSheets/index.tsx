import { forwardRef, useState } from 'react';
import { Image, ScrollView } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { SharedValue } from 'react-native-reanimated';
import { ImageIcon, LocateOff, X } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  fontFamily,
  radius,
  size,
  space,
  sticker,
  stickerShadow,
} from '../../../../../config/tamagui/tokens';
import { Button } from '../../../../../atomic/ds/atoms/Button';
import { StarRating } from '../../../../../atomic/ds/atoms/StarRating';
import { Text } from '../../../../../atomic/ds/atoms/Text';
import { BottomSheet } from '../../../../../atomic/ds/molecules/BottomSheet';
import { MapSheet } from '../../../../../atomic/ds/molecules/MapSheet';
import { SheetContent } from '../../../../../atomic/ds/molecules/Sheet';
import { ConeIllustration } from '../../../../../atomic/ds/brand';
import {
  SpotSummary,
  cardA11yLabel,
  modalityLabel,
  ratingText,
} from '../../../../../domain/spot/spot';
import { locationStrings } from '../../../../../domain/map/location';
import { homeStrings } from '../../useHome';

const PHOTO = 72;

const Photo = ({ uri }: { uri?: string | null }) => {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  return (
    <View
      width={PHOTO}
      height={PHOTO}
      borderRadius={radius.sm}
      backgroundColor="$sunken"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {uri && !failed ? (
        <Image
          source={{ uri }}
          style={{ width: PHOTO, height: PHOTO }}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <ImageIcon size={24} color={theme.textSubtle.val} />
      )}
    </View>
  );
};

/** Chip de modalidade como sticker (amarelo, borda `ink`, giro -2). */
const ModalitySticker = ({ label }: { label: string }) => {
  const theme = useTheme();
  return (
    <View
      height={26}
      paddingHorizontal={10}
      justifyContent="center"
      borderRadius={4}
      borderWidth={sticker.borderWidth}
      borderColor="$ink"
      backgroundColor="$brandYellow"
      rotate="-2deg"
      boxShadow={stickerShadow(theme.stickerShadow.val, sticker.shadowOffsetSm)}
    >
      <Text fontFamily={fontFamily.semiBold} fontSize={13} lineHeight={16} color="$ink">
        {label}
      </Text>
    </View>
  );
};

type SpotSummarySheetProps = {
  spot: SpotSummary | null;
  distanceLabel?: string;
  onViewDetails: () => void;
  onClose: () => void;
  topInset: number;
  animatedPosition: SharedValue<number>;
  /** Altura do peek medida (para a câmera e a coluna). */
  onPeekHeight?: (height: number) => void;
  peekHeight: number;
};

/**
 * Resumo do pico como sheet em peek (GP-114, spec home.md 6.7): sem véu, o
 * mapa segue usável; arrastar expande até 60% com descrição e fotos.
 */
export const SpotSummarySheet = ({
  spot,
  distanceLabel,
  onViewDetails,
  onClose,
  topInset,
  animatedPosition,
  onPeekHeight,
  peekHeight,
}: SpotSummarySheetProps) => {
  const theme = useTheme();
  // Mantém o último pico enquanto o sheet desce (sem piscar vazio).
  const [last, setLast] = useState<SpotSummary | null>(spot);
  if (spot && spot !== last) setLast(spot);
  const shown = spot ?? last;

  return (
    <MapSheet
      open={Boolean(spot)}
      onClose={onClose}
      snapPoints={[peekHeight, '60%']}
      topInset={topInset}
      animatedPosition={animatedPosition}
      accessibilityLabel={homeStrings.summary}
      testID="spot-summary-sheet"
    >
      {shown ? (
        <View gap={space[4]}>
          <View
            gap={14}
            onLayout={event =>
              // + alça (24) + respiro de cima e de baixo do sheet (8 + 16).
              onPeekHeight?.(Math.ceil(event.nativeEvent.layout.height) + 48)
            }
          >
            <View flexDirection="row" gap={space[3]}>
              <Photo uri={shown.images?.[0]} />
              <View flex={1} minWidth={0} accessible accessibilityLabel={cardA11yLabel(shown)}>
                <Text variant="h3" numberOfLines={1}>
                  {shown.name}
                </Text>
                <View flexDirection="row" alignItems="center" gap={10} marginTop={6} flexWrap="wrap">
                  <ModalitySticker label={modalityLabel(shown.modality)} />
                  {shown.reviewsCount > 0 && shown.ratingAverage != null ? (
                    <StarRating value={shown.ratingAverage} count={shown.reviewsCount} />
                  ) : (
                    <Text variant="caption" tone="muted">
                      {ratingText(shown)}
                    </Text>
                  )}
                </View>
                {distanceLabel ? (
                  <Text variant="caption" tone="muted" marginTop={2}>
                    {distanceLabel}
                  </Text>
                ) : null}
              </View>
              <View
                width={size.touch}
                height={size.touch}
                marginTop={-10}
                marginRight={-12}
                alignItems="center"
                justifyContent="center"
                onPress={onClose}
                accessible
                accessibilityRole="button"
                accessibilityLabel={homeStrings.closeSummary}
                testID="spot-summary-close"
              >
                <X size={20} color={theme.text.val} />
              </View>
            </View>
            <Button
              label={homeStrings.viewDetails}
              variant="secondary"
              onPress={onViewDetails}
              fullWidth
              testID="spot-summary-details"
            />
          </View>

          {shown.description ? (
            <Text variant="body" tone="muted" numberOfLines={4}>
              {shown.description}
            </Text>
          ) : null}
          {(shown.images?.length ?? 0) > 1 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View flexDirection="row" gap={space[2]}>
                {shown.images?.slice(1).map(uri => (
                  <Photo key={uri} uri={uri} />
                ))}
              </View>
            </ScrollView>
          ) : null}
        </View>
      ) : null}
    </MapSheet>
  );
};

type EmptySheetProps = {
  open: boolean;
  kind: 'empty' | 'filtered';
  onAction: () => void;
  onClose: () => void;
  animatedPosition: SharedValue<number>;
};

/** Vazio da área (spec 6.7): título em Permanent Marker, cone e ação. */
export const EmptySheet = ({
  open,
  kind,
  onAction,
  onClose,
  animatedPosition,
}: EmptySheetProps) => {
  const filtered = kind === 'filtered';
  const title = filtered ? homeStrings.filteredEmptyTitle : homeStrings.emptyTitle;
  return (
    <MapSheet
      open={open}
      onClose={onClose}
      animatedPosition={animatedPosition}
      accessibilityLabel={title}
      testID="home-empty-sheet"
    >
      <SheetContent
        brandTitle
        title={title}
        description={
          filtered ? homeStrings.filteredEmptyDescription : homeStrings.emptyDescription
        }
        titleAccessory={<ConeIllustration />}
        primaryLabel={filtered ? homeStrings.filteredEmptyAction : homeStrings.emptyAction}
        onPrimaryPress={onAction}
      />
    </MapSheet>
  );
};

type PermissionSheetProps = {
  bottomInset: number;
  onOpenSettings: () => void;
  onClose?: () => void;
};

/** Permissão negada (spec 6.8, UX-H15): "Abrir ajustes" ou "Agora não". */
export const LocationPermissionSheet = forwardRef<BottomSheetModal, PermissionSheetProps>(
  ({ bottomInset, onOpenSettings, onClose }, ref) => {
    const theme = useTheme();
    const dismiss = () => {
      if (ref && typeof ref !== 'function') ref.current?.dismiss();
    };
    return (
      <BottomSheet
        ref={ref}
        backdrop="dim"
        bottomInset={bottomInset}
        title={locationStrings.permissionTitle}
        testID="location-permission-sheet"
        onClose={onClose}
        description={locationStrings.permissionDescription}
        titleAccessory={
          <View paddingTop={2} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <LocateOff size={24} color={theme.warning.val} />
          </View>
        }
        primaryLabel={locationStrings.openSettings}
        onPrimaryPress={() => {
          dismiss();
          onOpenSettings();
        }}
        secondaryLabel={locationStrings.notNow}
        onSecondaryPress={dismiss}
      />
    );
  },
);

LocationPermissionSheet.displayName = 'LocationPermissionSheet';
