import { Injectable } from '@angular/core';

import { Schematic } from './schematic.model';
import { ElectronicComponent } from '../shared/electronic-comp.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SchematicService {
  private schematics: Schematic[] = null;
  schematicsChanged = new BehaviorSubject<Schematic[]>(this.schematics);
  SchemsToDelete: Schematic[];
  imgsToDelete: string[];

  constructor(
    private slService: ShoppingListService
  ) { }

  setSchematics(schematics: Schematic[]) {
    this.schematics = schematics;
    this.schematicsChanged.next(this.schematics.slice());
  }

  getSchematics() {
    if (this.schematics === null) {
      return null;
    } else {
      return this.schematics.slice();
    }
  }

  getSchematic$(index: number) { // Returns an Observable of the schematics used for the schematic-resolver
    return this.schematicsChanged.pipe(
      map(schems => {
        try {
          return schems[index];
        } catch {
          return null;
        }
      })
    );
  }

  getSchematic(index: number) {
    if (this.schematics === null) {
      return null;
    } else {
      return this.schematics[index];
    }
  }

  addElectronicCompsToShoppingList(elecComps: ElectronicComponent[]) {
    this.slService.addElectronicComponents(elecComps);
  }

  addSchematic(schematic: Schematic) {
    this.schematics.push(schematic);
    this.schematicsChanged.next(this.schematics.slice());
  }

  updateSchematic(index: number, newSchematic: Schematic) {
    this.schematics[index] = newSchematic;
    this.schematicsChanged.next(this.schematics.slice());
  }

  addImgToDelete(index: number) {
    this.imgsToDelete.push(this.schematics[index].imgURL);
  }

  deleteSchematic(index: number) {
    const imgUrlToDel = this.getSchematic(index).imgURL;
    if (imgUrlToDel) {
      this.SchemsToDelete.push(this.schematics[index]);
    }
    this.schematics.splice(index, 1);
    this.schematicsChanged.next(this.schematics.slice());
  }

  getSchemsToDelete() {
    return this.SchemsToDelete;
  }

  getImgsToDelete() {
    return this.imgsToDelete;
  }
}
