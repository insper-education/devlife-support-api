import axios from "axios";
import { useEffect, useState } from "react";

export const useGetRequest = <T>(
  url: string,
  initialValue: T,
  token?: string,
  skip?: boolean,
) => {
  const [data, setData] = useState<T>(initialValue);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const handleRequest = () => {
    const params: any = {};
    if (!!token) params["headers"] = { Authorization: `Token ${token}` };

    setLoading(true);
    setError(undefined);
    axios
      .get(url, params)
      .then((res) => res.data)
      .then(setData)
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!skip) handleRequest();
  }, [url, token, skip]);

  return { data, error, loading, refresh: handleRequest };
};
