import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {FormsService} from "../../services/forms/forms.service";
import {map, switchMap} from "rxjs";
import {BannersService} from "../../services/banners/banners.service";
import {dataUrlToBlob, fileReader} from '../../utilities/file-utils'

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
  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato']
  fileFormData = new FormData()
  imageName: string | null = null
  bannerId = ""

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


  submitBannerData() {
      this.formService.submitBlob(this.fileFormData).pipe(
          switchMap((blobResponse: any) => {
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
          this.bannerForm.patchValue(data.data)
        }))
        .subscribe(res => console.log(res))
    })

    this.bannerForm.valueChanges.subscribe((formData) => {
      sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
    });

    const bannerId = localStorage.getItem('bannerId')
    if (bannerId) this.bannerId = bannerId

    const formData = sessionStorage.getItem('bannerFormData');
    if (formData) this.bannerForm.setValue(JSON.parse(formData));

    const fileUrl = localStorage.getItem('fileDataUrl')
    const fileName = localStorage.getItem('fileName')
    const fileType = localStorage.getItem('fileType')

    if (fileUrl && fileType && fileName) {
      const file = dataUrlToBlob(fileUrl, fileName, fileType)
      this.selectFile(file)
    }
  }
}
