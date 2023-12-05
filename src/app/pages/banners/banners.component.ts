import { Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {BannersSelectors} from "../../store/selectors"
import {BannersListPageActions} from "../../store/actions"
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Banner} from "../../shared/types/banner";
import {fileReader} from "../../shared/utilities/file-utils";
import {deepEqual} from "../../shared/utilities/deep-equal"
@Component({
  selector: 'app-store',
  templateUrl: './banners.component.html',
})
export class BannersComponent implements OnInit{

  bannersDataEntities$ = this.store.select(BannersSelectors.selectBanners)
  totalPages$ = this.store.select(BannersSelectors.totalPages)
  isLoading$ = this.store.select(BannersSelectors.isLoadingUI)
  apiError$ = this.store.select(BannersSelectors.apiError)
  resetBannerForm$ = this.store.select(BannersSelectors.resetBannerForm)

  bannerForm$ = this.store.select(BannersSelectors.bannerFormData)
  channels$ = this.store.select(BannersSelectors.channelsReference)
  zones$ = this.store.select(BannersSelectors.zonesReference)
  languages$ = this.store.select(BannersSelectors.languagesReference)
  labels$ = this.store.select(BannersSelectors.labelsReference)
  submitBannerDataIsLoading$ = this.store.select(BannersSelectors.isLoadingSubmitBanner)
  showDeleteButton$ =  this.store.select(BannersSelectors.showDeleteButton)
  formApiError$ = this.store.select(BannersSelectors.formServerError)
  drawer$ = this.store.select(BannersSelectors.drawerUI)
  fileId$ = this.store.select(BannersSelectors.fileIdChanges)
  uploadBlobLoader$ = this.store.select(BannersSelectors.uploadBlobLoader)

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  queryParams = {
    page: 0,
    pageSize: 3,
    search: "",
    sortDirection: "",
    sortBy: ""
  }

  bannerId = ""

  confirmationDialog = false

  ngOnInit() {
    this.route.queryParams
    .subscribe((queryParams: Params) => {
      const {search, sortBy, sortDirection, page, pageSize, bannerId, showForm} = queryParams

      const localQueries = {
        page,
        pageSize,
        search,
        sortDirection,
        sortBy
      }

      if (!deepEqual(this.queryParams, localQueries)) {
        this.store.dispatch(BannersListPageActions.changeQueryParams({queryParams: {search, sortBy, sortDirection, page, pageSize}}))
        this.queryParams = localQueries
      }

      if (bannerId && bannerId !== this.bannerId) {
        this.bannerId = bannerId
        this.store.dispatch(BannersListPageActions.tableRowClicked({editFlag: true, bannerId: bannerId}))
      }

      if(showForm) {
        this.store.dispatch(BannersListPageActions.drawerOpen())
      }
    })
  }

  drawerClose() {
    this.routeParamsChange({bannerId: null, showForm: null})
    this.store.dispatch(BannersListPageActions.closeDrawer())
    this.bannerId = ""
    this.confirmationDialog = false
  }

  openConfirmationModal() {
    this.confirmationDialog = true
  }

  closeConfirmationModal() {
    this.confirmationDialog = false
  }

  routeParamsChange(queryParams: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }

  showEditBannerForm(bannerId?: number | number) {
    if (bannerId) {
      this.routeParamsChange({bannerId: bannerId})
    } else {
      this.routeParamsChange({showForm: true})
    }

  }

  submitBannerData($event: {fileId: number, formData: Banner}) {
    const {fileId, formData} = $event
    const mergedBannerData = {...formData, id: this.bannerId, fileId: fileId}
    this.store.dispatch(BannersListPageActions.submitBannerData({bannerData: mergedBannerData, bannerId: this.bannerId}))
  }

  selectedFile(file: File) {
    const modifiedFile = fileReader(file)
    const fileForm = new FormData();
    fileForm.set('blob', modifiedFile)
    this.store.dispatch(BannersListPageActions.fileInputChanged({file: fileForm}))
  }

  deleteBanner() {
      this.store.dispatch(BannersListPageActions.deleteButtonClicked({bannerId: this.bannerId}))
  }
}
