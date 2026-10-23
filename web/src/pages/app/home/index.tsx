import { GeolocateControl, NavigationControl, Popup } from 'react-map-gl/mapbox';
import { PlusIcon } from 'lucide-react';

import { Map } from '@/components/map';
import { SpotsLayers } from '@/components/map/spotsLayers';
import { SPOT_INTERACTIVE_LAYERS } from '@/components/map/spotsLayers/constants';
import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { EmptyState } from '@/atomic/molecules/emptyState';
import { SpotPreview } from '@/atomic/molecules/spotPreview';
import { Button } from '@/atomic/atoms/button';
import { Text } from '@/atomic/atoms/text';
import { homeStrings } from './logic';
import { useHome } from './useHome';

export const HomePage = () => {
  const home = useHome();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        role="application"
        aria-label={homeStrings.mapLabel}
        aria-describedby="home-map-hint"
        tabIndex={0}
        onKeyDown={home.handleMapKeyDown}
        className="h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gp-focus"
      >
        <Map
          mapRef={home.mapRef}
          interactiveLayerIds={SPOT_INTERACTIVE_LAYERS}
          onClick={home.handleMapClick}
          initialViewState={home.initialViewState}
          onMoveEnd={home.handleMoveEnd}
        >
          <SpotsLayers spots={home.spots} selectedId={home.selectedId} />

          <NavigationControl position="bottom-right" showCompass={false} />
          <GeolocateControl
            position="bottom-right"
            onGeolocate={(event) =>
              home.setUserPosition([
                event.coords.longitude,
                event.coords.latitude,
              ])
            }
          />

          {home.isWide && home.selected && home.selectedCenter ? (
            <Popup
              longitude={home.selectedCenter[0]}
              latitude={home.selectedCenter[1]}
              offset={24}
              closeButton={false}
              closeOnClick={false}
              maxWidth="340px"
              onClose={home.clearSelection}
            >
              <div className="w-85">
                <SpotPreview
                  spot={home.selected}
                  distanceLabel={home.distanceLabel}
                />
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>

      <p id="home-map-hint" className="sr-only">
        {homeStrings.mapHint}
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {home.announcement}
      </p>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-start gap-2 p-4">
        {home.isLoading ? (
          <div
            role="status"
            data-testid="home-loading"
            className="rounded-full bg-gp-surface px-3 py-2 shadow-1"
          >
            <Text variant="caption">{homeStrings.loading}</Text>
          </div>
        ) : null}
        {home.isError ? (
          <AlertBanner
            variant="error"
            className="pointer-events-auto w-full max-w-120"
            action={{ label: homeStrings.retry, onClick: home.retry }}
          >
            {homeStrings.error}
          </AlertBanner>
        ) : null}
      </div>

      <Button
        onClick={home.createSpot}
        className="absolute right-4 top-4 shadow-2"
      >
        <PlusIcon aria-hidden="true" />
        {homeStrings.newSpot}
      </Button>

      {!home.isWide && home.selected ? (
        <div className="absolute inset-x-4 bottom-4 mx-auto w-full max-w-100">
          <SpotPreview
            spot={home.selected}
            distanceLabel={home.distanceLabel}
          />
        </div>
      ) : null}

      {home.isEmpty && !home.selected ? (
        <div
          data-testid="home-empty"
          className="absolute inset-x-4 bottom-4 mx-auto w-full max-w-100 rounded-xl bg-gp-surface shadow-3"
        >
          <EmptyState
            title={homeStrings.emptyTitle}
            description={homeStrings.emptyDescription}
            actionLabel={homeStrings.emptyAction}
            onAction={home.createSpot}
          />
        </div>
      ) : null}
    </div>
  );
};
