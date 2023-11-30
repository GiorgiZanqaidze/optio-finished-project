import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {Store} from "@ngrx/store";
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
} from '../../store/selectors/banners.selector';

import {
  deleteBanner,
  drawerToggle,
  getBannerById,
  selectFile,
  submitBannerData, resetBannerFormAction, getReferenceData, getBannersData
} from "../../store/actions/banners.actions";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Banner} from "../../shared/types/banner";
import {fileReader} from "../../shared/utilities/file-utils";

@Component({
  selector: 'app-store',
  templateUrl: './banners.component.html',
})
export class BannersComponent implements OnInit{

  bannersDataEntities$ = this.store.select(selectBanners)
  totalPages$ = this.store.select(totalPages)
  bannersPage$ = this.store.select(bannersPage)
  bannersPageSize$ = this.store.select(bannersPageSize)
  isLoading$ = this.store.select(isLoadingUI)
  apiError$ = this.store.select(apiError)
  resetBannerForm$ = this.store.select(resetBannerForm)

  bannerForm$ = this.store.select(bannerFormData)
  channels$ = this.store.select(channelsReference)
  zones$ = this.store.select(zonesReference)
  languages$ = this.store.select(languagesReference)
  labels$ = this.store.select(labelsReference)
  submitBannerDataIsLoading$ = this.store.select(isLoadingSubmitBanner)
  showDeleteButton$ =  this.store.select(showDeleteButton)
  formApiError$ = this.store.select(formServerError)
  searchBannersForm$ = this.store.select(searchAndSortBannerForm)
  drawer$ = this.store.select(drawerUI)
  fileId$ = this.store.select(fileIdChanges)

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  @ViewChild('drawer') drawer!: MatDrawer

  ngOnInit() {
    this.route.queryParams
    .subscribe((queryParams: Params) => {
      const {search, sortBy, sortDirection, page, pageSize} = queryParams
      this.store.dispatch(getBannersData({queryParams: {search, sortBy, sortDirection, page, pageSize}}))
    })

    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen) {
        this.store.dispatch(getReferenceData({drawerState: JSON.parse(drawerIsOpen)}))
    }

    const bannerId = localStorage.getItem('bannerId') as string
    if (bannerId && JSON.parse(bannerId)) {
        this.store.dispatch(getBannerById({editFlag: true, bannerId: JSON.parse(bannerId)}))
    }
  }

  drawerOpen() {
     this.store.dispatch(drawerToggle({drawerState: this.drawer.opened}))
  }

  drawerClose() {
    this.store.dispatch(resetBannerFormAction())
    localStorage.clear();
  }

  routeParamsChange(queryParams: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }

  showEditBannerForm(rowData: Banner) {
    this.store.dispatch(getBannerById({editFlag: true, bannerId: rowData.id}))
  }

  submitBannerData($event: {fileId: number, bannerId: number, editFlag: boolean, formData: Banner}) {
    const {fileId, bannerId, editFlag, formData} = $event
    const mergedBannerData = {...formData, id: bannerId, fileId: fileId}
    this.store.dispatch(submitBannerData({bannerData: mergedBannerData, editFlag}))
  }

  selectedFile(file: File) {
    const modifiedFile = fileReader(file)
    const fileForm = new FormData();
    fileForm.set('blob', modifiedFile)
    this.store.dispatch(selectFile({file: fileForm}))
  }

  deleteBanner(bannerId: string) {
      this.store.dispatch(deleteBanner({bannerId: JSON.parse(bannerId)}))
  }
}
