import { demoRequest } from '@/shared/api/demo';
import { Charity } from '../model/types';
import { charities } from './charities.data';

export const fetchCharities = (): Promise<Charity[]> => demoRequest(() => charities, []);
