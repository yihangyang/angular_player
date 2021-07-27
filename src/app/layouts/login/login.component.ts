import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, Renderer2, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { empty, merge, of, Subscription } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { OverlayRef, OverlayService } from 'src/app/services/tools/overlay.service';

@Component({
  selector: 'charlene-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() show: boolean = false;
  @Output() hide = new EventEmitter<void>();
  private overlayRef: OverlayRef;
  private overlaySub: Subscription;

  formValues = this.fb.group({
    phone: ['', [
      Validators.required,
      Validators.pattern(/^1\d{10}$/)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  @ViewChild('modelWrap', { static: false }) private modelWrap: ElementRef;
  constructor(
    private overlayService: OverlayService,
    private fb: FormBuilder,
    private rd2: Renderer2
  ) { }
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.showOverlay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.show) {
      this.create();
    } else {
      this.dispose();
    }
  }

  submit(): void {

  }

  dispose(): void {
     
  }

  create(): void {
    this.overlayRef = this.overlayService.create({
      fade: true,
      center:true,
      backgroundColor: 'rgba(0,0,0,.32)'
    });
    // console.log('overlayRef', this.overlayRef);
    this.overlaySub = merge(
      this.overlayRef.backdropClick(),
      this.overlayRef.backdropKeyup().pipe(
        pluck('key'),
        switchMap( key => {
          return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
        })
      )
    ).subscribe(() => {
      this.hide.emit();
    });
    setTimeout(() => {
      this.rd2.appendChild(this.overlayRef.container, this.modelWrap.nativeElement);
    }, 0);
  }

  hideOverlay(): void {
    if(this.overlaySub) {
      this.overlaySub.unsubscribe();
      this.overlaySub = null;
    }
    this.overlayRef.dispose();
    this.overlayRef = null;
  }

  get formControls(): {
    [key: string]: {
      control: AbstractControl,
      showErr: boolean,
      errors: ValidationErrors,
    }
  } {
    const controls = {
      phone: this.formValues.get('phone'),
      password: this.formValues.get('password'),
    }
    return {
      phone: {
        control: controls.phone,
        showErr: controls.phone.touched && controls.phone.invalid,
        errors: controls.phone.errors
      },
      password: {
        control: controls.password,
        showErr: controls.password.touched && controls.password.invalid,
        errors: controls.password.errors
      },
    }
  }
}
