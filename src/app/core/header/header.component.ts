import { Component } from '@angular/core';
// import { HttpEvent, HttpEventType } from '@angular/common/http';

import { DataStorageService } from '../../shared/data-storage.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) { }

  onSaveData() {
    this.dataStorageService.storeSchematics();
  }

  onFetchData() {
    this.dataStorageService.getSchematics();
  }

  onLogout() {
    this.authService.logout();
  }
}
