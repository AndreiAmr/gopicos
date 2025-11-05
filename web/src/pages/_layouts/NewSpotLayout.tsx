import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Outlet } from 'react-router';
import * as yup from 'yup';

export type ICoordinates = number[][][] | number[];

export interface ICreateSpot {
  coordinates: ICoordinates;
  name: string;
  description: string;
  road: string;
  suburb: string;
  number: string;
  complement: string;
  reference: string;
  modality: string;
  equipamentRequired: boolean;
  isPaid: boolean;
  entryAmount: string;
  alwaysOpen: boolean;
  openingHours: string;
  hasCoverage: boolean;
  openingTime: string;
  closingTime: string;
  quarter: string;
  images: File[];
  currentStep: number;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Mínimo 3 caracteres'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(20, 'Mínimo 20 caracteres'),
  road: yup.string().required('Rua é obrigatória'),
  suburb: yup.string().required('Bairro é obrigatório'),
  quarter: yup.string(),
  number: yup.string(),
  complement: yup.string(),
  reference: yup.string().min(20, 'Mínimo 20 caracteres'),
  modality: yup.string().required('Modalidade é obrigatória'),
  equipamentRequired: yup.boolean(),
  hasCoverage: yup.boolean(),
  alwaysOpen: yup.boolean(),
  openingTime: yup.string().when('alwaysOpen', {
    is: false,
    then: (schema) => schema.required('Horário de abertura é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
  closingTime: yup.string().when('alwaysOpen', {
    is: false,
    then: (schema) => schema.required('Horário de fechamento é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
  isPaid: yup.boolean(),
  entryAmount: yup.string().when('isPaid', {
    is: true,
    then: (schema) => schema.required('Valor de entrada obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
  coordinates: yup.array().required('Coordenadas são obrigatórias'),
  images: yup
    .array()
    .min(2, 'Mínimo 2 imagens obrigatório')
    .required('Imagens são obrigatórias'),
});

const defaultValues: ICreateSpot = {
  name: '',
  description: '',
  road: '',
  suburb: '',
  quarter: '',
  number: '',
  complement: '',
  reference: '',
  modality: '',
  equipamentRequired: false,
  hasCoverage: false,
  alwaysOpen: true,
  openingTime: '',
  closingTime: '',
  isPaid: false,
  entryAmount: '',
  images: [],
  coordinates: [],
  openingHours: '',
  currentStep: 0,
};

const NewSpotLayout = () => {
  const formMethods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
  });

  return (
    <FormProvider {...formMethods}>
      <Outlet />
    </FormProvider>
  );
};

export default NewSpotLayout;
