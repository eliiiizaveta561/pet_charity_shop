import { request } from '@/shared/api/http';
import { Charity } from '../model/types';

/** Организация в том виде, в каком её отдаёт backend. */
interface CharityResponse {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  need: string;
  latitude: number;
  longitude: number;
}

// Карта Leaflet и компоненты используют короткие lat и lng, переводим их здесь, в одном месте
const toCharity = ({ latitude, longitude, ...rest }: CharityResponse): Charity => ({
  ...rest,
  lat: latitude,
  lng: longitude,
});

export async function fetchCharities(): Promise<Charity[]> {
  const charities = await request<CharityResponse[]>('/charities');
  return charities.map(toCharity);
}
