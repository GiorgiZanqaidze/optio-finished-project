import { NgModule } from "@angular/core";
import { BannersComponent } from "./banners.component";
import { BannerFormComponent } from "src/app/components/banner-form/banner-form.component";
import { BannerTableComponent } from "src/app/components/banner-table/banner-table.component";
import { BannersFilterSortComponent } from "src/app/components/banners-filter-sort/banners-filter-sort.component";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { BannersRoutingModule } from "./banners-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";



@NgModule({
  declarations: [
    BannersComponent,
    BannerFormComponent,
    BannerTableComponent,
    BannersFilterSortComponent,
  ],
  imports: [
    CommonModule,
    BannersRoutingModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],

})
export class BannersModule { }
