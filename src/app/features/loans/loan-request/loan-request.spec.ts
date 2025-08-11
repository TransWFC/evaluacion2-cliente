import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRequest } from './loan-request';

describe('LoanRequest', () => {
  let component: LoanRequest;
  let fixture: ComponentFixture<LoanRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
