import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {Store} from "@ngrx/store";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {apiError, bannerFormData, drawerUI} from './store/banners.selector';
import {BannersStore} from "./store/banners.reducer";
import {drawerToggle, setDeleteButton} from "./store/banners.actions";
import {ActivatedRoute, Params, Router} from "@angular/router";

type Input = string | null

@Component({
  selector: 'app-store',
  templateUrl: './banners.component.html',
})
export class BannersComponent implements OnInit{

  bannerForm = new FormGroup({
    "name": new FormControl<Input>(null, [Validators.required]),
    "zoneId": new FormControl<Input>(null, [Validators.required]),
    "active": new FormControl(null, [Validators.required]),
    "startDate": new FormControl<Input>(null, [Validators.required]),
    "endDate": new FormControl<Input>(null),
    "fileId": new FormControl<string | number | null>(null,  [Validators.required]),
    "priority": new FormControl<Input>('', [Validators.required, Validators.min(0)]),
    "channelId": new FormControl<Input>(null, [Validators.required]),
    "language": new FormControl<Input>(null, [Validators.required]),
    "url": new FormControl<Input>(null, [Validators.required]),
    "labels": new FormControl<string[]>([])
  })

  constructor(
    // private formService: FormsService,
    private bannerStore: Store<{banner: BannersStore}>,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  drawer$ = this.bannerStore.select(drawerUI)

  apiError$ = this.bannerStore.select(apiError)

  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen) this.bannerStore.dispatch(drawerToggle({drawerState: JSON.parse(drawerIsOpen)}))

    this.bannerStore.select(bannerFormData).subscribe(formData => {
      this.bannerForm.patchValue(formData)
    })
  }

  drawerOpen() {
     this.bannerStore.dispatch(drawerToggle({drawerState: this.drawer.opened}))
  }

  drawerClose() {
    this.bannerStore.dispatch(drawerToggle({drawerState: false}))
    this.bannerForm.reset()
    // for (const controlName of Object.keys(this.bannerForm.controls)) {
    //   const control = this.bannerForm.get(controlName);
    //   control?.setErrors(null);
    // }
    this.bannerStore.dispatch(setDeleteButton({show: false}))
    localStorage.clear();
    sessionStorage.clear()
  }

  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })


  routeParamsChange(queryParams: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }


}
