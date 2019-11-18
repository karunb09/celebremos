import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCardsComponent } from './party-cards.component';

describe('PartyCardsComponent', () => {
  let component: PartyCardsComponent;
  let fixture: ComponentFixture<PartyCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
