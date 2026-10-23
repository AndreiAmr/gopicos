import { useCallback, useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import {
  Place,
  SEARCH_DEBOUNCE_MS,
  canSearch,
  limitPlaces,
  placeFieldText,
  shouldShowHint,
} from '../../../domain/place/place';
import { placeSearchQuery } from './placeSearchQuery';

export type PlaceSearchStatus =
  | 'idle'
  | 'hint'
  | 'loading'
  | 'ready'
  | 'empty'
  | 'error';

/**
 * Busca de lugar por cidade ou endereço: a partir de 3 letras, com atraso de
 * 300 ms, no máximo 5 resultados. Respostas antigas são descartadas.
 */
export const usePlaceSearch = () => {
  const client = useApolloClient();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PlaceSearchStatus>('idle');
  const [results, setResults] = useState<Place[]>([]);
  const generation = useRef(0);

  const run = useCallback(
    async (search: string) => {
      const current = ++generation.current;
      setStatus('loading');
      try {
        const { data } = await client.query({
          query: placeSearchQuery,
          variables: { search: search.trim() },
          fetchPolicy: 'network-only',
        });
        if (current !== generation.current) return;
        const places = limitPlaces(data?.getFowardGeocoding);
        setResults(places);
        setStatus(places.length > 0 ? 'ready' : 'empty');
      } catch {
        if (current === generation.current) {
          setResults([]);
          setStatus('error');
        }
      }
    },
    [client],
  );

  useEffect(() => {
    generation.current += 1;

    if (!canSearch(query)) {
      setResults([]);
      setStatus(shouldShowHint(query) ? 'hint' : 'idle');
      return;
    }

    setStatus('loading');
    const timer = setTimeout(() => run(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, run]);

  /** Digitação: atualiza o campo e dispara a busca. */
  const onChangeText = useCallback((value: string) => {
    setText(value);
    setQuery(value);
  }, []);

  /** Escolha de um resultado: o campo mostra o nome e a busca para. */
  const commit = useCallback((place: Place) => {
    setText(placeFieldText(place));
    setQuery('');
  }, []);

  /** Volta o campo a um texto sem buscar (cancelar). */
  const restore = useCallback((value: string) => {
    setText(value);
    setQuery('');
  }, []);

  const clear = useCallback(() => {
    setText('');
    setQuery('');
  }, []);

  const retry = useCallback(() => {
    if (canSearch(text)) run(text);
  }, [run, text]);

  return {
    text,
    status,
    results,
    onChangeText,
    commit,
    restore,
    clear,
    retry,
  };
};
