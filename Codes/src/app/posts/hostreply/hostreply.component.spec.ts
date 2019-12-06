import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostreplyComponent } from './hostreply.component';

describe('HostreplyComponent', () => {
  let component: HostreplyComponent;
  let fixture: ComponentFixture<HostreplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostreplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostreplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
