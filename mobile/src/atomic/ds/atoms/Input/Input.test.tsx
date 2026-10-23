import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { Input } from './index';

describe('Input (DS)', () => {
  it('default: rótulo visível e onChangeText', async () => {
    const onChangeText = jest.fn();
    await renderWithTheme(
      <Input label="E-mail" value="" onChangeText={onChangeText} />,
    );

    expect(screen.getByText('E-mail')).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId('ds-input'), 'a@a.com');
    expect(onChangeText).toHaveBeenCalledWith('a@a.com');
  });

  it('erro: mostra a mensagem com alerta e esconde a dica', async () => {
    await renderWithTheme(
      <Input label="E-mail" error="E-mail inválido" hint="Use seu e-mail" />,
    );

    expect(screen.getByText('E-mail inválido')).toBeTruthy();
    expect(screen.getByTestId('ds-input-error')).toBeTruthy();
    expect(screen.queryByText('Use seu e-mail')).toBeNull();
  });

  it('sem erro mostra a dica', async () => {
    await renderWithTheme(<Input label="E-mail" hint="Use seu e-mail" />);
    expect(screen.getByText('Use seu e-mail')).toBeTruthy();
  });

  it('desabilitado e loading: campo não editável', async () => {
    await renderWithTheme(<Input label="Nome" disabled />);
    expect(screen.getByTestId('ds-input').props.editable).toBe(false);

    await renderWithTheme(<Input label="Apelido" loading />);
    expect(screen.getByTestId('ds-input').props.editable).toBe(false);
  });
});
