import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiUrlInterceptorService {

  constructor() { }

  private readonly baseUrl = environment.ApiUrl

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to set the base URL
    const modifiedRequest = request.clone({
      url: `${this.baseUrl}${request.url}`,
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest);
  }
}
