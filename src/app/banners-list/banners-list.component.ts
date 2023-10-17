import { Component, OnInit, ViewChild} from '@angular/core';
import {BannersService} from "../services/banners/banners.service";
import {MatDrawer} from "@angular/material/sidenav";
import {FormsService} from "../services/forms/forms.service";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {drawerOpen} from "../store/drawer/drawer.action";
import {BannersStore} from "../store/banners/banners.reducer";
import {showEditForm} from "../store/banners/banners.selector";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css'],
})
export class BannersListComponent implements OnInit{

  drawer$!: Observable<boolean>

  constructor(
    public bannersService: BannersService,
    private formService: FormsService,
    private store: Store<{drawer: boolean}>,
    private bannersStore: Store<{banners: BannersStore}>
  ) {
    this.drawer$ = store.select('drawer')


  }

  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen) this.store.dispatch(drawerOpen({drawerState: JSON.parse(drawerIsOpen)}))
  }

  drawerOpen() { this.store.dispatch(drawerOpen({drawerState: this.drawer.opened})) }

  drawerClose() { this.bannersService.onDrawerClose() }

}
