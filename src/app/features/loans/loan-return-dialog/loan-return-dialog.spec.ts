import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReturnDialog } from './loan-return-dialog';

describe('LoanReturnDialog', () => {
  let component: LoanReturnDialog;
  let fixture: ComponentFixture<LoanReturnDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanReturnDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanReturnDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
