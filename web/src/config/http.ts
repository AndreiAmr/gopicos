import axios from 'axios';

import { API_URL } from './env';

const http = axios.create({
  baseURL: API_URL,
});

export default http;
