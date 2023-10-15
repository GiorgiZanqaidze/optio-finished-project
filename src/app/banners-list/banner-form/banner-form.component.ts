import {Component, OnInit} from '@angular/core';
import {FormsService} from "../../services/forms/forms.service";
import {dataUrlToBlob} from '../../shared/utilities/file-utils'
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import {map} from "rxjs";
import {BannerModel} from "../../shared/types/banner.model";
import {ApiService} from "../../services/api/api.service";

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit{

  constructor(
    public formService: FormsService,
    private apiService: ApiService
  ) {}
  bannerId = ""
  channels!: ReferenceDataModel[]
  zones!: ReferenceDataModel[]
  languages!: ReferenceDataModel[]
  labels!: ReferenceDataModel[]
  editFlag!: boolean

  bannerForm = this.formService.bannerForm

  submitBannerData() { this.formService.onSubmitBannerData() }

  onSelectedFile(event: Event) { this.formService.onSelectedFile(event) }

  ngOnInit() {
    this.formService.getBannerIdObservable()
      .subscribe((data) => {
        this.apiService.fetchBannerById(data.bannerId)
          .pipe(map((data: any) => {
            const formData = data.data as BannerModel
            sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
            this.formService.setFormData(formData)
          }))
          .subscribe(() => {
            const fileField = this.bannerForm.get('fileId')
            fileField?.clearValidators()
            fileField?.updateValueAndValidity()
          })
      })


    const formData = sessionStorage.getItem('bannerFormData');
    if (formData) this.formService.setFormData(JSON.parse(formData));

    this.formService.bannerForm.valueChanges.subscribe((formData) => {
      sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
    });

    const editFlag = localStorage.getItem('editFlag')
    if (editFlag) {
      const fileField = this.formService.bannerForm.get('fileId')
      fileField?.clearValidators()
      fileField?.updateValueAndValidity()
    }

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


}
