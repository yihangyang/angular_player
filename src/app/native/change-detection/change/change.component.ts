import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'charlene-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.scss']
})
export class ChangeComponent implements OnInit {
  heroName = "Kart"
  constructor() { }

  ngOnInit(): void {
  }

}
