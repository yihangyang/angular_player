import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'charlene-tpl-outlet',
  templateUrl: './tpl-outlet.component.html',
  styleUrls: ['./tpl-outlet.component.scss']
})
export class TplOutletComponent implements OnInit {
  @Input() render: TemplateRef<any>;
  myContext = {$implicit: 'world'}

  constructor() { }

  ngOnInit(): void {
  }

}
