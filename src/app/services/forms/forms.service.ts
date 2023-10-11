import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

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
}
