export interface GlassCategory {
  _id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface GlassCategoryResponse {
  glassCategories: GlassCategory[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetGlassCategoriesParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: string;
  label?: string;
}

export interface PatchGlassCategoryReq {
  glassCategoryId: string;
  updateData: { label: string };
}
