import {Injectable} from '@angular/core';
import {forkJoin, Observable, Subject} from "rxjs";
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../api/api.service";

type Input = string | null

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(
    private apiService: ApiService,
  ) {}

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

  getReferenceData(): Observable<{ channels: ReferenceDataModel[], zones: ReferenceDataModel[], labels: ReferenceDataModel[], languages: ReferenceDataModel[] }> {
    return forkJoin({
      channels: this.apiService.getChannels(),
      zones: this.apiService.getZones(),
      labels: this.apiService.getLabels(),
      languages: this.apiService.getLanguages()
    });
  }
}
