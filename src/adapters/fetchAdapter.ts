import { AdapterFunction } from ".";

const fetchAdapter: AdapterFunction = ({ url, method, data, headers }) => {
  return fetch(url, {
    method,
    body: data,
    headers,
  }).then(({ headers, status, json }) => {
    return json().then((data) => ({
      data,
      headers,
      status,
    }));
  });
};

export default fetchAdapter;
