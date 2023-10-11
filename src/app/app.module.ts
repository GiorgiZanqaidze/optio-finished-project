import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannersListComponent } from './banners-list/banners-list.component';
import {StoreModule} from "@ngrx/store";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgOptimizedImage} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EffectsModule } from '@ngrx/effects';
import { BannerFormComponent } from './banners-list/banner-form/banner-form.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {AuthInterceptorService} from "./services/interceptors/auth-interceptor.service";
import {ApiUrlInterceptorService} from "./services/interceptors/api-url-interceptor.service";
import {MatTableModule} from "@angular/material/table";
import { BannerTableComponent } from './banners-list/banner-table/banner-table.component';
import { BannersFilterSortComponent } from './banners-list/banners-filter-sort/banners-filter-sort.component';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    BannersListComponent,
    BannerFormComponent,
    BannerTableComponent,
    BannersFilterSortComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    HttpClientModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    MatSidenavModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
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
