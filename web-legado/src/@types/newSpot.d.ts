type CoordinateProps = {
  lat: number;
  lng: number;
};

type LatLngObject = {
  type: 'object';
  value: {
    lat?: number;
    lng?: number;
  };
};

type CoordinatesProps = number[][][] | number[];

type AddressProps = {
  street?: string;
  country: string;
  state: string;
  coordinates: CoordinatesProps;
  lat?: number;
  lng?: number;
};

type MarkingType = 'POLYGON' | 'POINT';

enum EModality {
  Vertical = 'VERTICAL',
  Street = 'STREET',
}

type NewSpotProps = {
  streetSearch: string;
  name: string;
  description: string;
  address: AddressProps;
  markingType: MarkingType;
  step: number;
  images: File[];
  modality?: EModality;
  equipmentRequired: boolean;
  isPaid: boolean;
  entryAmount?: string;
  alwaysOpen: boolean;
  openingHours?: string;
  hasCoverage?: string;
  boundingBox?: number[];
};
