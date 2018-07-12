import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Schematic } from '../schematic.model';
import { SchematicService } from '../schematic.service';

@Component({
  selector: 'app-schematic-detail',
  templateUrl: './schematic-detail.component.html',
  styleUrls: ['./schematic-detail.component.css']
})
export class SchematicDetailComponent implements OnInit {
  schematic: Schematic;
  id: number;
  imgURL;

  constructor(
    private schematicService: SchematicService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { schematic: Schematic }) => { // Retrive data from resolver and set image
      this.schematic = data.schematic;
      if (this.schematic.imgFile) {
        const reader = new FileReader();
        let src: string;
        reader.onloadend = () => {
          src = reader.result;
          this.imgURL = src;
        };
        reader.readAsDataURL(this.schematic.imgFile);
      } else {
        this.imgURL = this.schematic.imgURL;
      }
      }
    );
  }

  onAddToSL() { // Add electronic coimponents to shopping list
    this.schematicService.addElectronicCompsToShoppingList(this.schematic.electronicComponents);
  }

  onEditSchematic() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteSchematic() {
    this.schematicService.deleteSchematic(this.id);
    this.router.navigate(['/schematics']);
  }

}
