import axios from "axios";
import { AdapterFunction } from ".";

const axiosAdapter: AdapterFunction = ({ url, method, data, headers }) => {
  return axios
    .request({
      url,
      method,
      data,
      headers,
    })
    .then(({ data, headers, status }) => ({
      data,
      headers,
      status,
    }));
};

export default axiosAdapter;
