import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannersListComponent } from './banners-list/banners-list.component';
import {StoreModule} from "@ngrx/store";
import { BannerItemComponent } from './banners-list/banner-item/banner-item.component';
import {HttpClientModule} from "@angular/common/http";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgOptimizedImage} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EffectsModule } from '@ngrx/effects';
import {bannersReducer} from "./store/banners/banners.reducer";
import {BannersEffects} from "./store/banners/banners.effects";

@NgModule({
  declarations: [
    AppComponent,
    BannersListComponent,
    BannerItemComponent,
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
    StoreModule.forRoot({
      banners: bannersReducer
    }),
    EffectsModule.forRoot([
      BannersEffects
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
