import {Component, OnInit} from '@angular/core';
import {FormsService} from "../../services/banners/forms.service";
import {dataUrlToBlob} from '../../shared/utilities/file-utils'
import {tap} from "rxjs";
import {Banner} from "../../shared/types/banner";
import {ApiService} from "../../services/api/api.service";
import {environment} from "../../../environments/environment";
import {Store} from "@ngrx/store";
import {drawerToggle, startSubmitBannerLoading, stopSubmitBannerLoading} from "../../store/UI/UI.action";
import {BannersStore} from "../../store/banners/banners.reducer";
import { deleteBanner} from "../../store/banners/banners.actions";
import {FormStore} from "../../store/form/form.reducer";
import {
  selectFile,
  setBannerId,
  setDeleteButton,
  setEditFileId,
  setFormData, submitBannerData,
  submitFormData
} from "../../store/form/form.actions";
import {bannerFormData, channelsReference, editFileId, fileFormData, formServerError, labelsReference, languagesReference, showDeleteButton, zonesReference} from "../../store/form/form.selectors";
import { isLoadingSubmitBanner} from "../../store/UI/UI.selectors";

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
})
export class BannerFormComponent implements OnInit{

  formApiError$ = this.formStore.select(formServerError)
  channels$ = this.formStore.select(channelsReference)
  zones$ = this.formStore.select(zonesReference)
  languages$ = this.formStore.select(languagesReference)
  labels$ = this.formStore.select(labelsReference)
  submitBannerDataIsLoading$ = this.UIStore.select(isLoadingSubmitBanner)


  editFlag!: boolean
  fileFormData!: FormData
  showDeleteButton!: boolean
  editFileId!: null | number | string

  constructor(
    public formService: FormsService,
    private apiService: ApiService,
    private UIStore: Store<{UI: boolean}>,
    private bannersStore: Store<{banners: BannersStore}>,
    private formStore: Store<{form: FormStore}>
  ) {
    this.formStore.select(bannerFormData).subscribe((form) => {
      this.formService.bannerForm.patchValue(form)
    })
    this.formStore.select(fileFormData).subscribe(data => {
      this.fileFormData = data
    })
    this.formStore.select(showDeleteButton).subscribe(show => {
      this.showDeleteButton = show
    })
    this.formStore.select(editFileId).subscribe(id => this.editFileId = id)
  }


  bannerForm = this.formService.bannerForm

  public readonly apiUrl = environment.ApiUrl

  submitBannerData() {
    const fileId = JSON.parse(sessionStorage.getItem('editFileId') as string)
    const editFlag = JSON.parse(localStorage.getItem('editFlag') as string)
    const bannerId = JSON.parse(localStorage.getItem('bannerId') as string)
    this.UIStore.dispatch(startSubmitBannerLoading())
    if (!fileId) {
      this.formStore.dispatch(submitFormData({data: this.bannerForm.value, blob: this.fileFormData}))
    } else {
      const mergedBannerData = {...this.formService.bannerForm.value, id: bannerId, fileId: fileId}
      this.formStore.dispatch(submitBannerData({bannerData: mergedBannerData, editFlag}))
    }
  }

  onSelectedFile(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) this.formStore.dispatch(selectFile({file: file}))
  }

  ngOnInit() {
    this.formService.getBannerIdObservable()
      .pipe(
        tap(() => {
          this.UIStore.dispatch(startSubmitBannerLoading());
          this.UIStore.dispatch(drawerToggle({drawerState: true}))
        })
      )
      .subscribe((data) => {
        this.apiService.fetchBannerById(data.bannerId)
          .pipe(tap((banner: any | null) => {
            const formData = banner.data as Banner
            sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
            this.formService.bannerForm.patchValue(formData)
            const editFileId = banner.data.fileId
            this.formStore.dispatch(setEditFileId({id: editFileId}))
            this.formStore.dispatch(setDeleteButton({show: true}))
            this.formStore.dispatch(setBannerId({id: data.bannerId}))
            sessionStorage.setItem('editFileId', JSON.stringify(editFileId))
          }))
          .subscribe(() => {
            this.UIStore.dispatch(stopSubmitBannerLoading())
          })
      })


    const formData = sessionStorage.getItem('bannerFormData') as string;
    this.formStore.dispatch(setFormData({formData: JSON.parse(formData)}))

    this.formService.bannerForm.valueChanges.subscribe((formData) => {
      sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
    })

    const editFileId = sessionStorage.getItem('editFileId') as string;
    this.formStore.dispatch(setEditFileId({id: editFileId}));

    this.formService.bannerForm.controls.fileId.valueChanges.subscribe((value) => {
      if (value !== this.editFileId) {
        this.formStore.dispatch(setEditFileId({id: null}))
        sessionStorage.removeItem('editFileId')
      }
    })

    const editFlag = localStorage.getItem('editFlag')
    if (editFlag && JSON.parse(editFlag)) { this.formStore.dispatch(setDeleteButton({show: true})) }

    const fileUrl = localStorage.getItem('fileDataUrl')
    const fileName = localStorage.getItem('fileName')
    const fileType = localStorage.getItem('fileType')

    if (fileUrl && fileType && fileName) {
      const file = dataUrlToBlob(fileUrl, fileName, fileType)
      if (file) this.formStore.dispatch(selectFile({file: file}))
    }
  }

  deleteBanner() {
    const bannerId = localStorage.getItem("bannerId") as string
    this.bannersStore.dispatch(deleteBanner({bannerId: JSON.parse(bannerId)}))
  }

  closeDrawer() { this.UIStore.dispatch(drawerToggle({drawerState: false})) }
}
