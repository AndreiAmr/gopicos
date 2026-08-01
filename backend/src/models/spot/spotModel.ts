import { JsonValue } from '@prisma/client/runtime/library';
import { Spot } from '../../prisma/generated';

type Props = Spot & {};

export class SpotModel implements Spot {
  id: string = '';
  name: string = '';
  description: string = '';
  authorId: string = '';
  modality: string = '';
  equipmentRequired: boolean = false;
  isPaid: boolean = false;
  alwaysOpen: boolean = false;
  entryAmount: string | null = null;
  hasCoverage: boolean = false;
  coordinates: JsonValue = [];
  images: string[] = [];
  markingType: string = '';
  openingHours: string | null = null;
  createdAt: Date = new Date();

  constructor(props: Props) {
    Object.assign(this, props);
  }
}
