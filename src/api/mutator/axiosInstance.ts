import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from "@/hooks/use-toast";

export const showErrorToast = (message: string) => {
  // Use the toast hook to display the error message
  // const { toast } = useToast();
  toast({
    title: "Error",
    description: message,
    variant: "destructive", // Assuming your toast component supports a "destructive" variant
  });
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Include credentials (cookies) in requests
});

// Request interceptor (no need to manually set the token)
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add other request modifications here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

interface ApiErrorResponse {
  detail?: string;
  // Add other fields if your API returns more details
}

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle error and display toast notification
    // console.log(error)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.detail || 'An error occurred';
      // showErrorToast(errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      showErrorToast('We couldn\'t connect to the server. Please check your internet connection or try again shortly');
    } else {
      // Something happened in setting up the request that triggered an Error
      showErrorToast('Something went wrong while preparing your request. Please refresh the page or try again');
    }

    return Promise.reject(error);
  }
);


// This is the function that Orval expects
export const api = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};