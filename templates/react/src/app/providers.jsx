import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";

const Providers = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

export default Providers;
