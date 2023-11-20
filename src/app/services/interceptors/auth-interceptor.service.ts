import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  private readonly JwtToken = environment.JwtToken

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.JwtToken}`,
        accept: "application/json",
      },
    });

    return next.handle(modifiedRequest);
  }
}
