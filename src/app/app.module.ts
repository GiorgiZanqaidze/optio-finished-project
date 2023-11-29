import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {StoreModule} from "@ngrx/store";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { EffectsModule } from '@ngrx/effects';
import {AuthInterceptorService} from "./services/interceptors/auth/auth-interceptor.service";
import {ApiUrlInterceptorService} from "./services/interceptors/api-url/api-url-interceptor.service";
import {bannersReducer} from "./store/reducers/banners.reducer";
import {BannersEffects} from "./store/effects/banners.effects";
import {StoreRouterConnectingModule} from "@ngrx/router-store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      banners: bannersReducer,
    }),
    EffectsModule.forRoot([
      BannersEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
      },
      {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiUrlInterceptorService,
          multi: true,
      },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
