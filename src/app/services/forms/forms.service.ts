import {Injectable} from '@angular/core';
import {forkJoin, Observable, Subject, switchMap} from "rxjs";
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BannerModel} from "../../shared/types/banner.model";
import {fileReader} from "../../shared/utilities/file-utils";
import {ApiService} from "../api/api.service";
import {drawerClose} from "../../store/drawer/drawer.action";
import {Store} from "@ngrx/store";
import {FormStore} from "../../store/form/form.reducer";

type Input = string | null

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(
    private apiService: ApiService,
    private drawerStore: Store<{drawer: boolean}>
  ) { }

  bannerForm = new FormGroup({
    "name": new FormControl<Input>(null, [Validators.required]),
    "zoneId": new FormControl<Input>(null, [Validators.required]),
    "active": new FormControl(null, [Validators.required]),
    "startDate": new FormControl<Input>(null, [Validators.required]),
    "endDate": new FormControl<Input>(null),
    "fileId": new FormControl<string | number | null>(null,  [Validators.required]),
    "priority": new FormControl<Input>('', [Validators.required, Validators.min(0)]),
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

  onDrawerClose() {
    this.drawerStore.dispatch(drawerClose({drawerState: false}))
    this.bannerForm.reset()
    this.imageName = ''
    this.showDeleteButton = false
    localStorage.clear();
    sessionStorage.clear()
  }

  imageName!: string
  fileFormData = new FormData()
  showDeleteButton = false
  editFileId!: null

  // setFormData(formData: BannerModel) {
  //   this.bannerForm.patchValue({
  //     url: formData.url,
  //     channelId: formData.channelId,
  //     language: formData.language,
  //     name: formData.name,
  //     zoneId: formData.zoneId,
  //     priority: formData.priority,
  //     labels: formData.labels,
  //     endDate: formData.endDate,
  //     startDate: formData.startDate,
  //     active: formData.active,
  //     fileId: formData.fileId
  //   })
  //
  //   this.bannerForm.patchValue({fileId: formData.fileId})
  // }

  bannerId!: string | null

  onSubmitBannerData() {
    const bannerId = localStorage.getItem('bannerId')
    if (bannerId) this.bannerId = JSON.parse(bannerId)
    if (!this.editFileId) {
      return this.apiService.submitBlob(this.fileFormData).pipe(
        switchMap((blobResponse: any) => {
          const mergedSubmitData = {
            ...this.bannerForm.value,
            fileId: blobResponse.data.id,
            id: this.bannerId
          };
          return this.apiService.submitBannerForm(mergedSubmitData);
        })
      )
    } else {
      const submitData = {
        ...this.bannerForm.value,
        fileId: this.editFileId,
        id: this.bannerId
      };
      return this.apiService.submitBannerForm(submitData)
    }
  }

  private handleFormSubmissionSuccess() {
    this.bannerForm.reset();
    this.showDeleteButton = false;
    sessionStorage.clear();
    localStorage.clear();
  }

  selectFile(file: any) {
    const modifiedFile = fileReader(file)
    this.fileFormData.set('blob', modifiedFile);
    this.imageName = modifiedFile.name
    const fileField = this.bannerForm.get('fileId')
    fileField?.setValue(modifiedFile.name)
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
