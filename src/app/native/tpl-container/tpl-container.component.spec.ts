import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TplContainerComponent } from './tpl-container.component';

describe('TplContainerComponent', () => {
  let component: TplContainerComponent;
  let fixture: ComponentFixture<TplContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TplContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TplContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
