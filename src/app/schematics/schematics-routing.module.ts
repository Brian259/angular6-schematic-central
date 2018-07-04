import { SchematicDetailResolver } from './schematic-detail-resolver.service';
import { SchematicGuard } from './schematic-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard.service';
import { SchematicEditComponent } from './schematic-edit/schematic-edit.component';
import { SchematicDetailComponent } from './schematic-detail/schematic-detail.component';
import { SchematicStartComponent } from './schematic-start/schematic-start.component';
import { SchematicsComponent } from './schematics.component';

const schematicsRoutes: Routes = [
  { path: '', component: SchematicsComponent, children: [
    { path: '', component: SchematicStartComponent },
    { path: 'new', component: SchematicEditComponent, canActivate: [AuthGuard] },
    { path: ':id', component: SchematicDetailComponent,  resolve: { schematic: SchematicDetailResolver} },
    { path: ':id/edit', component: SchematicEditComponent, canActivate: [AuthGuard] },
  ] },
];

@NgModule({
  imports: [
    RouterModule.forChild(schematicsRoutes)
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    SchematicDetailResolver
  ]
})
export class SchematicsRoutingModule {}
