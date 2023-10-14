import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment'
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BannerModel} from "../../shared/types/banner.model";
import {fileReader} from "../../shared/utilities/file-utils";
import {BannersService} from "../banners/banners.service";

type Input = string | null

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient, private bannersService: BannersService) { }

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

  imageName!: string
  fileFormData = new FormData()

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
    this.submitBlob(this.fileFormData).pipe(
      switchMap((blobResponse: any) => {

        const bannerId = localStorage.getItem('bannerId')
        if (bannerId) this.bannerId = JSON.parse(bannerId)

        const mergedSubmitData = {
          ...this.bannerForm.value,
          fileId: blobResponse.data.id,
          id: this.bannerId
        }
        return this.submitBannerForm(mergedSubmitData);
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

  submitBlob(formData: any) {
    return this.http.post('/blob/upload', formData)
  }

  submitBannerForm(formData:any) {
    return this.http.post('/banners/save', formData)
  }

  getChannels() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.channels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getZones() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.zones_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getLabels() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.labels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getLanguages() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.languages_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getReferenceData(): Observable<{ channels: ReferenceDataModel[], zones: ReferenceDataModel[], labels: ReferenceDataModel[], languages: ReferenceDataModel[] }> {
    return forkJoin({
      channels: this.getChannels(),
      zones: this.getZones(),
      labels: this.getLabels(),
      languages: this.getLanguages()
    });
  }

  bannerEditObservable() {
    this.bannersService.getBannerIdObservable()
      .subscribe((data) => {
        this.bannersService.fetchBannerById(data.bannerId)
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
  }
}
