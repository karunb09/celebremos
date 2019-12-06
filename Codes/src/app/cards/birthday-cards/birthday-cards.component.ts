import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-birthday-cards',
  templateUrl: './birthday-cards.component.html',
  styleUrls: ['./birthday-cards.component.css']
})
export class BirthdayCardsComponent implements OnInit {
  image = 'http://localhost:3000/images/suresh-gadi-pelli-1574224031587.jpg';
  imagePath = 'suresh-gadi-pelli-1574224031587';
  constructor() {}

  ngOnInit() {}
}
