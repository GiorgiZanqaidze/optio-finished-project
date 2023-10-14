import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {FormsService} from "../../services/forms/forms.service";
import {map, switchMap} from "rxjs";
import {BannersService} from "../../services/banners/banners.service";
import {dataUrlToBlob, fileReader} from '../../shared/utilities/file-utils'
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import {BannerModel} from "../../shared/types/banner.model";

type Input = string | null

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit{

  constructor(
    private formService: FormsService,
    private bannerService: BannersService,
  ) {}
  fileFormData = new FormData()
  imageName!: string
  bannerId = ""
  channels!: ReferenceDataModel[]
  zones!: ReferenceDataModel[]
  languages!: ReferenceDataModel[]
  labels!: ReferenceDataModel[]
  editFlag!: boolean

  bannerForm = new FormGroup({
    "name": new FormControl<Input>(null, [Validators.required]),
    "zoneId": new FormControl<Input>(null, [Validators.required]),
    "active": new FormControl(null, [Validators.required]),
    "startDate": new FormControl<Input>(null, [Validators.required]),
    "endDate": new FormControl<Input>(null),
    "fileId": new FormControl<string | null | undefined>(null, [Validators.required]),
    "priority": new FormControl<Input>('', [Validators.required, Validators.min(1)]),
    "channelId": new FormControl<Input>(null, [Validators.required]),
    "language": new FormControl<Input>(null, [Validators.required]),
    "url": new FormControl<Input>(null, [Validators.required]),
    "labels": new FormControl<string[]>([])
  })


  submitBannerData() {
    this.formService.submitBlob(this.fileFormData).pipe(
      switchMap((blobResponse: any) => {

        const bannerId = localStorage.getItem('bannerId')
        if (bannerId) this.bannerId = JSON.parse(bannerId)

        const mergedSubmitData = {
          ...this.bannerForm.value,
          fileId: blobResponse.data.id,
          id: this.bannerId
        }
        return this.formService.submitBannerForm(mergedSubmitData);
      })
    ).subscribe(() => {
      this.bannerForm.reset()
      this.bannerForm.clearValidators()
      this.bannerForm.updateValueAndValidity()
      sessionStorage.clear()
      localStorage.clear()
    });
  }

  private selectFile(file: any) {
    const modifiedFile = fileReader(file)
    this.fileFormData.set('blob', modifiedFile);
    this.imageName = modifiedFile.name
    const fileField = this.bannerForm.get('fileId')
    fileField?.clearValidators()
  }

  onSelectedFile(event: any) {
    const file:File = event.target.files[0]
    this.selectFile(file)
  }

  ngOnInit() {

    this.bannerService.getBannerIdObservable()
      .subscribe((data) => {
        this.bannerService.fetchBannerById(data.bannerId)
          .pipe(map((data: any) => {
            const formData = data.data as BannerModel
            this.setFormData(formData)
          }))
          .subscribe(() => {
            const fileField = this.bannerForm.get('fileId')
            fileField?.clearValidators()
            fileField?.updateValueAndValidity()
          })
      })

    const formData = sessionStorage.getItem('bannerFormData');
    if (formData) this.setFormData(JSON.parse(formData));

    this.bannerForm.valueChanges.subscribe((formData) => {
      sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
    });

    const editFlag = localStorage.getItem('editFlag')
    if (editFlag) {
      const fileField = this.bannerForm.get('fileId')
      fileField?.clearValidators()
      fileField?.updateValueAndValidity()
    }

    const fileUrl = localStorage.getItem('fileDataUrl')
    const fileName = localStorage.getItem('fileName')
    const fileType = localStorage.getItem('fileType')

    if (fileUrl && fileType && fileName) {
      const file = dataUrlToBlob(fileUrl, fileName, fileType)
      this.selectFile(file)
    }

    this.formService.getReferenceData().subscribe((referenceData) => {
      this.channels = referenceData.channels
      this.zones = referenceData.zones
      this.languages = referenceData.languages
      this.labels = referenceData.labels
    })
  }

  private setFormData(formData: BannerModel) {
    this.bannerForm.patchValue({
      url: formData.url,
      channelId: formData.channelId,
      language: formData.language,
      name: formData.name,
      zoneId: formData.zoneId,
      priority: formData.priority,
      labels: formData.labels,
      endDate: formData.endDate,
      startDate: formData.startDate,
      active: formData.active,
      fileId: formData.fileId
    })

    this.imageName = JSON.stringify(formData.fileId)
  }

}
