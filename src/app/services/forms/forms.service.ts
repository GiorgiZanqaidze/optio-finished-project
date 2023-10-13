import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment'
import {map} from "rxjs";
import {ChannelsInterface} from '../../shared/types/reference-data/C'
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
      .pipe(map((data: )))
  }
}
