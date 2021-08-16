import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'charlene-sizer',
  templateUrl: './sizer.component.html',
  styleUrls: ['./sizer.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SizerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SizerComponent implements OnInit, ControlValueAccessor {
  size = 16;
  constructor(private cdr: ChangeDetectorRef) { }
 
  ngOnInit(): void {
  }

  inc(): void {
    this.size += 1;
    this.onChange(this.size);
   }

  dec(): void {
    this.size -= 1;
    this.onChange(this.size);
   }

  private onChange = (value: number) => {
     
  }

  private onTouched = () => {
     
  }

  writeValue(value: number): void {
    this.size = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: number)=> void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: ()=> void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log('setDisabledState', isDisabled);
  }




  // private onChange = (value: number) => {};
  // private onTouched = () => {};

  // writeValue(value: number): void {
  //   this.size = value;
  //   this.cdr.markForCheck();
  // }
  // registerOnChange(fn: (value: number) => void): void {
  //   this.onChange = fn;
  // }
  // registerOnTouched(fn: () => void): void {
  //   this.onTouched = fn;
  // }

  // // some
  // setDisabledState(disabled: boolean): void {
  //   this.disabled = disabled;
  // }

}