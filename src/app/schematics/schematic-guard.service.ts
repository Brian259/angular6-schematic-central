import { SchematicService } from './schematic.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class SchematicGuard implements CanActivate {

    constructor(
        private schemService: SchematicService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.schemService.getSchematics() !== null) {
            return true;
        } else {
            this.router.navigateByUrl('/schematics');
        }
        return false;
    }
}
