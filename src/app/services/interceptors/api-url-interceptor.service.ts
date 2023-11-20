import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiUrlInterceptorService {

  private readonly baseUrl = environment.ApiUrl

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const modifiedRequest = request.clone({
      url: `${this.baseUrl}${request.url}`,
    });

    return next.handle(modifiedRequest);
  }
}
