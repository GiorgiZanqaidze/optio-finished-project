import {Component, OnInit} from '@angular/core';
import {FormsService} from "../../services/forms/forms.service";
import {dataUrlToBlob} from '../../shared/utilities/file-utils'
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import {map} from "rxjs";
import {BannerModel} from "../../shared/types/banner.model";
import {ApiService} from "../../services/api/api.service";
import {environment} from "../../../environments/environment";
import {BannersService} from "../../services/banners/banners.service";
import {Store} from "@ngrx/store";
import {drawerClose, drawerOpen} from "../../store/drawer/drawer.action";
import {BannersStore} from "../../store/banners/banners.reducer";
import {deleteBanner} from "../../store/banners/banners.actions";

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
    private bannersStore: Store<{banners: BannersStore}>
  ) {

  }
  bannerId = ""
  channels!: ReferenceDataModel[]
  zones!: ReferenceDataModel[]
  languages!: ReferenceDataModel[]
  labels!: ReferenceDataModel[]
  editFlag!: boolean

  bannerForm = this.formService.bannerForm

  public readonly apiUrl = environment.ApiUrl

  submitBannerData() {
    this.formService.onSubmitBannerData().subscribe((res: any) =>  {
      this.bannerForm.reset();
      this.formService.showDeleteButton = false;
      this.bannerService.addOrEditBanner(res.data)
      this.drawerStore.dispatch(drawerClose({drawerState: false}))
      console.log(res)
      sessionStorage.clear();
      localStorage.clear();
    })
  }

  onSelectedFile(event: Event) { this.formService.onSelectedFile(event) }

  ngOnInit() {
    this.formService.getBannerIdObservable()
      .subscribe((data) => {
        this.apiService.fetchBannerById(data.bannerId)
          .pipe(map((data: any) => {
            this.drawerStore.dispatch(drawerOpen({drawerState: true}))
            const formData = data.data as BannerModel
            sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
            this.formService.setFormData(formData)
            const editFileId = data.data.fileId
            this.formService.editFileId = editFileId
            this.formService.showDeleteButton = true
            sessionStorage.setItem('editFileId', JSON.stringify(editFileId))
          }))
          .subscribe(() => {
          })
      })


    const formData = sessionStorage.getItem('bannerFormData');
    if (formData) this.formService.setFormData(JSON.parse(formData));

    this.formService.bannerForm.valueChanges.subscribe((formData) => {
      sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
    })

    const editFileId = sessionStorage.getItem('editFileId');
    if (editFileId) this.formService.editFileId = JSON.parse(editFileId);

    this.formService.bannerForm.controls.fileId.valueChanges.subscribe((value) => {
      if (value !== this.formService.editFileId) {
        this.formService.editFileId = null
        sessionStorage.removeItem('editFileId')
      }
    })

    const editFlag = localStorage.getItem('editFlag')
    if (editFlag && JSON.parse(editFlag)) { this.formService.showDeleteButton = true }

    const fileUrl = localStorage.getItem('fileDataUrl')
    const fileName = localStorage.getItem('fileName')
    const fileType = localStorage.getItem('fileType')

    if (fileUrl && fileType && fileName) {
      const file = dataUrlToBlob(fileUrl, fileName, fileType)
      this.formService.selectFile(file)
    }

    this.formService.getReferenceData().subscribe((referenceData) => {
      this.channels = referenceData.channels
      this.zones = referenceData.zones
      this.languages = referenceData.languages
      this.labels = referenceData.labels
    })
  }

  deleteBanner() {
    const bannerId = localStorage.getItem("bannerId")
    if (bannerId) this.bannersStore.dispatch(deleteBanner({bannerId: JSON.parse(bannerId)}))
  }

  closeDrawer() { this.drawerStore.dispatch(drawerClose({drawerState: false})) }

}
