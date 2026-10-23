import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/** Referência global da navegação, para sair de telas protegidas fora de componentes. */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Volta ao Login limpando a pilha (o botão voltar não retorna a telas
 * protegidas). `params` leva o aviso de contexto (sessão expirada, conta excluída).
 */
export const resetToLogin = (params?: RootStackParamList['Login']) => {
  if (!navigationRef.isReady()) return;

  navigationRef.reset({ index: 0, routes: [{ name: 'Login', params }] });
};
