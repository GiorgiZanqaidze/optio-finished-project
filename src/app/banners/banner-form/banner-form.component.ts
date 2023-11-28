import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Store} from "@ngrx/store";
import {BannersStore} from "../store/state/banners.state";
import {
  setEditFileId,
  setFormData,
} from "../store/banners.actions";
import {
  editFileId,
  fileFormData,
  bannerFormData
} from 'src/app/banners/store/banners.selector';
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

  fileFormData!: FormData
  editFileId!: string | number | null


  constructor(
    private bannersStore: Store<{banners: BannersStore}>,
  ) {
    this.bannersStore.select(fileFormData).subscribe(data => {
      this.fileFormData = data
    })
    this.bannersStore.select(editFileId).subscribe(id => {
      this.editFileId = id
    })
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
      blob: this.fileFormData,
    }
    this.submitBannerData.emit(emitPayload)
  }

  ngOnInit() {
    const formData = sessionStorage.getItem('bannerFormData') as string;
    this.bannersStore.dispatch(setFormData({formData: JSON.parse(formData)}))

    this.bannerForm.valueChanges.subscribe((formData) => {
      sessionStorage.setItem('bannerFormData', JSON.stringify(formData));
    })

    this.bannersStore.select(bannerFormData).subscribe(formData => {
      this.bannerForm.patchValue(formData)
    })

    const editFileId = sessionStorage.getItem('editFileId') as string;
    this.bannersStore.dispatch(setEditFileId({id: editFileId}));

    this.bannerForm.controls['fileId'].valueChanges.subscribe((value) => {
      if (value !== this.editFileId) {
        this.bannersStore.dispatch(setEditFileId({id: null}))
        sessionStorage.removeItem('editFileId')
      }
    })
  }
}
