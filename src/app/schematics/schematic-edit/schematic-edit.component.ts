import { Schematic } from './../schematic.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { SchematicService } from '../schematic.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-schematic-edit',
  templateUrl: './schematic-edit.component.html',
  styleUrls: ['./schematic-edit.component.css']
})
export class SchematicEditComponent implements OnInit, OnDestroy {
  editMode     = false;
  imgLoaded    = false;
  isHovering   = false;
  imgSelected  = new Subject<string>();
  id:            number;
  schematicForm: FormGroup;
  subscription:  Subscription;
  imgShown:      Observable<string>;
  imgFile:       File;

  constructor(private route: ActivatedRoute,
    private schematicService: SchematicService,
    private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
    this.subscription = this.imgSelected.subscribe((file) => { this.imgLoaded = true; });
    this.imgShown = this.imgSelected.pipe(
      map((imgUrl: string) => {

        console.log('2: ' + imgUrl);

        return imgUrl;
      }));
  }

  toggleHover(event: boolean) { // Used for dropzone
    this.isHovering = event;
  }

  onImageDrop(event: File) { // Sets image preview and temporaly stores img in variable
    this.imgFile = event;
    if (this.imgFile.type.split('/')[0] !== 'image') {
      console.error('This is not an image!');
      return;
    }
    this.schematicForm.patchValue({ imgFile: this.imgFile });
    const reader = new FileReader();
    let src: string;
    reader.onloadend = (event2: any) => {
      src = reader.result;
      this.imgSelected.next(src);
    };
    reader.readAsDataURL(this.imgFile);
  }

  onSubmit() { // Creates or updates Schematic based in editMode's  value
    if (this.editMode) {
      const newSchematic = new Schematic(
        this.schematicForm.value['name'],
        this.schematicForm.value['description'],
        this.schematicService.getSchematic(this.id).imgURL,
        this.schematicForm.value['elecComps'],
        this.schematicService.getSchematic(this.id).id,
        this.imgFile
      );
      this.schematicService.updateSchematic(this.id, newSchematic);
    } else {
      const newSchematic = new Schematic(
        this.schematicForm.value['name'],
        this.schematicForm.value['description'],
        null,
        this.schematicForm.value['elecComps'],
        null,
        this.imgFile
      );
      console.log(newSchematic.imgFile);
      this.schematicService.addSchematic(newSchematic);
    }
    this.onCancel();
  }

  onAddElectronicComponent() { // Adding electronic components to the FormArray
    (<FormArray>this.schematicForm.get('elecComps')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteElectronicComponent(index: number) {
    (<FormArray>this.schematicForm.get('elecComps')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() { // Form initialization
    let _schematicName = '';
    let _schematicImagePath = '';
    let _schematicDescription = '';
    let _schematicElecComps = new FormArray([]);
    let _schematicImgFile: File = null;

    if (this.editMode) {
      const schematic = this.schematicService.getSchematic(this.id);
      _schematicName = schematic.name;
      _schematicImagePath = schematic.imgURL;
      _schematicDescription = schematic.description;
      _schematicImgFile = schematic.imgFile;
      if (schematic['electronicComponents']) {
        for (let elecComp of schematic.electronicComponents) {
          _schematicElecComps.push(
            new FormGroup({
              'name': new FormControl(elecComp.name, Validators.required),
              'amount': new FormControl(elecComp.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }
    this.schematicForm = new FormGroup({
      'name': new FormControl(_schematicName, Validators.required),
      'description': new FormControl(_schematicDescription, Validators.required),
      'imgFile': new FormControl(_schematicImgFile, Validators.required),
      'elecComps': _schematicElecComps
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
