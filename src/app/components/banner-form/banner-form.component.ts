import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {environment} from "../../../environments/environment";

import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ReferenceData} from "../../shared/types/reference-data";
import {Banner} from "../../shared/types/banner";

type FormInput = string | null

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerFormComponent implements OnChanges{

  public readonly apiUrl = environment.ApiUrl

  @Input() channels$!: ReferenceData[] | null

  @Input() zones$!: ReferenceData[] | null

  @Input() languages$!: ReferenceData[] | null

  @Input() labels$!: ReferenceData[] | null

  @Input() submitBannerDataIsLoading$!: boolean | null

  @Input() showDeleteButton$!: boolean | null

  @Input() formApiError$!: string | null

  @Output() drawerClose = new EventEmitter()

  @Input() banner!: Banner | null

  @Output() submitBannerData = new EventEmitter()

  @Output() selectedFile = new EventEmitter()

  @Output() deleteBanner = new EventEmitter()

  @Input() fileId$!: string | number | null

  @Input() resetBannerForm!: null | boolean


  bannerForm = new FormGroup({
    "name": new FormControl<FormInput>(null, [Validators.required]),
    "zoneId": new FormControl<FormInput>(null, [Validators.required]),
    "active": new FormControl(null, [Validators.required]),
    "startDate": new FormControl<FormInput>(null, [Validators.required]),
    "endDate": new FormControl<FormInput>(null),
    "fileId": new FormControl<string | number | null>(null,  [Validators.required]),
    "priority": new FormControl<FormInput>('', [Validators.required, Validators.min(0)]),
    "channelId": new FormControl<FormInput>(null, [Validators.required]),
    "language": new FormControl<FormInput>(null, [Validators.required]),
    "url": new FormControl<FormInput>(null, [Validators.required]),
    "labels": new FormControl<string[]>([])
  })

  ngOnChanges(changes: SimpleChanges) {
    if (changes['banner']) {
      this.bannerForm.patchValue(this.banner as Banner)
    }

    if (changes['fileId$']) {
      this.bannerForm.patchValue({fileId: this.fileId$})
    }

    if (changes['resetBannerForm']) {
      this.bannerForm.reset()
    }
  }

  onDeleteBanner() {
      this.deleteBanner.emit()
  }

  onSelectedFile(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) this.selectedFile.emit(file)
  }

  onCloseDrawer() {
      this.drawerClose.emit()
  }

  onSubmitBannerData() {
    const editFlag = JSON.parse(localStorage.getItem('editFlag') as string)
    const bannerId = JSON.parse(localStorage.getItem('bannerId') as string)

    const emitPayload = {
      fileId: this.bannerForm.value.fileId,
      bannerId: bannerId,
      editFlag: editFlag,
      formData: this.bannerForm.value,
    }
    this.submitBannerData.emit(emitPayload)
  }
}
