import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {Store} from "@ngrx/store";
import {FormControl, FormGroup} from '@angular/forms';
import {
  apiError,
  bannerFormData,
  bannersPage,
  bannersPageSize,
  channelsReference,
  drawerUI, fileIdChanges,
  formServerError,
  isLoadingSubmitBanner,
  isLoadingUI,
  labelsReference,
  languagesReference,
  resetBannerForm,
  searchAndSortBannerForm, selectBanners,
  showDeleteButton,
  totalPages,
  zonesReference
} from './store/selectors/banners.selector';
import {BannersStore} from "./store/state/banners.state";
import {
  deleteBanner,
  drawerToggle,
  getBannerById,
  openEditForm, selectFile,
  setDeleteButton,
  startSubmitBannerLoading, submitBannerData, resetBannerFormAction
} from "./store/actions/banners.actions";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Banner} from "../shared/types/banner";
import {fileReader} from "../shared/utilities/file-utils";


@Component({
  selector: 'app-store',
  templateUrl: './banners.component.html',
})
export class BannersComponent implements OnInit{

  // bannerForm = new FormGroup({
  //   "name": new FormControl<Input>(null, [Validators.required]),
  //   "zoneId": new FormControl<Input>(null, [Validators.required]),
  //   "active": new FormControl(null, [Validators.required]),
  //   "startDate": new FormControl<Input>(null, [Validators.required]),
  //   "endDate": new FormControl<Input>(null),
  //   "fileId": new FormControl<string | number | null>(null,  [Validators.required]),
  //   "priority": new FormControl<Input>('', [Validators.required, Validators.min(0)]),
  //   "channelId": new FormControl<Input>(null, [Validators.required]),
  //   "language": new FormControl<Input>(null, [Validators.required]),
  //   "url": new FormControl<Input>(null, [Validators.required]),
  //   "labels": new FormControl<string[]>([])
  // })


  bannersDataEntities$ = this.bannerStore.select(selectBanners)
  totalPages$ = this.bannerStore.select(totalPages)
  bannersPage$ = this.bannerStore.select(bannersPage)
  bannersPageSize$ = this.bannerStore.select(bannersPageSize)
  isLoading$ = this.bannerStore.select(isLoadingUI)
  apiError$ = this.bannerStore.select(apiError)
  resetBannerForm$ = this.bannerStore.select(resetBannerForm)

  bannerForm$ = this.bannerStore.select(bannerFormData)
  channels$ = this.bannerStore.select(channelsReference)
  zones$ = this.bannerStore.select(zonesReference)
  languages$ = this.bannerStore.select(languagesReference)
  labels$ = this.bannerStore.select(labelsReference)
  submitBannerDataIsLoading$ = this.bannerStore.select(isLoadingSubmitBanner)
  showDeleteButton$ =  this.bannerStore.select(showDeleteButton)
  formApiError$ = this.bannerStore.select(formServerError)

  drawer$ = this.bannerStore.select(drawerUI)

  fileId$ = this.bannerStore.select(fileIdChanges)


  constructor(
    private bannerStore: Store<{banner: BannersStore}>,
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {

    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen) {
        this.bannerStore.dispatch(drawerToggle({drawerState: JSON.parse(drawerIsOpen)}))
        this.bannerStore.dispatch(openEditForm())
    }

    // inside the child
    this.bannerStore.select(searchAndSortBannerForm).subscribe((form) => {
      this.searchBannersForm.patchValue(form)
    })

    const bannerId = localStorage.getItem('bannerId') as string
    if (bannerId && JSON.parse(bannerId)) {
        this.bannerStore.dispatch(getBannerById({editFlag: true, bannerId: JSON.parse(bannerId)}))
    }
  }

  drawerOpen() {
     this.bannerStore.dispatch(drawerToggle({drawerState: this.drawer.opened}))
  }

  drawerClose() {
    this.bannerStore.dispatch(drawerToggle({drawerState: false}))
    this.bannerStore.dispatch(setDeleteButton({show: false}))
    this.bannerStore.dispatch(resetBannerFormAction())

    // this.bannerForm.reset()
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
    this.bannerStore.dispatch(getBannerById({editFlag: true, bannerId: rowData.id}))
  }

  submitBannerData($event: {fileId: number, bannerId: number, editFlag: boolean, formData: Banner}) {
    const {fileId, bannerId, editFlag, formData} = $event
    const mergedBannerData = {...formData, id: bannerId, fileId: fileId}
    this.bannerStore.dispatch(startSubmitBannerLoading())
    this.bannerStore.dispatch(submitBannerData({bannerData: mergedBannerData, editFlag}))
  }

  selectedFile(file: File) {
    const modifiedFile = fileReader(file)
    const fileForm = new FormData();
    fileForm.set('blob', modifiedFile)
    this.bannerStore.dispatch(selectFile({file: fileForm}))
  }

  deleteBanner(bannerId: string) {
      this.bannerStore.dispatch(startSubmitBannerLoading())
      this.bannerStore.dispatch(deleteBanner({bannerId: JSON.parse(bannerId)}))
  }
}
