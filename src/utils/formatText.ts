import type { OrderItem } from '../types/order';

export const formatGlassLabel = (
  item: Pick<OrderItem, 'type' | 'isTempered' | 'thickness'>
): string => {
  const temperPart = item.isTempered ? 'Temper. ' : '';
  return `${item.type.label} ${temperPart}${item.thickness}мм`;
};

export const formatSize = (
  item: Pick<OrderItem, 'sizeX' | 'sizeY'>
): string => {
  return `${item.sizeX} x ${item.sizeY}`;
};
