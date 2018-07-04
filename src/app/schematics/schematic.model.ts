import { ElectronicComponent } from '../shared/electronic-comp.model';

export class Schematic {
  public id: string;
  public name: string;
  public description: string;
  public imgURL: string;
  public electronicComponents: ElectronicComponent[];
  public imgFile: File;


  constructor(name: string, desc: string, imgURL: string, schematics: ElectronicComponent[], id: string = null, imgFile: File = null) {
    this.name = name;
    this.description = desc;
    this.imgURL = imgURL;
    this.electronicComponents = schematics;
    this.id = id;
    this.imgFile = imgFile;
  }
}
