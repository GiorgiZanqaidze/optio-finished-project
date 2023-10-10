import { Component } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormsService} from "../../services/forms/forms.service";
import {switchMap} from "rxjs";

type Input = string | null


@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent {

    constructor(private formService: FormsService) {
    }

    toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato']

    imageName: string | null = null

  bannerForm = new FormGroup({
    "name": new FormControl<Input>(null, [Validators.required]),
      "zoneId": new FormControl<Input>(null, [Validators.required]),
      "active": new FormControl<Input>(null, [Validators.required]),
      "startDate": new FormControl<Input>(null, [Validators.required]),
      "endDate": new FormControl<Input>(null, ),
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
      ).subscribe((bannerResponse) => {
          console.log('Second request response:', bannerResponse);
      });
  }

  onSelectedFile(event: any) {
    const file:any = event.target.files[0]
      console.log(event.target.files[0].name)
      this.imageName = event.target.files[0].name
      this.fileFormData.set('blob', file);
    const fileField = this.bannerForm.get('fileId')
      fileField?.clearValidators()

  }

}
