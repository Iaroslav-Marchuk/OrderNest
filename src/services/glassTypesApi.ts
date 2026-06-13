import type {
  AddNewGlassTypeReq,
  GetGlassTypesParams,
  GlassType,
  GlassTypeResponse,
  PatchGlassTypeReq,
} from '../types/glassType';
import { axiosInstance } from './axiosInstance';

export const getAllGlassTypesApi = async (
  params: GetGlassTypesParams
): Promise<GlassTypeResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== undefined && v !== null
    )
  );
  const { data } = await axiosInstance.get<{
    message: string;
    data: GlassTypeResponse;
  }>('/glassTypes', { params: cleanParams });

  return data.data;
};

export const addNewGlassTypeApi = async (
  glassTypeData: AddNewGlassTypeReq
): Promise<GlassType> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: { glassType: GlassType };
  }>('/glassTypes', glassTypeData);

  return data.data.glassType;
};

export const patchGlassTypeApi = async ({
  glassTypeId,
  updateData,
}: PatchGlassTypeReq): Promise<GlassType> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedGlassType: GlassType };
  }>(`/glassTypes/${glassTypeId}`, updateData);

  return data.data.updatedGlassType;
};

export const deleteGlassTypeApi = async (
  glassTypeId: string
): Promise<void> => {
  await axiosInstance.delete(`/glassTypes/${glassTypeId}`);
};
