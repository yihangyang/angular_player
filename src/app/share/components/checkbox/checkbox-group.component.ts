import { Component, OnInit, ChangeDetectionStrategy, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent, CheckboxValue } from './checkbox.component';

@Component({
  selector: 'charlene-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true
    }
  ]
})
export class CheckboxGroupComponent implements OnInit, ControlValueAccessor {
  private checkboxes: CheckboxComponent[] = [];
  private current: CheckboxValue[] = [];
  // @Input()
  // set initCurrent(checks: CheckboxValue[]){
  //   console.log('init', checks);
  //   this.current = checks;
  //   if(checks.length){
  //     this.updateCheckBox(checks);
  //   }
  // }
  constructor() { }

  ngOnInit(): void {
  }

  addCheckbox(checkbox: CheckboxComponent): void {
    this.checkboxes.push(checkbox);
    console.log('checkboxs', this.checkboxes);
  };

  updateCheckBox(current: CheckboxValue[]): void {
    if(this.checkboxes.length) {
      this.checkboxes.forEach(item => {
        item.writeValue(current.includes(item.value));
      })
    }
    this.current = current;
    this.onChange(this.current);
  }

  handelCheckboxClick(value: CheckboxValue, checked: boolean): void {
    const newCurrent = this.current.slice();
    if(checked) {
      if(!newCurrent.includes(value)){
        newCurrent.push(value);
        console.log('this.current.slice', value);
      }
    } else { // !checked
      const targetIndex = newCurrent.findIndex(item => item === value);
      if(targetIndex > -1) { // gefunden
        newCurrent.splice(targetIndex, 1);
      }
    }
    this.writeValue(newCurrent);
    console.log(newCurrent);
  }

  private onChange = (value: CheckboxValue[]) => {};
  private onTouched = () => {};


  writeValue(value: CheckboxValue[]): void {
    if(value) {
      this.updateCheckBox(value);
    }
  }
  registerOnChange(fn: (value: CheckboxValue[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
