import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BannersComponent} from "./banners/banners.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "banners",
    pathMatch: "full"
  },
  {
    path: "banners",
    component: BannersComponent,
  },
  {
    path: "**",
    redirectTo: "banners"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
