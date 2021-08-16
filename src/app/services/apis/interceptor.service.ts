import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { storageKeys } from "src/app/configs";
import { WindowService } from "../tools/window.service";

interface CustomHttpConfig {
  headers?: HttpHeaders;
}

const ERR_MSG = "request failed"

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private winService: WindowService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.winService.getStorage(storageKeys.auth);
    const needToken = req.headers.get(storageKeys.needToken);
    console.log('needToken', needToken);
    let httpConfig: CustomHttpConfig = {};
    if(true) {
      httpConfig = {
        headers: req.headers.set(storageKeys.auth, auth || '')
      };
    }
    const copyReq = req.clone(httpConfig);
    return next.handle(copyReq).pipe(catchError(error => this.handleError(error)))
  }

  private handleError(error: HttpErrorResponse):Observable<never> {
    if(typeof error.error?.ret === 'number') {
      alert(error.error.message || ERR_MSG);
    } else {
      alert(ERR_MSG);
    }
    return throwError(error);
  }

}