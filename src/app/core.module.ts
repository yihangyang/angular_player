import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './layouts/header/header.component';
import { PagesModule } from './pages/pages.module';
import { BreadcrumbModule } from './share/components/breadcrumb/breadcrumb.module';
import { LoginComponent } from './layouts/login/login.component';
import { DirectivesModule } from './share/directives/directives.module';
import { CheckboxModule } from './share/components/checkbox/checkbox.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterceptorService } from './services/apis/interceptor.service';


@NgModule({
  declarations: [
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PagesModule,
    AppRoutingModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    DirectivesModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
    }
  ],
  exports: [
    HeaderComponent,
    BreadcrumbModule,
    BrowserModule,
    AppRoutingModule,
    LoginComponent,
    DirectivesModule
  ],
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule only can be imported by AppModule');
    }
  }
}
