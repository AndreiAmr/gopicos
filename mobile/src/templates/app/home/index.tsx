import { useRef, useState } from 'react';
import * as S from './styles';
import { Map, MapHandle } from '../../../components/Map';
import { Header } from './components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHome } from './useHome';
import Mapbox from '@rnmapbox/maps';
import Logo from '../../../assets/images/logo.png';
import { LayerMenu } from './components/LayerMenu';
import { mapLayers, MapLayer } from './components/LayerMenu/constants';
import { LocateButton } from './components/LocateButton';

export const HomeTemplate = () => {
  const { spots, mountPolygons, mountSpotCenters } = useHome();
  const [selectedLayer, setSelectedLayer] = useState<MapLayer>(mapLayers[0]);
  const mapRef = useRef<MapHandle>(null);

  return (
    <S.Container>
      <Map ref={mapRef} styleURL={selectedLayer.styleURL}>
        <Mapbox.ShapeSource
          id="spot-source"
          shape={mountPolygons()}
          onPress={event => {
            const spotId = event.features[0]?.properties?.id;

            if (!spotId) {
              return;
            }

            // Futuramente:
            // navigation.navigate('SpotDetails', { spotId });
            console.log('Pico selecionado via poligno:', spotId);
          }}
        >
          <Mapbox.FillLayer
            id="area-fill"
            style={{
              fillColor: '#f9c301',
              fillOpacity: 0.2,
            }}
          />
          <Mapbox.LineLayer
            id="area-line"
            style={{
              lineColor: '#f9c301',
              lineWidth: 3,
            }}
          />
        </Mapbox.ShapeSource>

        <Mapbox.Images images={{ spotLogo: Logo }} />

        <Mapbox.ShapeSource
          id="spot-centers-source"
          shape={mountSpotCenters()}
          hitbox={{ width: 48, height: 48 }}
          onPress={event => {
            const spotId = event.features[0]?.properties?.id;

            if (!spotId) {
              return;
            }

            // Futuramente:
            // navigation.navigate('SpotDetails', { spotId });
            console.log('Pico selecionado:', spotId);
          }}
        >
          <Mapbox.SymbolLayer
            id="spot-centers-layer"
            style={{
              iconImage: 'spotLogo',
              iconSize: 1,
              iconAllowOverlap: true,
              iconIgnorePlacement: true,
            }}
          />
        </Mapbox.ShapeSource>
      </Map>
      <SafeAreaView edges={['top']}>
        <Header />
      </SafeAreaView>
      <LayerMenu
        selectedLayer={selectedLayer}
        onSelectLayer={setSelectedLayer}
      />
      <LocateButton
        onPress={() => {
          mapRef.current?.centerOnUser();
        }}
      />
    </S.Container>
  );
};
