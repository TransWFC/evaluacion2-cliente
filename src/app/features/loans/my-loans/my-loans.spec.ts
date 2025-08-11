import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLoans } from './my-loans';

describe('MyLoans', () => {
  let component: MyLoans;
  let fixture: ComponentFixture<MyLoans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLoans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
