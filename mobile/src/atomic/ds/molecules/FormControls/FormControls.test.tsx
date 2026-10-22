import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { PhotoPicker } from '../PhotoPicker';
import { CheckboxRow, ChoiceChips, Segmented } from './index';

const options = [
  { value: 'street', label: 'Street' },
  { value: 'park', label: 'Park' },
];

describe('controles de formulário (DS)', () => {
  it('ChoiceChips marca a opção e mostra erro', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <ChoiceChips
        label="Modalidade"
        options={options}
        value="street"
        onChange={onChange}
        error="Escolha a modalidade."
      />,
    );

    expect(screen.getByRole('radio', { name: 'Street' })).toBeChecked();
    await fireEvent.press(screen.getByRole('radio', { name: 'Park' }));
    expect(onChange).toHaveBeenCalledWith('park');
    expect(screen.getByText('Escolha a modalidade.')).toBeTruthy();
  });

  it('Segmented troca a opção', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <Segmented
        label="Entrada"
        options={[
          { value: 'free', label: 'Gratuito' },
          { value: 'paid', label: 'Pago' },
        ]}
        value="free"
        onChange={onChange}
      />,
    );

    await fireEvent.press(screen.getByRole('radio', { name: 'Pago' }));
    expect(onChange).toHaveBeenCalledWith('paid');
  });

  it('CheckboxRow alterna', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <CheckboxRow label="Coberto" value={false} onChange={onChange} />,
    );

    await fireEvent.press(screen.getByRole('checkbox', { name: 'Coberto' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('PhotoPicker: capa, remover e esconder "Adicionar" no limite', async () => {
    const onRemove = jest.fn();
    const photos = Array.from({ length: 5 }, (_, i) => ({
      uri: `file:///${i}.jpg`,
      name: `${i}.jpg`,
    }));
    await renderWithTheme(
      <PhotoPicker
        label="Fotos"
        photos={photos}
        max={5}
        counter="5 de 5 fotos"
        onAdd={jest.fn()}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByText('Capa')).toBeTruthy();
    expect(screen.queryByTestId('photo-add')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Remover foto 2' }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
