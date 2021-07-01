import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TplOutletComponent } from './tpl-outlet.component';

describe('TplOutletComponent', () => {
  let component: TplOutletComponent;
  let fixture: ComponentFixture<TplOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TplOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TplOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
