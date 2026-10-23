import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Star } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { space } from '../../../../../config/tamagui/tokens';
import { Button } from '../../../../../atomic/ds/atoms/Button';
import { TextLink } from '../../../../../atomic/ds/auth/TextLink';
import { BottomSheet } from '../../../../../atomic/ds/molecules/BottomSheet';
import { SwitchRow } from '../../../../../atomic/ds/molecules/FormControls';
import {
  BrandTitle,
  CornerHalftone,
  StickerChip,
  StickerSegmented,
  TapeLabel,
} from '../../../../../atomic/ds/brand';
import {
  ENTRY_OPTIONS,
  EntryFilter,
  MODALITY_OPTIONS,
  MinRating,
  RATING_OPTIONS,
  SpotFilters,
  NO_FILTERS,
  applyButtonLabel,
  filterStrings,
  hasActiveFilters,
  sameFilters,
  toggleModality,
} from '../../../../../domain/spot/filters';

type FilterSheetProps = {
  /** Filtros aplicados no momento (valor inicial ao abrir). */
  filters: SpotFilters;
  /** O botão fica em `loading` enquanto o mapa recarrega. */
  applying: boolean;
  onApply: (filters: SpotFilters) => void;
  /** Prévia ao vivo (UX-H19): rascunho a cada toque; `null` ao fechar. */
  onDraftChange?: (draft: SpotFilters | null) => void;
  /** Picos na área com o rascunho ("Ver 12 picos"). */
  previewCount?: number | null;
  bottomInset?: number;
  topInset?: number;
  /** Altura máxima do snap 1 (70% da área disponível). */
  maxContentHeight?: number;
  /** Altura do snap 2 (expandido até a tab bar). */
  expandedHeight?: number;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View gap={space[3]}>
    <TapeLabel>{title}</TapeLabel>
    {children}
  </View>
);

/**
 * Sheet de filtros com identidade de rua (spec home.md 6.9): mesma lógica de
 * antes (modalidade multi, entrada, cobertura, nota mínima), adesivos, fita
 * nos títulos e rodapé fixo. Só "Aplicar" confirma; fechar descarta.
 */
export const FilterSheet = forwardRef<BottomSheetModal, FilterSheetProps>(
  (
    {
      filters,
      applying,
      onApply,
      onDraftChange,
      previewCount = null,
      bottomInset = 0,
      topInset = 0,
      maxContentHeight,
      expandedHeight,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [draft, setDraftState] = useState<SpotFilters>(filters);
    const draftRef = useRef(draft);

    const setDraft = useCallback(
      (update: (current: SpotFilters) => SpotFilters) => {
        const next = update(draftRef.current);
        draftRef.current = next;
        setDraftState(next);
        onDraftChange?.(next);
      },
      [onDraftChange],
    );

    // Reabrir parte dos filtros aplicados (descarta rascunho não aplicado).
    useEffect(() => {
      draftRef.current = filters;
      setDraftState(filters);
    }, [filters]);

    const dismiss = useCallback(() => {
      if (ref && typeof ref !== 'function') {
        ref.current?.dismiss();
      }
    }, [ref]);

    const changed = !sameFilters(draft, filters);

    const apply = useCallback(() => {
      onApply(draftRef.current);
      dismiss();
    }, [dismiss, onApply]);

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <BottomSheetFooter {...props}>
          <View
            paddingHorizontal={space[4]}
            paddingTop={space[3]}
            paddingBottom={space[4]}
            borderTopWidth={1}
            borderTopColor="$divider"
            backgroundColor="$surface"
          >
            <Button
              label={applyButtonLabel(changed ? previewCount : null)}
              loading={applying}
              onPress={apply}
              fullWidth
              testID="filter-apply"
            />
          </View>
        </BottomSheetFooter>
      ),
      [applying, apply, changed, previewCount],
    );

    return (
      <BottomSheet
        ref={ref}
        title={filterStrings.title}
        accessibilityLabel={filterStrings.title}
        backdrop="dim"
        bottomInset={bottomInset}
        topInset={topInset}
        enableDynamicSizing
        maxDynamicContentSize={maxContentHeight}
        snapPoints={expandedHeight ? [expandedHeight] : undefined}
        footerComponent={renderFooter}
        onClose={() => {
          draftRef.current = filters;
          setDraftState(filters);
          onDraftChange?.(null);
        }}
        renderContent={() => (
          <BottomSheetScrollView
            stickyHeaderIndices={[0]}
            contentContainerStyle={styles.body}
            testID="filter-sheet"
          >
            <View backgroundColor="$surface" paddingHorizontal={space[4]} paddingTop={space[2]} paddingBottom={space[2]}>
              <CornerHalftone />
              <View flexDirection="row" alignItems="flex-start" justifyContent="space-between">
                <BrandTitle fontSize={30} sprayWidth={96}>
                  {filterStrings.title}
                </BrandTitle>
                {hasActiveFilters(draft) ? (
                  <View paddingTop={space[1]}>
                    <TextLink
                      label={filterStrings.clear}
                      onPress={() => setDraft(() => NO_FILTERS)}
                      testID="filter-clear"
                    />
                  </View>
                ) : null}
              </View>
            </View>

            <View gap={space[5]} paddingHorizontal={space[4]} paddingTop={space[2]}>
              <Section title={filterStrings.modality}>
                <View
                  flexDirection="row"
                  flexWrap="wrap"
                  columnGap={10}
                  accessibilityLabel={filterStrings.modality}
                  testID="filter-modality"
                >
                  {MODALITY_OPTIONS.map((option, index) => (
                    <StickerChip
                      key={option.value}
                      label={option.label}
                      index={index}
                      selected={draft.modalities.includes(option.value)}
                      onPress={() =>
                        setDraft(current => toggleModality(current, option.value))
                      }
                      testID={`filter-modality-${option.value}`}
                    />
                  ))}
                </View>
              </Section>

              <Section title={filterStrings.entry}>
                <StickerSegmented
                  label={filterStrings.entry}
                  options={ENTRY_OPTIONS}
                  value={draft.entry}
                  onChange={value =>
                    setDraft(current => ({ ...current, entry: value as EntryFilter }))
                  }
                  testID="filter-entry"
                />
              </Section>

              <Section title={filterStrings.coverage}>
                <SwitchRow
                  label={filterStrings.covered}
                  value={draft.coveredOnly}
                  onChange={value =>
                    setDraft(current => ({ ...current, coveredOnly: value }))
                  }
                  testID="filter-covered"
                />
              </Section>

              <Section title={filterStrings.minRating}>
                <StickerSegmented
                  label={filterStrings.minRating}
                  options={RATING_OPTIONS.map(option => {
                    const selected = draft.minRating === option.value;
                    return {
                      value: String(option.value),
                      label: option.label,
                      icon:
                        option.value > 0 ? (
                          <Star
                            size={14}
                            color={selected ? theme.onPrimary.val : theme.star.val}
                            fill={selected ? theme.onPrimary.val : theme.star.val}
                          />
                        ) : undefined,
                    };
                  })}
                  value={String(draft.minRating)}
                  onChange={value =>
                    setDraft(current => ({
                      ...current,
                      minRating: Number(value) as MinRating,
                    }))
                  }
                  testID="filter-rating"
                />
              </Section>
            </View>
          </BottomSheetScrollView>
        )}
      />
    );
  },
);

FilterSheet.displayName = 'FilterSheet';

const styles = StyleSheet.create({
  // Espaço para o rodapé fixo ("Aplicar filtros").
  body: { paddingBottom: 96 },
});
