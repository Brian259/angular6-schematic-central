import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: string[] = [
    'assets/1.jpg',
    'assets/4.png',
    'assets/3.jpg'
  ];

  constructor() { }

  ngOnInit() {
  }

}
