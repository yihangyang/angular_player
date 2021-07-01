import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeGrandsonComponent } from './change-grandson.component';

describe('ChangeGrandsonComponent', () => {
  let component: ChangeGrandsonComponent;
  let fixture: ComponentFixture<ChangeGrandsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeGrandsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeGrandsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
