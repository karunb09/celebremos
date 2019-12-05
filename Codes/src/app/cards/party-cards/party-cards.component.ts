import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-cards',
  templateUrl: './party-cards.component.html',
  styleUrls: ['./party-cards.component.css']
})
export class PartyCardsComponent implements OnInit {

  image = 'http://localhost:3000/images/suresh-gadi-pelli-1573692250206.jpg';
  imagePath = 'suresh-gadi-pelli-1573692250206';
  constructor() { }

  ngOnInit() {
  }

}
