"use client"
import { QueryClientProvider, QueryClient, keepPreviousData } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
export default function Provider({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>){
 const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24,
        placeholderData: keepPreviousData,
      },
    },
  });
    return(
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster/>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}