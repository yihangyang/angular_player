import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'charlene-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
