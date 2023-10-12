import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {FormsService} from "../../services/forms/forms.service";
import {map, switchMap} from "rxjs";
import {BannersService} from "../../services/banners/banners.service";
import {SessionStorageService} from "../../services/SessionStorage/session-storage.service";

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
    private sessionStorageService: SessionStorageService
  ) {}
  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato']

  imageName: string | null = null

  bannerForm = new FormGroup({
    "name": new FormControl<Input>(null, [Validators.required]),
    "zoneId": new FormControl<Input>(null, [Validators.required]),
    "active": new FormControl<Input>(null, [Validators.required]),
    "startDate": new FormControl<Input>(null, [Validators.required]),
    "endDate": new FormControl<Input>(null),
    "fileId": new FormControl(null, [Validators.required]),
    "priority": new FormControl<Input>('', [Validators.required, Validators.min(1)]),
    "channelId": new FormControl<Input>(null, [Validators.required]),
    "language": new FormControl<Input>(null, [Validators.required]),
    "url": new FormControl<Input>(null, [Validators.required]),
    "labels": new FormControl<string[]>([])
  })

  fileFormData = new FormData()

  submitBannerData() {
      this.formService.submitBlob(this.fileFormData).pipe(
          switchMap((blobResponse: any) => {
              const mergedSubmitData = {
                  ...this.bannerForm.value,
                  fileId: blobResponse.data.id
              }
              return this.formService.submitBannerForm(mergedSubmitData);
          })
      ).subscribe(() => {
        this.bannerForm.reset()
        this.bannerForm.clearValidators()
        sessionStorage.clear()
        localStorage.clear()
      });
  }

  private selectFile(file: any) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl: any = e.target?.result;
        if (dataUrl) {
          localStorage.setItem('fileDataUrl', dataUrl.toString());
          localStorage.setItem('fileName', file.name)
          localStorage.setItem('fileType', file.type)
        }
      };
      reader.readAsDataURL(file);
    }
    this.fileFormData.set('blob', file);
    this.imageName = file.name
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
          this.bannerForm.patchValue(data.data)
        }))
        .subscribe(res => console.log(res))
    })

    this.bannerForm.valueChanges.subscribe((formData) => {
      this.sessionStorageService.setItem('bannerFormData', JSON.stringify(formData));
    });

    const formData = this.sessionStorageService.getItem('bannerFormData');
    if (formData)  this.bannerForm.setValue(formData);
    const fileUrl = localStorage.getItem('fileDataUrl')
    const fileName = localStorage.getItem('fileName')
    const fileType = localStorage.getItem('fileType')


    if (fileUrl !== null) {
      if (fileName !== null) {
        if (fileType !== null) {
          const file = this.dataUrlToBlob(fileUrl, fileName, fileType)
          this.selectFile(file)
        }
      }
    }
  }
  private dataUrlToBlob(dataUrl: string, fileName: string, fileType: string) {
    const parts = dataUrl.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const byteCharacters = atob(parts[1]);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    const blob =  new Blob([byteArray], { type: contentType });
    return new File([blob], fileName, { type: fileType });
  }
}
