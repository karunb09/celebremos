import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wedding-cards',
  templateUrl: './wedding-cards.component.html',
  styleUrls: ['./wedding-cards.component.css']
})
export class WeddingCardsComponent implements OnInit {

  image = 'http://localhost:3000/images/suri-babu-1573621250691.jpg';
  imagePath = 'suri-babu-1573621250691';
  constructor() { }

  ngOnInit() {
  }

}
