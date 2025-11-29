import axios from 'axios';
import { useEffect } from 'react';

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // your backend URL
  });

  // You can add interceptors here for JWT when ready:
  useEffect(() => {
    // Request interceptor to add auth token if available
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // Example: Add token here when you have it
        // const token = localStorage.getItem('access-token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (optional)
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle global errors here
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
