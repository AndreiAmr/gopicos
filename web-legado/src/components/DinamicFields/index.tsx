import React, { useCallback, useMemo } from 'react';

import { ControlledInput } from '../ui/Input/ControlledInput';
import ControlledSelect, { IOption } from '../ui/Select/ControlledSelect';
import { useFormContext } from 'react-hook-form';
import _, { isArray } from 'lodash';

type FieldRequiredProps = {
  fieldName: NestedPaths<NewSpotProps>;
  valueExpected: string[] | string | number | boolean;
};

export type FieldProps = {
  label: string;
  type: string;
  options?: IOption[];
  name: NestedPaths<NewSpotProps>;
  additionalField?: FieldProps;
  fieldRequiredRule?: FieldRequiredProps;
  disableRegex?: RegExp;
};

type DinamicFieldsProps = {
  fields: FieldProps[];
};

export const DinamicFields = ({ fields }: DinamicFieldsProps) => {
  const formMethods = useFormContext<NewSpotProps>();

  const renderItem = useCallback(
    (field: FieldProps) => {
      let component = null;
      let isRuleValid = false;

      if (field.fieldRequiredRule) {
        const valueRequiredField = formMethods.watch(
          field.fieldRequiredRule.fieldName as keyof NewSpotProps
        );

        isRuleValid =
          _.isEqual(
            valueRequiredField,
            field.fieldRequiredRule.valueExpected
          ) ||
          _.includes(
            field.fieldRequiredRule.valueExpected as any,
            valueRequiredField as any
          );
      }

      if (field.type === 'select') {
        component = (
          <ControlledSelect
            label={field.label}
            name="testing"
            options={field.options || []}
            value=""
            className="not-dark:bg-white"
            disabled={field.fieldRequiredRule && !isRuleValid}
            onChange={(value: string) =>
              formMethods.setValue(field.name as keyof NewSpotProps, value)
            }
          />
        );
      }

      if (field.type === 'input') {
        component = (
          <ControlledInput
            label={field.label}
            name={field.name as string}
            placeholder="testing"
            disabled={field.fieldRequiredRule && !isRuleValid}
            onChange={(e) =>
              formMethods.setValue(
                field.name as keyof NewSpotProps,
                e.target.value
              )
            }
          />
        );
      }

      return (
        <React.Fragment>
          {component}
          {field.additionalField && renderItem(field.additionalField)}
        </React.Fragment>
      );
    },
    [formMethods]
  );

  const fieldsRendered = useMemo(() => {
    return fields.map((item) => {
      return renderItem(item);
    });
  }, [fields, renderItem]);

  return (
    <div className="w-full flex-wrap  grid grid-cols-1 md:grid-cols-2 gap-4 ">
      {fieldsRendered}
    </div>
  );
};
