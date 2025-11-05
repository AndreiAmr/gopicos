import { useBasicData } from './useBasicData';

import { ControlledInput } from '@/components/ui/Input/ControlledInput';
import { TextArea } from '@/components/ui/TextArea/index';
import { ImagePreview } from '../ImagePreview';
import { DinamicFields, FieldProps } from '@/components/DinamicFields';

const fields: FieldProps[] = [
  {
    label: 'Modalidade',
    type: 'select',
    name: 'modality',
    options: [
      {
        label: 'Street',
        value: 'Street',
      },
      {
        label: 'Vertical',
        value: 'Vertical',
      },
    ],
    additionalField: {
      label: 'Precisa de equipamento de segurança  ? ',
      type: 'select',
      name: 'equipmentRequired',
      options: [
        {
          value: true,
          label: 'Sim',
        },
        {
          value: false,
          label: 'Não',
        },
      ],
      fieldRequiredRule: {
        fieldName: 'modality',
        valueExpected: ['Vertical', 'Street'],
      },
    },
  },
  {
    label: 'Pago ?',
    type: 'select',
    name: 'isPaid',
    options: [
      {
        label: 'Sim',
        value: true,
      },
      {
        label: 'Não',
        value: false,
      },
    ],
    additionalField: {
      label: 'Preço da entrada',
      type: 'input',
      name: 'entryAmount',
      fieldRequiredRule: {
        fieldName: 'isPaid',
        valueExpected: true,
      },
    },
  },
  {
    label: 'Aberto por tempo limitado ?',
    type: 'select',
    name: 'alwaysOpen',
    options: [
      {
        label: 'Sim',
        value: true,
      },
      {
        label: 'Não',
        value: false,
      },
    ],
    additionalField: {
      label: 'Horário de funcionamento',
      type: 'input',
      name: 'openingHours',
      fieldRequiredRule: {
        fieldName: 'alwaysOpen',
        valueExpected: true,
      },
    },
  },
  {
    label: 'Tem cobertura',
    type: 'select',
    name: 'hasCoverage',
    options: [
      {
        label: 'Sim',
        value: true,
      },
      {
        label: 'Não',
        value: false,
      },
    ],
  },
];

export const BasicData = () => {
  const { name, description, handleChange } = useBasicData();

  return (
    <div className="flex flex-col gap-2 mt-9">
      <ControlledInput
        label="Nome"
        name="name"
        placeholder="Digite aqui"
        id="name"
        value={name}
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <TextArea
        name="text"
        label="Descrição"
        placeholder="Conte um pouco sobre o local"
        className="resize-none not-dark:bg-white"
        value={description}
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <ImagePreview />

      <DinamicFields fields={fields} />
    </div>
  );
};
