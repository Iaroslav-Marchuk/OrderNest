export interface GlassType {
  _id: string;
  label: string;
  category: {
    _id: string;
    label: string;
  };
  thickness: string[];
  temper: 'required' | 'forbidden' | 'optional';
  createdAt: string;
  updatedAt: string;
}

export interface GlassTypeResponse {
  glassTypes: GlassType[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetGlassTypesParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: string;
  label?: string;
}

export interface AddNewGlassTypeReq {
  label: string;
  category: string;
  thickness: string[];
  temper: 'required' | 'forbidden' | 'optional';
}

export interface PatchGlassTypeReq {
  glassTypeId: string;
  updateData: {
    label?: string;
    category?: string;
    thickness?: string[];
    temper?: 'required' | 'forbidden' | 'optional';
  };
}
