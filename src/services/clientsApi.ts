import type { Client, PatchClientReq } from '../types/client';
import { axiosInstance } from './axiosInstance';

export const getAllClientsApi = async (): Promise<Client[]> => {
  const { data } = await axiosInstance.get<{
    message: string;
    data: { allClients: Client[] };
  }>('/clients');

  return data.data.allClients;
};

export const addNewClientApi = async (name: string): Promise<Client> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: { client: Client };
  }>('/clients', { name });

  return data.data.client;
};

export const patchClientApi = async ({
  clientId,
  updateData,
}: PatchClientReq): Promise<Client> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedClient: Client };
  }>(`/clients/${clientId}`, updateData);

  return data.data.updatedClient;
};

export const deleteClientApi = async (clientId: string): Promise<void> => {
  await axiosInstance.delete(`/clients/${clientId}`);
};
