import { SchematicService } from './schematic.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.css']
})
export class SchematicsComponent implements OnInit {

  constructor(private schemsService: SchematicService) { }

  ngOnInit() {
  }

  get schems() {
    return this.schemsService.getSchematics();
  }

}
