import { useQuery } from "@tanstack/react-query";

type useFetchParams = {
  endpoint: string;
  options?: RequestInit;
};

function useFetch<T>({ endpoint, options }: useFetchParams) {
  const queryFn = async (): Promise<T> => {
    try {
      const res = await fetch(endpoint, options);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const jsonData = await res.json();
      return jsonData;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An error has occurred"
      );
    }
  };

  return useQuery({
    queryKey: [endpoint],
    queryFn,
    retry: false,
  });
}

export default useFetch;
