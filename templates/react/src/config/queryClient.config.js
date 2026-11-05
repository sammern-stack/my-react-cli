const STALE_TIME_MINS = 5;
const STALE_TIME_MILLISECONDS = STALE_TIME_MINS * 60 * 1000;

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: STALE_TIME_MILLISECONDS,
    },
  },
};
