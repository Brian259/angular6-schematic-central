import { ElectronicComponent } from '../shared/electronic-comp.model';
import { Subject } from 'rxjs/Subject';

export class ShoppingListService {
  elecCompsChanged = new Subject<ElectronicComponent[]>();
  startedEditing = new Subject<number>();

  private _electronicComponents: ElectronicComponent[] = [
    new ElectronicComponent('100 uf Capacitor', 5),
    new ElectronicComponent('Arduino Leonardo', 2),
  ];

  getElectronicComponents() {
    return this._electronicComponents.slice();
  }

  getElectronicComponent(index: number) {
    return this._electronicComponents[index];
  }

  addElectronicComponent(elecComp: ElectronicComponent) {
    this._electronicComponents.push(elecComp);
    this.elecCompsChanged.next(this._electronicComponents.slice());
  }

  addElectronicComponents(elecComps: ElectronicComponent[]) {
    this._electronicComponents.push(...elecComps);
    this.elecCompsChanged.next(this._electronicComponents.slice());
  }

  updateElectronicComponent(index: number, newElecComp: ElectronicComponent) {
    this._electronicComponents[index] = newElecComp;
    this.elecCompsChanged.next(this._electronicComponents.slice());
  }

  deleteElectronicComponent(index: number) {
    this._electronicComponents.splice(index, 1);
    this.elecCompsChanged.next(this._electronicComponents.slice());
  }
}
