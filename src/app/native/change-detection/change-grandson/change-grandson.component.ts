import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'charlene-change-grandson',
  templateUrl: './change-grandson.component.html',
  styleUrls: ['./change-grandson.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeGrandsonComponent implements OnInit {
  @Input() position: 'up' | 'down';
  grandsonName = "grandSon"
  constructor() { }

  ngOnInit(): void {
  }

}
