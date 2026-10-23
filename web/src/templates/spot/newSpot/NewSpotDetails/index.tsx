import { Controller } from 'react-hook-form';
import { Navigate } from 'react-router';

import { Button } from '@/atomic/atoms/button';
import { Checkbox } from '@/atomic/atoms/checkbox';
import { Input } from '@/atomic/atoms/input';
import { Text } from '@/atomic/atoms/text';
import { Textarea } from '@/atomic/atoms/textarea';
import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { Stepper } from '@/atomic/molecules/stepper';
import { MODALITY_OPTIONS } from '@/domain/spot/newSpotForm';
import { cn } from '@/lib/utils';
import { MiniMap } from '@/pages/app/spot/details/MiniMap';
import { URL } from '@/routes/url';

import { PhotoPicker } from './PhotoPicker';
import { useNewSpotDetails } from './useNewSpotDetails';

type SegmentedProps = {
  label: string;
  options: { value: boolean; label: string }[];
  value: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

const Segmented = ({ label, options, value, disabled, onChange }: SegmentedProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-body-sm font-semibold text-gp-text">{label}</span>
    <div role="radiogroup" aria-label={label} className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            'h-11 flex-1 rounded-md border text-body-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-gp-focus disabled:opacity-40',
            value === option.value
              ? 'border-gp-primary bg-gp-primary text-gp-on-primary'
              : 'border-gp-border bg-gp-surface text-gp-text',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

export const NewSpotDetailsTemplate = () => {
  const page = useNewSpotDetails();
  const { form } = page;
  const { register, control, formState, watch } = form;
  const { errors } = formState;
  const isPaid = watch('isPaid');
  const alwaysOpen = watch('alwaysOpen');
  const name = watch('name');

  if (!page.hasLocation) {
    return <Navigate to={URL.NEW_SPOT} replace />;
  }

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <form
        noValidate
        onSubmit={page.submit}
        className="flex w-full max-w-140 flex-col gap-6"
      >
        <Stepper current={2} total={2} />
        <Text variant="h1" as="h1" className="font-title">
          Detalhes do pico
        </Text>

        <section aria-label="Local marcado" className="flex flex-col gap-2">
          <MiniMap
            coordinates={{
              type: 'Polygon',
              coordinates: [[...page.points, page.points[0]]],
            }}
            name={name.trim() || 'novo pico'}
            className="h-35"
          />
          <div className="flex items-center justify-between">
            <Text variant="body-sm" tone="muted">
              Local marcado, {page.points.length} pontos
            </Text>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={page.changeLocation}
              disabled={page.submitting}
            >
              Alterar
            </Button>
          </div>
        </section>

        <PhotoPicker
          photos={page.photos}
          error={page.photoError}
          disabled={page.submitting}
          onAdd={page.handleAddPhotos}
          onRemove={page.handleRemovePhoto}
        />

        <Input
          id="spot-name"
          label="Nome"
          maxLength={80}
          readOnly={page.submitting}
          error={errors.name?.message}
          {...register('name')}
        />

        <Textarea
          id="spot-description"
          label="Descrição"
          maxLength={1000}
          readOnly={page.submitting}
          error={errors.description?.message}
          aria-invalid={!!errors.description}
          {...register('description')}
        />

        <Controller
          control={control}
          name="modality"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <span
                id="spot-modality-label"
                className={cn(
                  'text-body-sm font-semibold text-gp-text',
                  errors.modality && 'text-gp-error',
                )}
              >
                Modalidade
              </span>
              <div
                role="radiogroup"
                aria-labelledby="spot-modality-label"
                className="flex flex-wrap gap-2"
              >
                {MODALITY_OPTIONS.map((option, index) => (
                  <button
                    key={option.value}
                    id={index === 0 ? 'spot-modality' : undefined}
                    type="button"
                    role="radio"
                    aria-checked={field.value === option.value}
                    disabled={page.submitting}
                    onClick={() => field.onChange(option.value)}
                    onBlur={field.onBlur}
                    className={cn(
                      'h-11 rounded-full border px-4 text-body-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-gp-focus disabled:opacity-40',
                      field.value === option.value
                        ? 'border-gp-primary bg-gp-primary text-gp-on-primary'
                        : 'border-gp-border bg-gp-surface text-gp-text',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.modality ? (
                <p className="text-caption text-gp-error">
                  {errors.modality.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <Controller
          control={control}
          name="isPaid"
          render={({ field }) => (
            <Segmented
              label="Entrada"
              value={field.value}
              disabled={page.submitting}
              onChange={field.onChange}
              options={[
                { value: false, label: 'Gratuito' },
                { value: true, label: 'Pago' },
              ]}
            />
          )}
        />
        {isPaid ? (
          <Input
            id="spot-entryAmount"
            label="Valor"
            placeholder="R$ 20"
            readOnly={page.submitting}
            error={errors.entryAmount?.message}
            {...register('entryAmount')}
          />
        ) : null}

        <Controller
          control={control}
          name="alwaysOpen"
          render={({ field }) => (
            <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
              <span className="text-body-sm font-semibold text-gp-text">
                Aberto 24 horas
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={field.value}
                aria-label="Aberto 24 horas"
                disabled={page.submitting}
                onClick={() => field.onChange(!field.value)}
                className={cn(
                  'relative h-7 w-12 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gp-focus disabled:opacity-40',
                  field.value ? 'bg-gp-primary' : 'bg-gp-border',
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 left-1 size-5 rounded-full bg-gp-surface shadow-1 transition-transform',
                    field.value && 'translate-x-5',
                  )}
                />
              </button>
            </label>
          )}
        />
        {!alwaysOpen ? (
          <Input
            id="spot-openingHours"
            label="Horário de funcionamento"
            placeholder="Seg a sex, 8h às 22h"
            readOnly={page.submitting}
            error={errors.openingHours?.message}
            {...register('openingHours')}
          />
        ) : null}

        <div className="flex flex-col gap-3">
          <Controller
            control={control}
            name="hasCoverage"
            render={({ field }) => (
              <Checkbox
                id="spot-hasCoverage"
                label="Coberto"
                checked={field.value}
                disabled={page.submitting}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
          <Controller
            control={control}
            name="equipmentRequired"
            render={({ field }) => (
              <Checkbox
                id="spot-equipmentRequired"
                label="Exige equipamento de proteção"
                checked={field.value}
                disabled={page.submitting}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {page.announcement}
        </p>

        {page.banner ? (
          <AlertBanner
            variant="error"
            action={
              page.banner.network
                ? { label: 'Tentar novamente', onClick: () => void page.submit() }
                : undefined
            }
          >
            {page.banner.message}
          </AlertBanner>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={page.submitting}
            onClick={page.changeLocation}
          >
            Voltar
          </Button>
          <Button type="submit" size="lg" loading={page.submitting}>
            Criar pico
          </Button>
        </div>
      </form>
    </div>
  );
};
