type ILocationMarkingTypeModel = {
  name: string;
  id: number;
};

export class LocationMarkingTypeModel implements ILocationMarkingTypeModel {
  name;
  id;

  constructor({ id, name }: ILocationMarkingTypeModel) {
    this.name = name;
    this.id = id;
  }
}
