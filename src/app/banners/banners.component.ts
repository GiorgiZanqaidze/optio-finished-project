import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {FormsService} from "../services/banners/forms.service";
import {Store} from "@ngrx/store";
import { drawerToggle} from "../store/UI/UI.action";
import { setDeleteButton} from "../store/form/form.actions";
import {FormStore} from "../store/form/form.reducer";
import {drawerUI} from "../store/UI/UI.selectors";
import { FormControl, FormGroup } from '@angular/forms';
import { RouteParamsService } from '../services/banners/route-params.service';
import { apiError } from '../store/banners/banners.selector';
import {BannersStore} from "../store/banners/banners.reducer";
import {openEditForm} from "../store/banners/banners.actions";

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
})
export class BannersComponent implements OnInit{

  constructor(
    private formService: FormsService,
    private drawerStore: Store<{drawer: boolean}>,
    private formStore: Store<{form: FormStore}>,
    private bannersService: RouteParamsService,
    private bannerStore: Store<{banner: BannersStore}>
  ) {}
  drawer$ = this.drawerStore.select(drawerUI)

  apiError$ = this.drawerStore.select(apiError)

  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen) this.drawerStore.dispatch(drawerToggle({drawerState: JSON.parse(drawerIsOpen)}))
  }

  drawerOpen() {
     this.drawerStore.dispatch(drawerToggle({drawerState: this.drawer.opened}))
     this.bannerStore.dispatch(openEditForm())
  }

  drawerClose() {
    this.drawerStore.dispatch(drawerToggle({drawerState: false}))
    this.formService.bannerForm.reset()
    for (const controlName of Object.keys(this.formService.bannerForm.controls)) {
      const control = this.formService.bannerForm.get(controlName);
      control?.setErrors(null);
    }
    this.formStore.dispatch(setDeleteButton({show: false}))
    localStorage.clear();
    sessionStorage.clear()
  }

  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })

  bannersSearch(data: any) { this.bannersService.onRouteParamsChange(data) }

}
