import {
  Layer,
  Marker,
  NavigationControl,
  Source,
} from 'react-map-gl/mapbox';
import { LocateFixedIcon, PlusIcon, Trash2Icon, Undo2Icon } from 'lucide-react';

import { Button } from '@/atomic/atoms/button';
import { Text } from '@/atomic/atoms/text';
import { Stepper } from '@/atomic/molecules/stepper';
import { Map } from '@/components/map';
import { mapColors } from '@/components/map/colors';
import { pointsCounter } from '@/domain/spot/newSpotForm';

import { useNewSpotMap } from './useNewSpotMap';

export const NewSpotMapTemplate = () => {
  const map = useNewSpotMap();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        role="application"
        aria-label="Mapa para marcar o local do pico"
        aria-describedby="new-spot-map-hint"
        tabIndex={0}
        onKeyDown={map.handleMapKeyDown}
        className="h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gp-focus"
      >
        <Map
          mapRef={map.mapRef}
          initialViewState={map.initialViewState}
          onClick={map.handleMapClick}
          cursor="crosshair"
        >
          <NavigationControl position="bottom-right" showCompass={false} />

          {map.geojson ? (
            <Source id="new-spot" type="geojson" data={map.geojson}>
              <Layer
                id="new-spot-fill"
                type="fill"
                filter={['==', ['geometry-type'], 'Polygon']}
                paint={{
                  'fill-color': mapColors.spotStroke,
                  'fill-opacity': 0.25,
                }}
              />
              <Layer
                id="new-spot-line"
                type="line"
                paint={{ 'line-color': mapColors.spotStroke, 'line-width': 3 }}
              />
            </Source>
          ) : null}

          {map.points.map((point, index) => (
            <Marker
              key={index}
              longitude={point[0]}
              latitude={point[1]}
              draggable
              onClick={(event) => event.originalEvent.stopPropagation()}
              onDragEnd={(event) =>
                map.movePoint(index, [event.lngLat.lng, event.lngLat.lat])
              }
            >
              <span
                aria-hidden="true"
                className="block size-4.5 cursor-grab rounded-full border-2 border-gp-primary-text bg-gp-primary shadow-2"
              />
            </Marker>
          ))}
        </Map>
      </div>

      {/* Mira central: referência do botão "Adicionar ponto no centro do mapa". */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-gp-text after:absolute after:top-0 after:left-1/2 after:h-full after:w-0.5 after:-translate-x-1/2 after:bg-gp-text"
      />

      <p id="new-spot-map-hint" className="sr-only">
        Use o botão Adicionar ponto no centro do mapa, ou pressione Enter com o
        mapa focado, para marcar um canto. Backspace desfaz o último ponto.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {map.announcement}
      </p>

      <aside
        aria-label="Marcar o local do pico"
        className="absolute inset-x-0 bottom-0 z-10 flex max-h-[70%] flex-col gap-4 overflow-y-auto rounded-t-xl bg-gp-surface p-4 shadow-3 md:inset-x-auto md:top-4 md:bottom-auto md:left-4 md:w-90 md:rounded-lg"
      >
        <Stepper current={1} total={2} />
        <div className="flex flex-col gap-1">
          <Text variant="h2" as="h1">
            Marque o local do pico
          </Text>
          <Text variant="body-sm" tone="muted">
            Clique no mapa para marcar os cantos. Arraste um ponto para ajustar.
          </Text>
        </div>

        <div className="flex flex-col gap-1">
          <Text variant="label">{pointsCounter(map.points.length)}</Text>
          {map.points.length > 0 ? (
            <Text variant="caption" tone="muted">
              {map.addressLoading
                ? 'Buscando endereço...'
                : [map.address?.road, map.address?.suburb]
                    .filter(Boolean)
                    .join(', ') || 'Endereço não encontrado'}
            </Text>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={map.addCenterPoint}>
            <PlusIcon aria-hidden="true" />
            Adicionar ponto no centro do mapa
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={map.undo}
              disabled={map.points.length === 0}
            >
              <Undo2Icon aria-hidden="true" />
              Desfazer
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={map.clear}
              disabled={map.points.length === 0}
            >
              <Trash2Icon aria-hidden="true" />
              Limpar
            </Button>
          </div>
          <Button variant="ghost" onClick={map.locateMe}>
            <LocateFixedIcon aria-hidden="true" />
            Usar minha posição
          </Button>
        </div>

        <Button size="lg" onClick={map.goNext} disabled={!map.canContinue}>
          Continuar
        </Button>
      </aside>
    </div>
  );
};
