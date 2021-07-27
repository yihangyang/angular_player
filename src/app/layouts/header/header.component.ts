import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, ElementRef, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'src/app/services/apis/types';

@Component({
  selector: 'charlene-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('moveUpMotion', [
      state('true', style({
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1,
      })),
      transition('* => true', [
        style({
          transform: 'translateY(-100%)',
          opacity: 0,
        }),
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  user: User;
  fix: boolean = false;
  @Output() login = new EventEmitter<void>();
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    fromEvent(this.doc, 'scroll')
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        const top = this.doc.documentElement.scrollTop; // distance of scroll
        console.log(top);
        if(top > this.el.nativeElement.clientHeight + 100){
          this.fix = true;
        } else if (top === 0) {
          this.fix = false;
        }
        this.cdr.markForCheck();
      })
  }
}
