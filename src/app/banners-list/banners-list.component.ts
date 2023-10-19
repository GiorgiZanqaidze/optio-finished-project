import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {FormsService} from "../services/forms/forms.service";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {drawerClose, drawerOpen} from "../store/drawer/drawer.action";
import {setDeleteButton} from "../store/form/form.actions";
import {FormStore} from "../store/form/form.reducer";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css'],
})
export class BannersListComponent implements OnInit{

  drawer$!: Observable<boolean>

  constructor(
    private formService: FormsService,
    private drawerStore: Store<{drawer: boolean}>,
    private formStore: Store<{form: FormStore}>
  ) {
    this.drawer$ = drawerStore.select('drawer')
  }

  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen) this.drawerStore.dispatch(drawerOpen({drawerState: JSON.parse(drawerIsOpen)}))
  }

  drawerOpen() { this.drawerStore.dispatch(drawerOpen({drawerState: this.drawer.opened})) }

  drawerClose() {
    this.drawerStore.dispatch(drawerClose({drawerState: false}))
    this.formService.bannerForm.reset()
    for (const controlName of Object.keys(this.formService.bannerForm.controls)) {
      const control = this.formService.bannerForm.get(controlName);
      control?.setErrors(null);
    }
    this.formStore.dispatch(setDeleteButton({show: false}))
    localStorage.clear();
    sessionStorage.clear()
  }

}
