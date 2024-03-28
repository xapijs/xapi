import axiosAdapter from "../src/adapters/axiosAdapter";

jest.mock("../src/adapters/axiosAdapter");

global.adapterFn = axiosAdapter;
