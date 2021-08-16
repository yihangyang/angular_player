import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, Renderer2, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { empty, merge, of, Subscription } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { OverlayRef, OverlayService } from 'src/app/services/tools/overlay.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { UserService } from 'src/app/services/apis/user.service';
import { WindowService } from 'src/app/services/tools/window.service';
import { storageKeys } from 'src/app/configs';
import { ContextService } from 'src/app/services/business/context.service';


@Component({
  selector: 'charlene-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modelAni', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(100%)'
        }),
        animate('.2s', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('.3s', style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ]),
    ])
  ]
})
export class LoginComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() show: boolean = false;
  @Output() hide = new EventEmitter<void>();
  visible = false;
  remeber = false;
  private overlayRef: OverlayRef;
  private overlaySub: Subscription;

  formValues = this.fb.group({
    phone: ['13800000000', [
      Validators.required,
      Validators.pattern(/^1\d{10}$/)
    ]],
    password: ['angular', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  @ViewChild('modelWrap', { static: false }) private modelWrap: ElementRef;
  constructor(
    private overlayService: OverlayService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object,
    private userService: UserService,
    private winService: WindowService,
    private contextService: ContextService,
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
      this.visible = false;
    }
  }

  submit(): void {
    console.log('submit');
    if(this.formValues.valid) {
      this.userService.login(this.formValues.value).subscribe(({user, token}) => {
        this.contextService.setUser(user);
        this.winService.setStorage(storageKeys.auth, token);
        if(this.remeber) {
          this.winService.setStorage(storageKeys.remember, 'true');
        }
        this.hide.emit();
        alert('login successfully');
      })
    }
  }

  create(): void {
    if(isPlatformBrowser(this.platformId)) {
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
      this.visible = true;
      setTimeout(() => {
        this.rd2.appendChild(this.overlayRef.container, this.modelWrap.nativeElement);
      }, 0);
    }
    
  }

  animationDone(event: AnimationEvent) {
    if(event.toState === 'void'){
      if(this.overlaySub) {
        this.overlaySub.unsubscribe();
        this.overlaySub = null;
      }
      if(this.overlayRef) {
        this.overlayRef.dispose();
        this.overlayRef = null;
      }
    }
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
