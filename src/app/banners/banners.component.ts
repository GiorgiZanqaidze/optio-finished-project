import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {Store} from "@ngrx/store";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  apiError,
  bannerFormData,
  bannersData,
  bannersPage,
  bannersPageSize,
  channelsReference,
  drawerUI,
  formServerError,
  isLoadingSubmitBanner,
  isLoadingUI,
  labelsReference,
  languagesReference,
  searchAndSortBannerForm,
  showDeleteButton,
  totalPages,
  zonesReference
} from './store/banners.selector';
import {BannersStore} from "./store/banners.reducer";
import {
  drawerToggle,
  getBannerById,
  openEditForm,
  setDeleteButton,
  startSubmitBannerLoading, submitBannerData, submitFormData
} from "./store/banners.actions";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Banner} from "../shared/types/banner";

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

  bannersData$ = this.bannerStore.select(bannersData)
  totalPages$ = this.bannerStore.select(totalPages)
  bannersPage$ = this.bannerStore.select(bannersPage)
  bannersPageSize$ = this.bannerStore.select(bannersPageSize)
  isLoading$ = this.bannerStore.select(isLoadingUI)
  apiError$ = this.bannerStore.select(apiError)


  channels$ = this.bannerStore.select(channelsReference)
  zones$ = this.bannerStore.select(zonesReference)
  languages$ = this.bannerStore.select(languagesReference)
  labels$ = this.bannerStore.select(labelsReference)
  submitBannerDataIsLoading$ = this.bannerStore.select(isLoadingSubmitBanner)
  showDeleteButton$ =  this.bannerStore.select(showDeleteButton)
  formApiError$ = this.bannerStore.select(formServerError)

  constructor(
    private bannerStore: Store<{banner: BannersStore}>,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  drawer$ = this.bannerStore.select(drawerUI)


  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen) this.bannerStore.dispatch(drawerToggle({drawerState: JSON.parse(drawerIsOpen)}))

    this.bannerStore.select(bannerFormData).subscribe(formData => {
      this.bannerForm.patchValue(formData)
    })

    this.bannerStore.select(searchAndSortBannerForm).subscribe((form) => {
      this.searchBannersForm.patchValue(form)
    })
  }

  drawerOpen() {
     this.bannerStore.dispatch(drawerToggle({drawerState: this.drawer.opened}))
  }

  drawerClose() {
    this.bannerStore.dispatch(drawerToggle({drawerState: false}))
    this.bannerForm.reset()
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

  showEditBannerForm(rowData: Banner) {
    this.bannerStore.dispatch(openEditForm())
    this.bannerStore.dispatch(getBannerById({editFlag: true, bannerId: rowData.id}))
  }

  submitBannerData($event: {fileId: number, bannerId: number, editFlag: boolean, blob: Blob, formData: Banner}) {

    const {fileId, bannerId, editFlag, blob, formData} = $event

    this.bannerStore.dispatch(startSubmitBannerLoading())
    if (!$event.fileId) {
      this.bannerStore.dispatch(submitFormData({data: formData, blob: blob}))
    } else {
      const mergedBannerData = {...formData, id: bannerId, fileId: fileId}
      this.bannerStore.dispatch(submitBannerData({bannerData: mergedBannerData, editFlag}))
    }
  }


}
