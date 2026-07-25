const LOCATION_LABEL: Record<string, string> = {
  line_1: 'Line 1',
  line_2: 'Line 2',
  line_3: 'Line 3',
  hardening: 'Hardening',
  quality: 'Quality',
  logistics: 'Logistics',
};

export function formatLocation(location: string) {
  return LOCATION_LABEL[location] ?? location;
}
