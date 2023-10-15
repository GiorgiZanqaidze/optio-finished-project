import { Component, OnInit, ViewChild} from '@angular/core';
import {BannersService} from "../services/banners/banners.service";
import {MatDrawer} from "@angular/material/sidenav";
import {FormsService} from "../services/forms/forms.service";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css'],
})
export class BannersListComponent implements OnInit{

  constructor(
    public bannersService: BannersService,
    private formService: FormsService
  ) {}

  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen !== null) this.bannersService.setDrawerIsOpen(JSON.parse(drawerIsOpen))

    this.formService.getBannerIdObservable().subscribe(() => {
      this.drawer.toggle(true ).then(() => {
        this.formService.showDeleteButton = true
      }).catch(err => console.log(err))
    })
  }

  drawerOpen() { this.bannersService.setDrawerIsOpen(this.drawer.opened) }

  drawerClose() { this.bannersService.onDrawerClose() }

}
