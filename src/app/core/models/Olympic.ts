import { Participation } from './Participation';
export interface Olympic {
[x: string]: any;
  id: number;
  country: string;
  participations: Participation[];
}