import {Component, OnInit} from '@angular/core';
import {FormsService} from "../../services/forms/forms.service";
import {dataUrlToBlob} from '../../shared/utilities/file-utils'
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import {filter, tap} from "rxjs";
import {BannerModel} from "../../shared/types/banner.model";
import {ApiService} from "../../services/api/api.service";
import {environment} from "../../../environments/environment";
import {BannersService} from "../../services/banners/banners.service";
import {Store} from "@ngrx/store";
import {drawerClose, drawerOpen} from "../../store/drawer/drawer.action";
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
import {bannerFormData, editFileId, fileFormData, showDeleteButton} from "../../store/form/form.selectors";

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit{
  constructor(
    public formService: FormsService,
    private apiService: ApiService,
    public bannerService: BannersService,
    private drawerStore: Store<{drawer: boolean}>,
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
  channels!: ReferenceDataModel[]
  zones!: ReferenceDataModel[]
  languages!: ReferenceDataModel[]
  labels!: ReferenceDataModel[]
  editFlag!: boolean
  fileFormData!: FormData
  showDeleteButton!: boolean
  editFileId!: null | number | string


  bannerForm = this.formService.bannerForm

  public readonly apiUrl = environment.ApiUrl

  submitBannerData() {
    const fileId = JSON.parse(sessionStorage.getItem('editFileId') as string)
    const editFlag = JSON.parse(localStorage.getItem('editFlag') as string)
    const bannerId = JSON.parse(localStorage.getItem('bannerId') as string)
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
      .subscribe((data) => {
        this.apiService.fetchBannerById(data.bannerId)
          .pipe(tap((banner: any) => {
            const formData = banner.data as BannerModel
            sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
            this.formService.bannerForm.patchValue(formData)
            const editFileId = banner.data.fileId
            this.formStore.dispatch(setEditFileId({id: editFileId}))
            this.formStore.dispatch(setDeleteButton({show: true}))
            this.formStore.dispatch(setBannerId({id: data.bannerId}))
            sessionStorage.setItem('editFileId', JSON.stringify(editFileId))
          }))
          .subscribe(() => {
            this.drawerStore.dispatch(drawerOpen({drawerState: true}))
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

    this.drawerStore.select('drawer').subscribe((drawer) => {
      if (JSON.parse(localStorage.getItem('drawerIsOpen') as string)) {
        this.formService.getReferenceData()
          .subscribe((referenceData) => {
            this.channels = referenceData.channels
            this.zones = referenceData.zones
            this.languages = referenceData.languages
            this.labels = referenceData.labels
          })
      }
    })
  }

  deleteBanner() {
    const bannerId = localStorage.getItem("bannerId") as string
    this.bannersStore.dispatch(deleteBanner({bannerId: JSON.parse(bannerId)}))
  }

  closeDrawer() { this.drawerStore.dispatch(drawerClose({drawerState: false})) }
}
