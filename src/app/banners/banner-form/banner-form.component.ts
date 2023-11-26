import {Component, OnInit} from '@angular/core';
import {FormsService} from "../../services/banners/forms.service";
import {dataUrlToBlob} from '../../shared/utilities/file-utils'
import {ApiService} from "../../services/api/api.service";
import {environment} from "../../../environments/environment";
import {Store} from "@ngrx/store";
import {drawerToggle} from "../../store/UI/UI.action";
import {BannersStore} from "../../store/banners/banners.reducer";
import {
  deleteBanner,
  setDeleteButton,
  submitBannerData,
  submitFormData,
  selectFile,
  setEditFileId,
  setFormData,
  startSubmitBannerLoading,
} from "../../store/banners/banners.actions";
import {FormStore} from "../../store/form/form.reducer";
import {  channelsReference, fileFormData, formServerError, labelsReference, languagesReference, zonesReference} from "../../store/form/form.selectors";
import {editFileId, isLoadingSubmitBanner, showDeleteButton} from 'src/app/store/banners/banners.selector';

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
  submitBannerDataIsLoading$ = this.bannersStore.select(isLoadingSubmitBanner)


  editFlag!: boolean
  fileFormData!: FormData
  showDeleteButton!: boolean
  editFileId!: null | number | string

  constructor(
    public formService: FormsService,
    private apiService: ApiService,
    // private UIStore: Store<{UI: boolean}>,
    private bannersStore: Store<{banners: BannersStore}>,
    private formStore: Store<{form: FormStore}>
  ) {

    this.formStore.select(fileFormData).subscribe(data => {
      this.fileFormData = data
    })
    this.formStore.select(showDeleteButton).subscribe(show => {
      this.showDeleteButton = show
    })
    this.bannersStore.select(editFileId).subscribe(id => {
      this.editFileId = id
    })
  }


  bannerForm = this.formService.bannerForm

  public readonly apiUrl = environment.ApiUrl

  submitBannerData() {
    const fileId = JSON.parse(sessionStorage.getItem('editFileId') as string)
    const editFlag = JSON.parse(localStorage.getItem('editFlag') as string)
    const bannerId = JSON.parse(localStorage.getItem('bannerId') as string)
    this.bannersStore.dispatch(startSubmitBannerLoading())
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
    if (editFlag && JSON.parse(editFlag)) { this.bannersStore.dispatch(setDeleteButton({show: true})) }

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

  closeDrawer() { this.bannersStore.dispatch(drawerToggle({drawerState: false})) }
}
