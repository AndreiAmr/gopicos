import { Input } from '@/atomic/atoms/input';
import { InputMask } from '@/atomic/atoms/inputMask';
import { ImagesSelect } from './ImagesSelect';
import { Textarea } from '@/atomic/atoms/textarea';
import { Divisor } from '@/atomic/atoms/divisor';
import { Map } from '@/components/map';
import { useNewSpotDetails } from './useNewSpotDetails';
import { MapPolygon } from '@/components/map/polygon';
import { OptionProps, Select } from '@/atomic/atoms/select';
import { Checkbox } from '@/atomic/atoms/checkbox';

import { formatCurrency } from '@/utils/currency';
import { Spinner } from '@/atomic/atoms/spinner';
import { Button } from '@/atomic/atoms/button';

const modalityOptions: OptionProps[] = [
  {
    label: 'Street',
    value: 'street',
  },
  {
    label: 'Vertical',
    value: 'vertical',
  },
  {
    label: 'Ambos',
    value: 'both',
  },
];

export const NewSpotDetailsTemplate = () => {
  const {
    mapRef,
    spotFake,
    register,
    isLoadingReverseGeocoding,
    handleSubmit,
    errors,
    setValue,
    alwaysOpen,
    equipamentRequired,
    hasCoverage,
    isPaid,
    submitHandler,
    setSelectedFiles,
    isLoading,
  } = useNewSpotDetails();

  return (
    <div className="pt-12 pb-10  px-10 bg-gray-50  border ">
      <h1 className="text-xl font-medium text-gray-800">
        Escreva as informações sobre o pico
      </h1>
      <p className="text-sm text-gray-600">
        Forneça o máximo de detalhes possíveis para as outras pessoas
        localizarem o pico com mais facilidade
      </p>

      <div className="flex flex-col gap-6 ">
        <ImagesSelect
          error={errors.images?.message}
          onFilesChange={setSelectedFiles}
        />
        <Input
          label="Nome"
          placeholder="Digite aqui..."
          error={errors.name?.message}
          aria-invalid={!!errors.name?.message}
          {...register('name', { required: true })}
        />

        <Textarea
          label="Descrição"
          placeholder="Escreva aqui a descrição do pico"
          {...register('description', { required: true })}
          error={errors.description?.message}
          aria-invalid={!!errors.description?.message}
        />
        <Divisor className="w-[95%] mx-auto" />

        <h1 className="text-xl font-medium text-gray-800">
          Informações de endereço
        </h1>

        <div className="h-70 w-full rounded-xl overflow-hidden shadow-md">
          <Map mapRef={mapRef} scrollZoom={false} dragPan={false}>
            <MapPolygon spot={spotFake} />
          </Map>
        </div>

        <div className="flex gap-8 ">
          <Input
            label="Rua"
            placeholder="Digite aqui..."
            className="bg-white shadow "
            containerStyle="w-full"
            isLoading={isLoadingReverseGeocoding}
            {...register('road', { required: true })}
            error={errors.road?.message}
            aria-invalid={!!errors.road?.message}
          />
          <Input
            label="Bairro"
            placeholder="Digite aqui..."
            className="bg-white shadow "
            containerStyle="w-full"
            isLoading={isLoadingReverseGeocoding}
            {...register('suburb', { required: true })}
            error={errors.suburb?.message}
            aria-invalid={!!errors.suburb?.message}
          />
        </div>

        <div className="flex gap-8 ">
          <Input
            label="Número"
            placeholder="Digite aqui..."
            className="bg-white  shadow "
            containerStyle="w-full"
            {...register('number')}
          />
          <Input
            label="Complemento"
            placeholder="Digite aqui..."
            className="bg-white  shadow "
            containerStyle="w-full"
            {...register('complement')}
          />
        </div>
        <Textarea
          label="Pontos de referência"
          placeholder="Escreva aqui a descrição do pico"
          {...register('reference')}
          error={errors.reference?.message}
          aria-invalid={!!errors.reference?.message}
        />

        <Divisor className="w-[95%] mx-auto" />

        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-medium text-gray-800">Adicionais</h1>

          <Select
            title="Modalidade"
            placeholder="Selecione"
            options={modalityOptions}
            {...register('modality', { required: true })}
            error={errors.modality?.message}
            onChange={(value) => setValue('modality', value)}
          />
          <div className="flex flex-col gap-3">
            <Checkbox
              id="equipament-required"
              label="Equipamento de segurança obrigatório"
              onClick={() =>
                setValue('equipamentRequired', !equipamentRequired)
              }
            />
            <Checkbox
              id="entry-paid"
              label="Entrada paga"
              onClick={() => setValue('isPaid', !isPaid)}
            />
            {isPaid && (
              <>
                <InputMask
                  label="Preço da entrada"
                  {...register('entryAmount')}
                  replacement={{ _: /\d/ }}
                  mask="R$ __________"
                  placeholder="R$ 0,00"
                  containerStyle="w-full"
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);

                    setValue('entryAmount', formatted);
                  }}
                  error={errors.entryAmount?.message}
                  aria-invalid={!!errors.entryAmount?.message}
                />
              </>
            )}
            <Checkbox
              id="always-open"
              label="Sempre aberto"
              onClick={() => setValue('alwaysOpen', !alwaysOpen)}
              defaultChecked={alwaysOpen}
            />

            {!alwaysOpen && (
              <div className="flex gap-2  flex-1 ">
                <Input
                  label="Das"
                  type="time"
                  id="time-picker"
                  step="1"
                  defaultValue=""
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  containerStyle="w-full"
                  {...register('openingTime')}
                  error={errors.openingTime?.message}
                  aria-invalid={!!errors.openingTime?.message}
                />

                <Input
                  label="Até"
                  type="time"
                  id="time-picker"
                  step="1"
                  defaultValue=""
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  containerStyle="w-full"
                  {...register('closingTime')}
                  error={errors.closingTime?.message}
                  aria-invalid={!!errors.closingTime?.message}
                />
              </div>
            )}

            <Checkbox
              id="has-coverage"
              label="Tem proteção contra chuva"
              onClick={() => setValue('hasCoverage', !hasCoverage)}
            />

            <Button
              className="self-start bg-yellow-400 mt-5 hover:bg-yellow-500"
              onClick={() => {
                handleSubmit(submitHandler)();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Cadastrando
                </>
              ) : (
                'Cadastrar pico'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
