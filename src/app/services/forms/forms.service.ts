import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment'
import {forkJoin, map, Observable} from "rxjs";
import {ReferenceDataModel} from "../../shared/types/reference-data.model";
@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }

  submitBlob(formData: any) {
    return this.http.post('/blob/upload', formData)
  }

  submitBannerForm(formData:any) {
    return this.http.post('/banners/save', formData)
  }

  getChannels() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.channels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getZones() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.zones_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getLabels() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.labels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getLanguages() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.languages_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getReferenceData(): Observable<{ channels: ReferenceDataModel[], zones: ReferenceDataModel[], labels: ReferenceDataModel[], languages: ReferenceDataModel[] }> {
    return forkJoin({
      channels: this.getChannels(),
      zones: this.getZones(),
      labels: this.getLabels(),
      languages: this.getLanguages()
    });
  }


}
