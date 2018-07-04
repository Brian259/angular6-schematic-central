import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropZoneDirective } from './DropZone.directive';

@NgModule({
   declarations: [
       DropZoneDirective
   ],
   exports: [
      CommonModule,
      DropZoneDirective
   ]
})
export class SharedModule {}
