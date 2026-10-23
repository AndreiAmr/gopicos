import { forwardRef, useEffect, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'tamagui';
import { space } from '../../../../../config/tamagui/tokens';
import { Button } from '../../../../../atomic/ds/atoms/Button';
import { TextLink } from '../../../../../atomic/ds/auth/TextLink';
import { BottomSheet } from '../../../../../atomic/ds/molecules/BottomSheet';
import {
  ChoiceChips,
  Segmented,
  SwitchRow,
} from '../../../../../atomic/ds/molecules/FormControls';
import {
  ENTRY_OPTIONS,
  EntryFilter,
  MODALITY_OPTIONS,
  MinRating,
  RATING_OPTIONS,
  SpotFilters,
  NO_FILTERS,
  filterStrings,
  hasActiveFilters,
  toggleModality,
} from '../../../../../domain/spot/filters';

type FilterSheetProps = {
  /** Filtros aplicados no momento (valor inicial ao abrir). */
  filters: SpotFilters;
  /** O botão fica em `loading` enquanto o mapa recarrega. */
  applying: boolean;
  onApply: (filters: SpotFilters) => void;
};

/** Sheet de filtros: modalidade (multi), entrada, cobertura e nota mínima. */
export const FilterSheet = forwardRef<BottomSheetModal, FilterSheetProps>(
  ({ filters, applying, onApply }, ref) => {
    const [draft, setDraft] = useState<SpotFilters>(filters);

    // Reabrir parte dos filtros aplicados (descarta rascunho não aplicado).
    useEffect(() => {
      setDraft(filters);
    }, [filters]);

    const dismiss = () => {
      if (ref && typeof ref !== 'function') {
        ref.current?.dismiss();
      }
    };

    return (
      <BottomSheet
        ref={ref}
        title={filterStrings.title}
        onClose={() => setDraft(filters)}
      >
        <View gap={space[4]} testID="filter-sheet">
          {hasActiveFilters(draft) ? (
            <View alignItems="flex-end">
              <TextLink
                label={filterStrings.clear}
                onPress={() => setDraft(NO_FILTERS)}
                testID="filter-clear"
              />
            </View>
          ) : null}

          <ChoiceChips
            label={filterStrings.modality}
            options={MODALITY_OPTIONS}
            value=""
            multiple={draft.modalities}
            onChange={value => setDraft(current => toggleModality(current, value))}
            testID="filter-modality"
          />

          <Segmented
            label={filterStrings.entry}
            options={ENTRY_OPTIONS}
            value={draft.entry}
            onChange={value =>
              setDraft(current => ({ ...current, entry: value as EntryFilter }))
            }
            testID="filter-entry"
          />

          <SwitchRow
            label={filterStrings.covered}
            value={draft.coveredOnly}
            onChange={value =>
              setDraft(current => ({ ...current, coveredOnly: value }))
            }
          />

          <Segmented
            label={filterStrings.minRating}
            options={RATING_OPTIONS.map(option => ({
              value: String(option.value),
              label: option.label,
            }))}
            value={String(draft.minRating)}
            onChange={value =>
              setDraft(current => ({
                ...current,
                minRating: Number(value) as MinRating,
              }))
            }
            testID="filter-rating"
          />

          <Button
            label={filterStrings.apply}
            loading={applying}
            onPress={() => {
              onApply(draft);
              dismiss();
            }}
            fullWidth
            testID="filter-apply"
          />
        </View>
      </BottomSheet>
    );
  },
);

FilterSheet.displayName = 'FilterSheet';
