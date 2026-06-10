export interface Client {
  _id: string;
  name: string;
  createdAt: string;
}

export interface PatchClientReq {
  clientId: string;
  updateData: { name: string };
}
