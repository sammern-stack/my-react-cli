import { QueryClient } from "@tanstack/react-query";
import { queryClientConfig } from "../config/queryClient.config";

const queryClient = new QueryClient(queryClientConfig);

export default queryClient;
