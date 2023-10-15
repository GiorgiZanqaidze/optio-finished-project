import { Injectable } from '@angular/core';
import {forkJoin, Observable, Subject, switchMap} from "rxjs";
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BannerModel} from "../../shared/types/banner.model";
import {fileReader} from "../../shared/utilities/file-utils";
import {ApiService} from "../api/api.service";

type Input = string | null

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private apiService: ApiService) { }

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

  private getBannerById = new Subject<{editFlag: boolean, bannerId: number}>();

  setItem(data: {editFlag: boolean, bannerId: number}): void {
    this.getBannerById.next(data);
  }

  getBannerIdObservable(): Observable<{editFlag: boolean, bannerId: number}> {
    return this.getBannerById.asObservable();
  }

  imageName!: string
  fileFormData = new FormData()
  showDeleteButton = false

  setFormData(formData: BannerModel) {
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

  bannerId = ""

  onSubmitBannerData() {
    this.apiService.submitBlob(this.fileFormData).pipe(
      switchMap((blobResponse: any) => {

        const bannerId = localStorage.getItem('bannerId')
        if (bannerId) this.bannerId = JSON.parse(bannerId)

        const mergedSubmitData = {
          ...this.bannerForm.value,
          fileId: blobResponse.data.id,
          id: this.bannerId
        }
        return this.apiService.submitBannerForm(mergedSubmitData);
      })
    ).subscribe(() => {
      this.bannerForm.reset()
      this.bannerForm.clearValidators()
      this.bannerForm.updateValueAndValidity()
      sessionStorage.clear()
      localStorage.clear()
    });
  }

  selectFile(file: any) {
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

  getReferenceData(): Observable<{ channels: ReferenceDataModel[], zones: ReferenceDataModel[], labels: ReferenceDataModel[], languages: ReferenceDataModel[] }> {
    return forkJoin({
      channels: this.apiService.getChannels(),
      zones: this.apiService.getZones(),
      labels: this.apiService.getLabels(),
      languages: this.apiService.getLanguages()
    });
  }
}
