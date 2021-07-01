import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'charlene-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
  @Input() charleneSeparator:TemplateRef<any> | string = '>';

  constructor() { }

  ngOnInit(): void {
  }

}
