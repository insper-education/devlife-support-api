import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export const useGetRequest = <T>(
  url: string,
  initialValue: T,
  token?: string,
  skip?: boolean,
) => {
  const [data, setData] = useState<T>(initialValue);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshRequested, setRefreshRequested] = useState(false);

  const refresh = useCallback(() => {
    setRefreshRequested(true);
  }, [setRefreshRequested]);
  useEffect(() => {
    let mounted = true;
    const handleRequest = () => {
      const params: any = {};
      if (!!token) params["headers"] = { Authorization: `Token ${token}` };

      setLoading(true);
      setError(undefined);
      axios
        .get(url, params)
        .then((res) => res.data)
        .then((data) => mounted && setData(data))
        .catch((reason) => mounted && setError(reason))
        .finally(() => mounted && setLoading(false));
    };

    if (!skip || refreshRequested) {
      if (refreshRequested) setRefreshRequested(false);
      handleRequest();
    }
    return () => {
      mounted = false;
    };
  }, [url, token, skip, refreshRequested]);

  return { data, error, loading, refresh };
};
