import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbItemComponent } from './breadcrumb-item/breadcrumb-item.component';
import { DirectivesModule } from '../../directives/directives.module';



@NgModule({
  declarations: [
    BreadcrumbComponent,
    BreadcrumbItemComponent
  ],
  imports: [
    DirectivesModule
  ],
  exports: [
    BreadcrumbComponent,
    BreadcrumbItemComponent
  ]
})
export class BreadcrumbModule { }
