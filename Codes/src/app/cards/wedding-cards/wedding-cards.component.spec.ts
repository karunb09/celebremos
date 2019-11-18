import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingCardsComponent } from './wedding-cards.component';

describe('WeddingCardsComponent', () => {
  let component: WeddingCardsComponent;
  let fixture: ComponentFixture<WeddingCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeddingCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeddingCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
