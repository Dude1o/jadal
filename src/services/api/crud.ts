// lib/api/crud.ts
import { http } from "./http";

export type CrudApi<T, Create = Partial<T>, Update = Partial<T>> = {
  getAll: () => Promise<T[]>;
  getById: (id: number | string) => Promise<T>;
  create: (payload: Create) => Promise<T>;
  update: (id: number | string, payload: Update) => Promise<T>;
  delete: (id: number | string) => Promise<void>;
};

export const createCrudApi = <T, Create = Partial<T>, Update = Partial<T>>(
  baseUrl: string,
): CrudApi<T, Create, Update> => ({
  getAll: async () => {
    const { data } = await http.get(baseUrl);
    return data;
  },

  getById: async (id) => {
    const { data } = await http.get(`${baseUrl}/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await http.post(baseUrl, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await http.put(`${baseUrl}/${id}`, payload);
    debugger;

    return data;
  },

  delete: async (id) => {
    await http.delete(`${baseUrl}/${id}`);
  },
});
