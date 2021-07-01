import { ChangeDetectorRef, EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'charlene-change-child',
  templateUrl: './change-child.component.html',
  styleUrls: ['./change-child.component.scss']
})
export class ChangeChildComponent implements OnInit {
  position = 'down';
  childName = "Vern";
  @Input() arms = "simple sword"
  @Output() childInit = new EventEmitter<void>();
  constructor(private cdr: ChangeDetectorRef) { 
    // this.cdr.detach();
  }

  ngOnInit(): void {
    // this.childInit.emit();
    setTimeout(() => {
      this.childName = "EZ";
    }, 3000);
  }

}
