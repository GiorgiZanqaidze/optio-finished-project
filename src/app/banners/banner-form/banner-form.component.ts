import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {dataUrlToBlob} from '../../shared/utilities/file-utils'
import {environment} from "../../../environments/environment";
import {Store} from "@ngrx/store";
import {BannersStore} from "../store/banners.reducer";
import {
  deleteBanner,
  setDeleteButton,
  selectFile,
  setEditFileId,
  setFormData,
  startSubmitBannerLoading,
  openEditForm,
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


  fileFormData!: FormData
  editFileId!: string | number | null

  onCloseDrawer() {
    this.drawerClose.emit()
  }

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

  onSelectedFile(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) this.bannersStore.dispatch(selectFile({file: file}))
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

    const editFlag = localStorage.getItem('editFlag')
    if (editFlag && JSON.parse(editFlag)) {
      this.bannersStore.dispatch(setDeleteButton({show: true}))
      this.bannersStore.dispatch(openEditForm())
    }

    const fileUrl = localStorage.getItem('fileDataUrl')
    const fileName = localStorage.getItem('fileName')
    const fileType = localStorage.getItem('fileType')

    if (fileUrl && fileType && fileName) {
      const file = dataUrlToBlob(fileUrl, fileName, fileType)
      if (file) this.bannersStore.dispatch(selectFile({file: file}))
    }
  }

  deleteBanner() {
    const bannerId = localStorage.getItem("bannerId") as string
    this.bannersStore.dispatch(startSubmitBannerLoading())
    this.bannersStore.dispatch(deleteBanner({bannerId: JSON.parse(bannerId)}))
  }
}
