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
  ) {
  }
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
          const queryParams = {drawerIsOpen: false, bannerId: null, editFlag: false}
          this.bannerService.onRouteParamsChange(queryParams)
      });
  }

  onSelectedFile(event: any) {
    const file:any = event.target.files[0]
    this.imageName = event.target.files[0].name
    this.fileFormData.set('blob', file);
    const fileField = this.bannerForm.get('fileId')
    fileField?.clearValidators()
  }

  ngOnInit() {
    this.bannerService.getBannerIdObservable()
      .subscribe((data) => {
      this.bannerService.fetchBannerById(data.bannerId)
        .pipe(map((data: any) => {
          console.log(data.data)
              this.bannerForm.patchValue(data.data)
        }))
        .subscribe(res => console.log(res))
    })
    this.bannerForm.valueChanges.subscribe((formData) => {
      this.sessionStorageService.setItem('bannerFormData', JSON.stringify(formData));
    });
    const formData = this.sessionStorageService.getItem('bannerFormData');
    if (formData) {
      this.bannerForm.setValue(formData);
    }
  }
}
