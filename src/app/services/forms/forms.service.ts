import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }

  submitBlob(formData: any) {
    return this.http.post('https://development.api.optio.ai/api/v2/blob/upload', formData)
  }

  submitBannerForm(formData:any) {
    return this.http.post('https://development.api.optio.ai/api/v2/banners/save', formData)
  }
}
