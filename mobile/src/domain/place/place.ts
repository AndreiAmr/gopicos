/** Resultado de `getFowardGeocoding`. */
export type Place = {
  name: string | null;
  lat: number | null;
  lng: number | null;
  road: string | null;
  district: string | null;
  suburb: string | null;
  city: string | null;
  state: string | null;
  /** [minLat, maxLat, minLng, maxLng], como o backend devolve. */
  boundingBox: number[] | null;
};

export const SEARCH_MIN_CHARS = 3;
export const SEARCH_MAX_RESULTS = 5;
export const SEARCH_DEBOUNCE_MS = 300;

export const placeStrings = {
  placeholder: 'Buscar cidade ou endereço',
  cancel: 'Cancelar',
  clear: 'Limpar busca',
  hint: 'Digite ao menos 3 letras',
  searching: 'Buscando...',
  empty: 'Nenhum lugar encontrado. Tente outro nome ou endereço.',
  error: 'Não foi possível buscar agora.',
  retry: 'Tentar novamente',
} as const;

/** Texto da busca é grande o bastante para consultar? */
export const canSearch = (text: string): boolean =>
  text.trim().length >= SEARCH_MIN_CHARS;

/** Dica "Digite ao menos 3 letras" para 1 a 2 caracteres. */
export const shouldShowHint = (text: string): boolean => {
  const length = text.trim().length;
  return length > 0 && length < SEARCH_MIN_CHARS;
};

/** Até 5 resultados, só os que têm coordenadas. */
export const limitPlaces = (places: Array<Place | null> | null | undefined): Place[] =>
  (places ?? [])
    .filter(
      (place): place is Place =>
        place != null && place.lat != null && place.lng != null,
    )
    .slice(0, SEARCH_MAX_RESULTS);

/** Nome principal da sugestão. */
export const placeTitle = (place: Place): string =>
  place.road?.trim() || place.name?.trim() || place.city?.trim() || '';

/** Contexto da sugestão ("Bela Vista, São Paulo, SP"). */
export const placeContext = (place: Place): string => {
  const title = placeTitle(place);
  const parts = [place.suburb || place.district, place.city, place.state]
    .map(part => part?.trim())
    .filter((part): part is string => Boolean(part) && part !== title);
  return Array.from(new Set(parts)).join(', ');
};

/** Texto que fica no campo depois de escolher. */
export const placeFieldText = (place: Place): string =>
  place.name?.trim() || placeTitle(place);

/** Destino da câmera: limites (ne/sw em [lng, lat]) ou centro com zoom padrão. */
export type CameraTarget =
  | { type: 'bounds'; ne: [number, number]; sw: [number, number] }
  | { type: 'center'; center: [number, number]; zoom: number };

export const cameraTarget = (place: Place): CameraTarget | null => {
  if (place.lat == null || place.lng == null) return null;

  const box = place.boundingBox;
  if (box && box.length === 4 && box.every(Number.isFinite)) {
    const [minLat, maxLat, minLng, maxLng] = box;
    if (maxLat > minLat && maxLng > minLng) {
      return { type: 'bounds', ne: [maxLng, maxLat], sw: [minLng, minLat] };
    }
  }

  return { type: 'center', center: [place.lng, place.lat], zoom: 14 };
};
