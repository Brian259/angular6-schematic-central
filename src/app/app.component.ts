import { DataStorageService } from './shared/data-storage.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private dataStorageServ: DataStorageService
  ) {}

  ngOnInit() {
    this.dataStorageServ.startFirestore();
    this.dataStorageServ.getSchematics();
  }
}
