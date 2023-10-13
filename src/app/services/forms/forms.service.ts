import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment'
import {map} from "rxjs";
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
    return this.http.post('/reference-data/find', {typeId: environment.channels_type_id, includes:['key', 'name']})
      .pipe(map((data: any) => {
        const channels: ReferenceDataModel[] = data.data.entities
        return channels
      }))
  }

  getZones() {
    return this.http.post('/reference-data/find', {typeId: environment.zones_type_id, includes:['key', 'name']})
      .pipe(map((data: any) => {
        const channels: ReferenceDataModel[] = data.data.entities
        return channels
      }))
  }


}
