import { gql } from '@apollo/client';
import { http } from '../axios/axios';

export const createSpotMutation = gql`
  mutation CreateSpot($input: NewSpotInput!) {
    createSpot(input: $input) {
      name
    }
  }
`;

type ICreateSpotProps = {
  name: string;
  description: string;
  images: File[];
  alwaysOpen?: boolean;
  hasCoverage?: string;
  isPaid?: boolean;
  modality?: EModality;
};

export const fetchCreateSpot = async (props: ICreateSpotProps) => {
  const formData = new FormData();

  const operations = JSON.stringify({
    query: `
      mutation CreateSpot($input: NewSpotInput!) {
        createSpot(input: $input) {
          name
        }
      }
    `,
    variables: {
      input: props,
    },
  });

  formData.append('operations', operations);

  const map: Record<number, string[]> = {};

  props.images.forEach((_, index) => {
    map[index] = [`variables.input.images.${index}`];
  });

  formData.append('map', JSON.stringify(map));

  props.images.forEach((file, i) => {
    formData.append(`${i}`, file);
  });

  const res = await http.post('http://localhost:4000/graphql', formData, {
    headers: {
      'x-apollo-operation-name': 'createSpot',
    },
  });
};
