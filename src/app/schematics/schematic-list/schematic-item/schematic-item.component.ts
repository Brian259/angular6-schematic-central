import { Observable } from 'rxjs/Observable';
import { DataStorageService } from './../../../shared/data-storage.service';
import { Component, OnInit, Input } from '@angular/core';

import { Schematic } from '../../schematic.model';


@Component({
  selector: 'app-schematic-item',
  templateUrl: './schematic-item.component.html',
  styleUrls: ['./schematic-item.component.css']
})
export class SchematicItemComponent implements OnInit {
  @Input() schematic: Schematic;
  @Input() index: number;
  imgURL;

  constructor(
    private storage: DataStorageService
  ) {}
  ngOnInit() {
    this.imgURL = this.schematic.imgFile ? this.schematic.imgFile : this.schematic.imgURL;
    if (this.schematic.imgFile) {
      
    } else {

    }
  }
  
}
