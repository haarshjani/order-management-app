import axios, { AxiosError, AxiosResponse } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response, // pass through successful responses
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
      });

  
      return Promise.reject(
       {
          status: error.response.status,
          data: error.response.data,
        }
      );
    } else if (error.request) {
      console.error('No response received from API', error.request);
      return Promise.reject(new Error('No response from server. Please try again.'));
    } else {
      console.error('Axios request setup error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);
