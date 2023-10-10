import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class BannersService {

  constructor(
    private http: HttpClient
  ) { }

  fetchBanners(searchInput: string, page: number) {
    return this.http.post('https://development.api.optio.ai/api/v2/banners/find',
      {
        search:searchInput,
        "pageSize": 4,
        "pageIndex": page,
      },
      {
        headers: {
          accept: "application/json",
          Authorization: "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImludGVybnNoaXBAb3B0aW8uYWkiLCJzdWIiOiJpbnRlcm5zaGlwIiwiaW50ZXJuc2hpcElkIjoiZ2lvcmdpemFucWFpZHplb2ZmaWNpYWxAZ21haWwuY29tIiwiaWF0IjoxNjk2NTY4OTI3LCJleHAiOjE2OTc0MzI5Mjd9.eXt_P4gBxAH6QwUDRpmKixVLn0BgLAq09Kj3F8W8oMJQqid8Sjxi-xVR1PNnrfRCViWuvVHX8D4B6FLzX15X9Q"
        },
      })
  }

  getBlob(fileId: any) {
      return this.http.get(`https://development.api.optio.ai/api/v2/blob/${fileId}`,
          {
              headers: {
                  accept: "application/json",
                  Authorization: "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImludGVybnNoaXBAb3B0aW8uYWkiLCJzdWIiOiJpbnRlcm5zaGlwIiwiaW50ZXJuc2hpcElkIjoiZ2lvcmdpemFucWFpZHplb2ZmaWNpYWxAZ21haWwuY29tIiwiaWF0IjoxNjk2NTY4OTI3LCJleHAiOjE2OTc0MzI5Mjd9.eXt_P4gBxAH6QwUDRpmKixVLn0BgLAq09Kj3F8W8oMJQqid8Sjxi-xVR1PNnrfRCViWuvVHX8D4B6FLzX15X9Q"
              },
          })
  }
}
