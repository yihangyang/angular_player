import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'src/app/services/apis/types';

@Component({
  selector: 'charlene-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  user: User;
  constructor() { }

  ngOnInit(): void {
  }

}
