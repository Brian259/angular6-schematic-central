import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Schematic } from '../schematic.model';
import { SchematicService } from '../schematic.service';

@Component({
  selector: 'app-schematic-list',
  templateUrl: './schematic-list.component.html',
  styleUrls: ['./schematic-list.component.css']
})
export class SchematicListComponent implements OnInit, OnDestroy {
  schematics: Schematic[];
  subscription: Subscription;
  filteredSchematics = '';

  constructor(private schematicService: SchematicService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription = this.schematicService.schematicsChanged
      .subscribe(
        (schematics: Schematic[]) => {
          this.schematics = schematics;
        }
      );
      if (this.schematicService.getSchematics()) {
        this.schematics = this.schematicService.getSchematics();
      }
  }

  onNewSchematic() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
