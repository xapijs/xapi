import { Adapter, AdapterFunction, axiosAdapter, fetchAdapter } from ".";

const resolveAdapterFunction = (adapter?: Adapter): AdapterFunction => {
  if (typeof adapter === "function") {
    return adapter;
  } else {
    switch (adapter) {
      case "fetch": {
        return fetchAdapter;
      }
      case "axios":
      default: {
        return axiosAdapter;
      }
    }
  }
};

export default resolveAdapterFunction;
