import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../test-utils/renderWithTheme';
import { EmptyState } from './EmptyState';
import { TOAST_DURATION, Toast, resolveToastDuration } from './Toast';

describe('EmptyState (DS)', () => {
  it('vazio: mostra título, descrição e ação', async () => {
    const onActionPress = jest.fn();
    await renderWithTheme(
      <EmptyState
        title="Nenhum pico por aqui ainda"
        description="Cadastre o primeiro."
        actionLabel="Cadastrar pico"
        onActionPress={onActionPress}
      />,
    );

    expect(screen.getByText('Nenhum pico por aqui ainda')).toBeTruthy();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Cadastrar pico' }),
    );
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });

  it('erro: usa textos padrão e "Tentar novamente"', async () => {
    const onActionPress = jest.fn();
    await renderWithTheme(
      <EmptyState kind="error" onActionPress={onActionPress} />,
    );

    expect(screen.getByText('Algo deu errado')).toBeTruthy();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Tentar novamente' }),
    );
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});

describe('Toast (DS)', () => {
  it('mostra mensagem e ação, e permite dispensar', async () => {
    const onDismiss = jest.fn();
    const onActionPress = jest.fn();
    await renderWithTheme(
      <Toast
        type="error"
        message="Falha ao salvar"
        actionLabel="Tentar novamente"
        onActionPress={onActionPress}
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByText('Falha ao salvar')).toBeTruthy();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Tentar novamente' }),
    );
    await fireEvent.press(screen.getByTestId('ds-toast-dismiss'));
    expect(onActionPress).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('duração: 4 s por padrão; erro com ação não some sozinho', () => {
    expect(resolveToastDuration({ message: 'ok' })).toBe(TOAST_DURATION);
    expect(
      resolveToastDuration({ type: 'error', message: 'x', actionLabel: 'Ver' }),
    ).toBe(0);
    expect(resolveToastDuration({ message: 'x', duration: 1000 })).toBe(1000);
  });
});
