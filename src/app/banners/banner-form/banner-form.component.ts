import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from "../../../environments/environment";

import {FormGroup} from "@angular/forms";
import {ReferenceData} from "../../shared/types/reference-data";

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
})
export class BannerFormComponent implements OnInit{

  public readonly apiUrl = environment.ApiUrl

  @Input() channels$!: ReferenceData[] | null

  @Input() zones$!: ReferenceData[] | null

  @Input() languages$!: ReferenceData[] | null

  @Input() labels$!: ReferenceData[] | null

  @Input() submitBannerDataIsLoading$!: boolean | null

  @Input() showDeleteButton$!: boolean | null

  @Input() formApiError$!: string | null

  @Output() drawerClose = new EventEmitter<any>()

  @Input() bannerForm!: FormGroup

  @Output() submitBannerData = new EventEmitter()

  @Output() selectedFile = new EventEmitter()

  @Output() deleteBanner = new EventEmitter()

  onDeleteBanner() {
      const bannerId = localStorage.getItem("bannerId") as string
      this.deleteBanner.emit(bannerId)
  }

  onSelectedFile(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) this.selectedFile.emit(file)
  }

  onCloseDrawer() {
      this.drawerClose.emit()
  }

  onSubmitBannerData() {
    const fileId = sessionStorage.getItem('editFileId')
    const editFlag = JSON.parse(localStorage.getItem('editFlag') as string)
    const bannerId = JSON.parse(localStorage.getItem('bannerId') as string)
    const emitPayload = {
      fileId: fileId,
      bannerId: bannerId,
      editFlag: editFlag,
      formData: this.bannerForm.value,
    }
    this.submitBannerData.emit(emitPayload)
  }

  ngOnInit() {
    this.bannerForm.valueChanges.subscribe((formData) => {
      sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
    })
  }
}
