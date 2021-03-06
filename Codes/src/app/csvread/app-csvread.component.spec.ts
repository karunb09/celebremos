import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CsvReadComponent } from './app-csvread.component';

describe('CsvReadComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        CsvReadComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CsvReadComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Read CSV'`, () => {
    const fixture = TestBed.createComponent(CsvReadComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Read CSV');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(CsvReadComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Read CSV!');
  });
});
