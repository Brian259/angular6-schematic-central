import { ElectronicComponent } from './electronic-comp.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map, take, tap, switchMap } from 'rxjs/operators';

import { SchematicService } from '../schematics/schematic.service';
import { Schematic } from '../schematics/schematic.model';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, pipe } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

interface FireSchems {
  name: string;
  description: string;
  imgURL: string;
  electronicComponents: ElectronicComponent[];
}

@Injectable()
export class DataStorageService {
  schematicsCollection: AngularFirestoreCollection<FireSchems>;
  schematics$: Observable<Schematic[]>;
  

  constructor(
    private httpClient: HttpClient,
    private schematicService: SchematicService,
    private authService: AuthService,
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
            ));
          });
          this.startUpload(schem.imgFile, schem.id);
        }
        console.log(schem.imgFile);
    });
    if (this.schematicService.getSchemsToDelete()) {
      this.schematicService.getSchemsToDelete().forEach((schem: Schematic) => this.deleteStoreSchem(schem));
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
    let imgUploadTask: AngularFireUploadTask;
    const path = `images/${new Date().getTime()}_${file.name}`;
    // The main task
    imgUploadTask = this.fireStorage.upload(path, file);
    const snapshot = imgUploadTask.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          // Update firestore and local on completion
          this.fireStorage.ref(path).getDownloadURL().subscribe(url => {
            console.log(url);
            
            const _schemDoc: AngularFirestoreDocument<Schematic> = this.afs.doc('schematics/' + id);
            _schemDoc.update( {imgURL: url} );
          });
        }
      })
    )
  }

  deleteStoreSchem(schem: Schematic) { // Deletes a schematic, both Firestore data and Firebase Storage image
    this.deleteImg(schem.imgURL);
    const _schemDoc: AngularFirestoreDocument<Schematic> = this.afs.doc('schematics/' + schem.id);
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

