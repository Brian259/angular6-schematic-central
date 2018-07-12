import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SchematicsRoutingModule } from './schematics-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SchematicsComponent } from './schematics.component';
import { SchematicStartComponent } from './schematic-start/schematic-start.component';
import { SchematicListComponent } from './schematic-list/schematic-list.component';
import { SchematicEditComponent } from './schematic-edit/schematic-edit.component';
import { SchematicDetailComponent } from './schematic-detail/schematic-detail.component';
import { SchematicItemComponent } from './schematic-list/schematic-item/schematic-item.component';
import { ImageDropzoneComponent } from './schematic-edit/image-dropzone/image-dropzone.component';
import { ShortenPipe } from '../shared/shorten.pipe';
import { FilterPipe } from '../shared/filter.pipe';

@NgModule({
  declarations: [
    SchematicsComponent,
    SchematicStartComponent,
    SchematicListComponent,
    SchematicEditComponent,
    SchematicDetailComponent,
    SchematicItemComponent,
    ImageDropzoneComponent,
    ShortenPipe,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SchematicsRoutingModule,
    SharedModule,
    NgbModule
  ]
})
export class SchematicsModule {}
