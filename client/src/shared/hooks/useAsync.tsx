import { useState } from "react";

function useAsync<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<T>): Promise<T> {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        throw error;
      }

      const unknownError = new Error("Something went wrong");
      setError(unknownError.message);
      throw unknownError;
    } finally {
      setLoading(false);
    }
  }
  return { run, loading, error };
}

export default useAsync;
