import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { navigate } from '@/routes/navigation';
import { URL } from '@/routes/url';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((config) => {
  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use((response) => {
  if (response.data.errors) {
    const isUnauthorized = response.data.errors.some(
      (err: GraphQLError) =>
        err.extensions?.statusCode === 401 ||
        err.extensions?.code === 'UNAUTHENTICATED',
    );

    if (isUnauthorized) {
      navigate(URL.LOGIN, { replace: true });
    }
  }

  return response.data;
});

export default http;
