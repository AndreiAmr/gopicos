import axios from 'axios';
import { GenericAxiosError } from './genericErrorsTypes';
import Cookies from 'js-cookie';
// import { redirect, RedirectType } from 'next/navigation';
// import { UNAUTHORIZED_MODAL_EVENT } from '@/hooks/useAuthenticationListener';

type GraphQLError = {
  message: string;
  path?: string[];
  extensions?: {
    code?: string;
    [key: string]: any;
  };
};

const http = axios.create({
  baseURL: 'http://localhost:4000/graphql',
});

http.interceptors.response.use(async (event) => {
  event.data?.errors?.forEach((error: GraphQLError) => {
    if (
      [GenericAxiosError.UNAUTHORIZED].includes(
        error.message as GenericAxiosError
      )
    ) {
      // window.dispatchEvent(new Event(UNAUTHORIZED_MODAL_EVENT));
    }
  });

  return event;
});

http.interceptors.request.use(async (e) => {
  if (typeof window !== 'undefined') {
    const tokenStored = Cookies.get('token');
    console.log('🚀 ~ tokenStored:', tokenStored);

    if (tokenStored) {
      // console.log('🚀 ~ tokenStored.value:', tokenStored.value);
      const tokenJSON = await JSON.parse(tokenStored);
      // console.log('🚀 ~ tokenJSON:', tokenJSON);

      // console.log('🚀 ~ tokenStored:', tokenStored?.value);
      e.headers.Authorization = tokenJSON.token;
    }
  }
  return e;
});
export { http };
