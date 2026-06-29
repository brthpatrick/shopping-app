import { useCallback, useEffect, useState } from "react";

const useFetch = (url: string) => {
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = (await fetch(url));
            const nextData = await response.json();
            setData(nextData);
        } catch (error) {
            setError(error as Error);
        }  finally {
            setIsLoading(false);
        }
    }, [url]);

    useEffect (() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export default useFetch;