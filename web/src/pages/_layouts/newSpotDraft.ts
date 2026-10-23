import { createContext, useContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { NewSpotFormData, Position } from '@/domain/spot/newSpotForm';

/** Rascunho do cadastro, compartilhado entre os passos 1 e 2 (sobrevive ao "Voltar"). */
export type NewSpotDraft = {
  form: UseFormReturn<NewSpotFormData>;
  points: Position[];
  setPoints: React.Dispatch<React.SetStateAction<Position[]>>;
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
  /** Libera a saída sem a confirmação (sucesso ou sessão expirada). */
  allowLeave: () => void;
};

export const NewSpotDraftContext = createContext<NewSpotDraft | null>(null);

export const useNewSpotDraft = (): NewSpotDraft => {
  const draft = useContext(NewSpotDraftContext);
  if (!draft) {
    throw new Error('useNewSpotDraft precisa estar dentro de NewSpotLayout');
  }
  return draft;
};
