import axios from "./axios";

const wrap = async (promise) => {
  const response = await promise;
  return response.data;
};

export const api = {
  get: (url, config) => wrap(axios.get(url, config)),
  post: (url, data, config) => wrap(axios.post(url, data, config)),
  put: (url, data, config) => wrap(axios.put(url, data, config)),
  patch: (url, data, config) => wrap(axios.patch(url, data, config)),
  delete: (url, config) => wrap(axios.delete(url, config)),
};
