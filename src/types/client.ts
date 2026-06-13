export interface Client {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientResponse {
  clients: Client[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetClientsParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: string;
  name?: string;
}

export interface PatchClientReq {
  clientId: string;
  updateData: { name: string };
}
