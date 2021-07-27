import { NgModule } from '@angular/core';
import { StrTplOutletDirective } from './str-tpl-outlet.directive';
import { IconDirective } from './icon/icon.directive';
import { CharleneBtnDirective } from './charlene-btn.directive';
import { ToggleMoreDirective } from './toggle-more.directive';

@NgModule({
  declarations: [
    StrTplOutletDirective,
    IconDirective,
    CharleneBtnDirective,
    ToggleMoreDirective,
  ],
  exports: [
    StrTplOutletDirective,
    IconDirective,
    CharleneBtnDirective,
    ToggleMoreDirective
  ]
})
export class DirectivesModule { }
