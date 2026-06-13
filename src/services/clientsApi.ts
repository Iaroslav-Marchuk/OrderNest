import type {
  Client,
  ClientResponse,
  GetClientsParams,
  PatchClientReq,
} from '../types/client';
import { axiosInstance } from './axiosInstance';

export const getAllClientsApi = async (
  params: GetClientsParams
): Promise<ClientResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== undefined && v !== null
    )
  );
  const { data } = await axiosInstance.get<{
    message: string;
    data: ClientResponse;
  }>('/clients', { params: cleanParams });

  return data.data;
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
