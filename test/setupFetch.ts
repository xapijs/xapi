import fetchAdapter from "../src/adapters/fetchAdapter";

jest.mock("../src/adapters/fetchAdapter");

global.adapter = "fetch";
global.adapterFn = fetchAdapter;
