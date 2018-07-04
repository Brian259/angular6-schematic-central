import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Schematic } from './schematic.model';
import { SchematicService } from './schematic.service';

@Injectable()
// Resolver to manage accessing to the schematics detail if the schematics haven't been loaded yet
export class SchematicDetailResolver implements Resolve<Schematic> {
    constructor(private schemService: SchematicService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Schematic> {
        let id = route.paramMap.get('id');
        console.log('llegamos al resolver');
        return this.schemService.getSchematic$(+id)
        .pipe(
            take(1),
            map((schem: Schematic) => {
                if (schem) {
                    return schem;
                } else { // id not found
                    this.router.navigateByUrl('/schematics');
                    return null;
                }
            })
        );
    }
}
