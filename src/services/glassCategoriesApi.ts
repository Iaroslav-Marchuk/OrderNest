import type {
  GetGlassCategoriesParams,
  GlassCategory,
  GlassCategoryResponse,
  PatchGlassCategoryReq,
} from '../types/glassCategory';
import { axiosInstance } from './axiosInstance';

export const getGlassCategoriesApi = async (
  params: GetGlassCategoriesParams
): Promise<GlassCategoryResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== undefined && v !== null
    )
  );
  const { data } = await axiosInstance.get<{
    message: string;
    data: GlassCategoryResponse;
  }>('/glassCategories', { params: cleanParams });

  return data.data;
};

export const getAllGlassCategoriesApi = async (): Promise<GlassCategory[]> => {
  const { data } = await axiosInstance.get<{
    message: string;
    data: GlassCategory[];
  }>('/glassCategories/all');
  return data.data;
};

export const addNewGlassCategoryApi = async (payload: {
  label: string;
  isLaminated: boolean;
}): Promise<GlassCategory> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: { glassCategory: GlassCategory };
  }>('/glassCategories', payload);

  return data.data.glassCategory;
};

export const patchGlassCategoryApi = async ({
  glassCategoryId,
  updateData,
}: PatchGlassCategoryReq): Promise<GlassCategory> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedGlassCategory: GlassCategory };
  }>(`/glassCategories/${glassCategoryId}`, updateData);

  return data.data.updatedGlassCategory;
};

export const deleteGlassCategoryApi = async (
  glassCategoryId: string
): Promise<void> => {
  await axiosInstance.delete(`/glassCategories/${glassCategoryId}`);
};
