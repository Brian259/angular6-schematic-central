import { ElectronicComponent } from './electronic-comp.model';
import { Injectable } from '@angular/core';
import { map, take, finalize } from 'rxjs/operators';

import { SchematicService } from '../schematics/schematic.service';
import { Schematic } from '../schematics/schematic.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

interface FireSchem {
  name: string;
  description: string;
  imgURL: string;
  electronicComponents: ElectronicComponent[];
}

@Injectable()
export class DataStorageService {
  schematicsCollection: AngularFirestoreCollection<FireSchem>;
  schematics$: Observable<Schematic[]>;
  

  constructor(
    private schematicService: SchematicService,
    private afs: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) { }

  startFirestore() {
    this.schematicsCollection = this.afs.collection('schematics', ref => {
      return ref.orderBy('name');
    });
    this.schematics$ = this.schematicsCollection.snapshotChanges()
      .pipe(
        map( // Extracts the id of the Firestore doc with the rest of the Schematic data
          changes => {
            return changes.map(a => {
              const data = a.payload.doc.data() as Schematic;
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          }
        )
      );
  }

  storeSchematics() { // Saves changes to Firestore and Firebase Storage
    this.schematicService.getSchematics().forEach((schem: Schematic, key: number) => {
      if (schem.id) {
        const _schemDoc: AngularFirestoreDocument<Schematic> = this.afs.doc('schematics/' + schem.id);
        this.fireStorage.ref('images/' + this.getFireLocation(schem.imgURL));
        _schemDoc.update({ name: schem.name, description: schem.description, imgURL: schem.imgURL, electronicComponents: schem.electronicComponents });
        if (schem.imgFile){
          this.startUpload(schem.imgFile, schem.id);
        }
      } else {
        this.schematicsCollection.add(
          {
            name: schem.name,
            description: schem.description,
            imgURL: '',
            electronicComponents: schem.electronicComponents
          })
          .then(docRef => { // Here I update the local schematic with the image URL
            this.schematicService.updateSchematic(key, new Schematic(
              schem.name,
              schem.description,
              '',
              schem.electronicComponents,
              docRef.id,
              schem.imgFile
            ));
            this.startUpload(schem.imgFile, docRef.id);
          });
        }
    });
    if (this.schematicService.getSchemsToDelete()) {
      this.schematicService.getSchemsToDelete().forEach((schem: Schematic) => this.deleteStoreSchem(schem));
    }
    if (this.schematicService.getImgsToDelete()) {
      this.schematicService.getImgsToDelete().forEach((img: string) => {
        this.deleteImg(img);
      });
    }
  }

  getSchematics() { // Sets local Schematics Array
    this.schematics$
      .pipe(
        take(1)
      ).subscribe(
        (schematics: Schematic[]) => {
          this.schematicService.setSchematics(schematics);
        }
      );
  }

  startUpload(file: File, id: string) { // Adds a new image to the storage
    const path = `images/${new Date().getTime()}_${file.name}`;
    const fileRef = this.fireStorage.ref(path);
    let imgUploadTask: AngularFireUploadTask;
    imgUploadTask = this.fireStorage.upload(path, file);
    imgUploadTask.snapshotChanges().pipe(
      finalize(() => {
        let url: string;
        fileRef.getDownloadURL().subscribe(
          (downloadUrl) => {
            const _schemDoc: AngularFirestoreDocument<FireSchem> = this.afs.doc('schematics/' + id);
            url = downloadUrl;
            console.log(url);
            _schemDoc.update( {imgURL: url} );
          }
        );
      })
    ).subscribe();
  }

  deleteStoreSchem(schem: Schematic) { // Deletes a schematic, both Firestore data and Firebase Storage image
    this.deleteImg(schem.imgURL);
    const _schemDoc: AngularFirestoreDocument<FireSchem> = this.afs.doc('schematics/' + schem.id);
    _schemDoc.delete();
  }

  deleteImg(imgURL: string) { // Deletes a single image from storage
    const imgFireLocation = this.getFireLocation(imgURL);
    this.fireStorage.ref('images/' + imgFireLocation).delete();
  }

  getFireLocation(url: string) { // Gets the location in Firebase Storage of an image from its URL
    let fireLocation = url.substr(url.indexOf('%2F') + 3, (url.indexOf('?')) - (url.indexOf('%2F') + 3));
    fireLocation = fireLocation.replace('%20', ' ');
    return fireLocation;
  }
}

