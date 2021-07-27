import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ViewEncapsulation, HostBinding, HostListener, Input, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxGroupComponent } from './checkbox-group.component';

export type CheckboxValue = number | string;
@Component({
  selector: '[charlene-checkbox]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  host: {
    '[class.charlene-checkbox-wrap]': 'true'
  }
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  @HostBinding('class.checked') checked = false;
  @HostBinding('class.disabled') disabled = false;

  @Input() value: CheckboxValue;

  constructor(private cdr: ChangeDetectorRef, @Optional() private parent: CheckboxGroupComponent) { }

  ngOnInit(): void {
    if(this.parent) {
      this.parent.addCheckbox(this);
    }
  }
  
  @HostListener('click', ['$event'])
  hostClick(event: MouseEvent): void{
    event.preventDefault();
    if(!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      if(this.parent) {
        this.parent.handelCheckboxClick(this.value, this.checked);
      }
    }
  }

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  writeValue(value: boolean): void {
    this.checked = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }


}
