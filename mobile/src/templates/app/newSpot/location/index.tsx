import Mapbox, {
  Camera,
  FillLayer,
  LineLayer,
  LocationPuck,
  PointAnnotation,
  ShapeSource,
  UserLocation,
} from '@rnmapbox/maps';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  elevation,
  mapColors,
  radius,
  space,
  zIndex,
} from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { LngLat, draftShape } from '../../../../domain/spot/polygonDraft';
import {
  newSpotLocationStrings as strings,
  useNewSpotLocation,
} from './useNewSpotLocation';

const VERTEX = 18;

const styles = StyleSheet.create({
  map: StyleSheet.absoluteFill,
});

export const NewSpotLocationTemplate = () => {
  const theme = useTheme();
  const draft = useNewSpotLocation();
  const shape = draftShape(draft.points);

  return (
    <View flex={1} backgroundColor="$bg">
      <Mapbox.MapView
        style={styles.map}
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        onPress={feature => {
          const geometry = feature.geometry as { coordinates: number[] };
          draft.add([geometry.coordinates[0], geometry.coordinates[1]]);
        }}
        onCameraChanged={state =>
          draft.setCenter(state.properties.center as LngLat)
        }
      >
        {draft.focus ? (
          <Camera centerCoordinate={draft.focus} zoomLevel={17} animationDuration={0} />
        ) : (
          <Camera followUserLocation followZoomLevel={17} />
        )}
        <LocationPuck />
        <UserLocation
          visible={false}
          onUpdate={location =>
            draft.setUserPosition([
              location.coords.longitude,
              location.coords.latitude,
            ])
          }
        />

        {shape ? (
          <ShapeSource id="new-spot-draft" shape={shape}>
            <FillLayer
              id="new-spot-draft-fill"
              filter={['==', ['geometry-type'], 'Polygon']}
              style={{ fillColor: mapColors.spotFill }}
            />
            <LineLayer
              id="new-spot-draft-line"
              style={{ lineColor: mapColors.spotStroke, lineWidth: 2 }}
            />
          </ShapeSource>
        ) : null}

        {draft.points.map((point, index) => (
          <PointAnnotation
            key={`vertex-${index}`}
            id={`vertex-${index}`}
            coordinate={point}
            draggable
            onDragEnd={event => {
              const coords = event.geometry.coordinates;
              draft.move(index, [coords[0], coords[1]]);
            }}
          >
            <View
              width={VERTEX}
              height={VERTEX}
              borderRadius={radius.full}
              backgroundColor="$surface"
              borderWidth={3}
              borderColor="$primaryText"
            />
          </PointAnnotation>
        ))}
      </Mapbox.MapView>

      {/* Mira central para "Adicionar ponto no centro do mapa". */}
      <View
        position="absolute"
        top="50%"
        left="50%"
        marginTop={-12}
        marginLeft={-12}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Plus size={24} color={theme.text.val} />
      </View>

      <SafeAreaView edges={['top']} pointerEvents="box-none">
        <View
          flexDirection="row"
          alignItems="center"
          gap={space[3]}
          margin={space[4]}
          padding={space[2]}
          borderRadius={radius.lg}
          backgroundColor="$surface"
          zIndex={zIndex.header}
          {...elevation[1]}
        >
          <View
            width={44}
            height={44}
            alignItems="center"
            justifyContent="center"
            onPress={draft.goBack}
            accessible
            accessibilityRole="button"
            accessibilityLabel={strings.back}
            testID="new-spot-location-back"
          >
            <ArrowLeft size={22} color={theme.text.val} />
          </View>
          <Text variant="label" accessibilityRole="header" flex={1}>
            {strings.header}
          </Text>
        </View>
      </SafeAreaView>

      <View
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        padding={space[4]}
        paddingBottom={space[8]}
        gap={space[3]}
        backgroundColor="$surface"
        borderTopLeftRadius={radius.xl}
        borderTopRightRadius={radius.xl}
        zIndex={zIndex.sheet}
        {...elevation[3]}
      >
        <Text variant="bodySm" tone="muted">
          {strings.instruction}
        </Text>
        <Text
          variant="label"
          accessibilityLiveRegion="polite"
          testID="new-spot-points-count"
        >
          {draft.countText}
        </Text>
        <Button
          label={strings.addCenter}
          variant="secondary"
          size="md"
          onPress={draft.addAtCenter}
          testID="new-spot-add-center"
        />
        <View flexDirection="row" gap={space[2]}>
          <View flex={1}>
            <Button
              label={strings.undo}
              variant="ghost"
              size="md"
              fullWidth
              disabled={draft.points.length === 0}
              onPress={draft.undo}
              testID="new-spot-undo"
            />
          </View>
          <View flex={1}>
            <Button
              label={strings.clear}
              variant="ghost"
              size="md"
              fullWidth
              disabled={draft.points.length === 0}
              onPress={draft.clear}
              testID="new-spot-clear"
            />
          </View>
        </View>
        <Button
          label={strings.useMyLocation}
          variant="ghost"
          size="md"
          onPress={draft.useMyLocation}
          testID="new-spot-my-location"
        />
        <Button
          label={strings.continue}
          disabled={!draft.canContinue}
          onPress={draft.goNext}
          testID="new-spot-continue"
        />
      </View>
    </View>
  );
};
