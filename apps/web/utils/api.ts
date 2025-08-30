export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const url = `${getBaseUrl()}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  return res.json();
};
