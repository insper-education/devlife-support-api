import axios from "axios";
import { useEffect, useState } from "react";

export const useGetRequest = <T>(
  url: string,
  initialValue: T,
  token?: string,
) => {
  const [data, setData] = useState<T>(initialValue);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [url, token]);

  return { data, error, loading };
};
