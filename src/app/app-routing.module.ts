import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BannersListComponent} from "./banners-list/banners-list.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "banners",
    pathMatch: "full"
  },
  {
    path: "banners",
    component: BannersListComponent
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
