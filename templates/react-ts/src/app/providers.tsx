import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import type { PropsWithChildren } from "react";

type ProvidersProps = {} & PropsWithChildren;

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

export default Providers;
