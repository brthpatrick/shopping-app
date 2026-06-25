import { useEffect, useState } from "react";

const useFetch = (url: string) => {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>();

    const fetchData = async () => {
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
    };

    useEffect (
        ()=>{
        fetchData();
    }, []);

    return { data, isLoading, error };
};

export default useFetch;