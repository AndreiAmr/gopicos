import { useEffect, useId, useRef, useState } from 'react';
import { CheckIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';

import { Button } from '@/atomic/atoms/button';
import { Text } from '@/atomic/atoms/text';
import { cn } from '@/lib/utils';
import {
  ENTRY_OPTIONS,
  MODALITY_OPTIONS,
  NO_FILTERS,
  RATING_OPTIONS,
  activeChips,
  filterButtonLabel,
  filterStrings,
  hasActiveFilters,
  removeChip,
  toggleModality,
  type EntryFilter,
  type MinRating,
  type SpotFilters,
} from '@/domain/spot/filters';

type Option = { value: string; label: string };

const Segmented = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-1">
    <Text variant="label">{label}</Text>
    <div
      role="radiogroup"
      aria-label={label}
      className="flex overflow-hidden rounded-md border border-gp-border"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-11 flex-1 px-2 text-body-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gp-focus',
              selected
                ? 'bg-gp-primary text-gp-on-primary'
                : 'bg-gp-surface text-gp-text hover:bg-gp-sunken',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

type FilterBarProps = {
  filters: SpotFilters;
  /** Aplicando: o botão "Aplicar" fica em loading. */
  applying: boolean;
  onApply: (filters: SpotFilters) => void;
};

/** Botão "Filtros (n)" com popover de 360 e chips removíveis dos filtros ativos. */
export const FilterBar = ({ filters, applying, onApply }: FilterBarProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SpotFilters>(filters);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Abrir parte sempre dos filtros aplicados; Esc fecha sem aplicar.
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const apply = () => {
    onApply(draft);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="pointer-events-auto relative">
      <div className="flex max-w-[calc(100vw-2rem)] items-center gap-2 overflow-x-auto pb-1">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full border-[1.5px] px-3 text-body-sm font-semibold text-gp-text shadow-1 outline-none focus-visible:ring-2 focus-visible:ring-gp-focus',
            hasActiveFilters(filters)
              ? 'border-gp-primary bg-gp-primary-soft'
              : 'border-gp-border bg-gp-surface',
          )}
        >
          <SlidersHorizontalIcon className="size-4" aria-hidden="true" />
          {filterButtonLabel(filters)}
        </button>

        {activeChips(filters).map((chip) => (
          <button
            key={chip.key}
            type="button"
            aria-label={`Remover filtro ${chip.label}`}
            onClick={() => onApply(removeChip(filters, chip.key))}
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full border-[1.5px] border-gp-primary bg-gp-primary-soft pl-3 pr-2 text-body-sm font-semibold text-gp-primary-text outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
          >
            {chip.label}
            <XIcon className="size-4" aria-hidden="true" />
          </button>
        ))}
      </div>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={filterStrings.title}
          className="max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-40 max-sm:w-auto max-sm:rounded-b-none absolute left-0 top-full z-30 mt-2 flex w-90 flex-col gap-4 rounded-xl bg-gp-surface p-4 shadow-3"
        >
          <div className="flex items-center justify-between">
            <Text variant="h3" as="h2">
              {filterStrings.title}
            </Text>
            <button
              type="button"
              onClick={() => setDraft(NO_FILTERS)}
              disabled={!hasActiveFilters(draft)}
              className="min-h-11 px-1 text-body-sm font-semibold text-gp-primary-text underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-gp-focus disabled:opacity-40"
            >
              {filterStrings.clear}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Text variant="label">{filterStrings.modality}</Text>
            <div className="flex flex-wrap gap-2">
              {MODALITY_OPTIONS.map((option) => {
                const selected = draft.modalities.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setDraft((current) => toggleModality(current, option.value))
                    }
                    className={cn(
                      'inline-flex h-9 items-center gap-1 rounded-full border-[1.5px] px-3 text-body-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-gp-focus',
                      selected
                        ? 'border-gp-primary bg-gp-primary-soft text-gp-primary-text'
                        : 'border-gp-border bg-gp-surface text-gp-text',
                    )}
                  >
                    {selected ? (
                      <CheckIcon className="size-4" aria-hidden="true" />
                    ) : null}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Segmented
            label={filterStrings.entry}
            options={ENTRY_OPTIONS}
            value={draft.entry}
            onChange={(value) =>
              setDraft((current) => ({ ...current, entry: value as EntryFilter }))
            }
          />

          <label className="flex min-h-11 items-center justify-between gap-3 text-body-sm font-semibold text-gp-text">
            {filterStrings.covered}
            <input
              type="checkbox"
              role="switch"
              checked={draft.coveredOnly}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  coveredOnly: event.target.checked,
                }))
              }
              className="size-5 accent-gp-primary"
            />
          </label>

          <Segmented
            label={filterStrings.minRating}
            options={RATING_OPTIONS.map((option) => ({
              value: String(option.value),
              label: option.label,
            }))}
            value={String(draft.minRating)}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                minRating: Number(value) as MinRating,
              }))
            }
          />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={apply} aria-busy={applying || undefined}>
              {filterStrings.apply}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
