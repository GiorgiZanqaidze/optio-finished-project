import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent {
  bannerForm = new FormGroup({
    "name": new FormControl(''),
  })

  submitBannerData() {
    console.log(this.bannerForm.value)
  }

  constructor(private http: HttpClient) {
  }

  onSelectedFile(event: any) {
    const formData = new FormData();
      const file = event.target.files[0]
    formData.set('blob', file);

    this.http.post('https://development.api.optio.ai/api/v2/blob/upload',
        formData,
        {
            headers: {
                accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImludGVybnNoaXBAb3B0aW8uYWkiLCJzdWIiOiJpbnRlcm5zaGlwIiwiaW50ZXJuc2hpcElkIjoiZ2lvcmdpemFucWFpZHplb2ZmaWNpYWxAZ21haWwuY29tIiwiaWF0IjoxNjk2NTY4OTI3LCJleHAiOjE2OTc0MzI5Mjd9.eXt_P4gBxAH6QwUDRpmKixVLn0BgLAq09Kj3F8W8oMJQqid8Sjxi-xVR1PNnrfRCViWuvVHX8D4B6FLzX15X9Q"
            },
        }).subscribe(res => console.log(res))
  }

}
