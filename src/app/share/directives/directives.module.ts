import { NgModule } from '@angular/core';
import { StrTplOutletDirective } from './str-tpl-outlet.directive';
import { IconDirective } from './icon/icon.directive';
import { CharleneBtnDirective } from './charlene-btn.directive';
import { ToggleMoreDirective } from './toggle-more.directive';
import { DragModule } from './drag/drag.module';

@NgModule({
  declarations: [
    StrTplOutletDirective,
    IconDirective,
    CharleneBtnDirective,
    ToggleMoreDirective,
  ],
  imports: [
    DragModule
  ],
  exports: [
    DragModule,
    StrTplOutletDirective,
    IconDirective,
    CharleneBtnDirective,
    ToggleMoreDirective
  ]
})
export class DirectivesModule { }
