import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://127.0.0.1:3005/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/lib/api/generated',
      schemas: './src/lib/api/models',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          path: './src/api/mutator/axiosInstance.ts',
          name: 'api',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'cursor',
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
});