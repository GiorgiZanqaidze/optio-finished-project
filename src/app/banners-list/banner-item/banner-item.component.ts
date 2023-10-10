import {Component, Input, OnInit} from '@angular/core';
import {BannerModel} from "../../types/banners/banner.model";
import {BannersService} from "../../services/banners/banners.service";

@Component({
  selector: 'app-banner-item',
  templateUrl: './banner-item.component.html',
  styleUrls: ['./banner-item.component.css']
})
export class BannerItemComponent implements OnInit{

  @Input() banner!: BannerModel



  constructor(private bannerService: BannersService  ) {
  }



  ngOnInit() {
    // this.bannerService.getBlob(this.banner.fileId).subscribe(
    //     (res: any) => {
    //       if (res.data[0] && res.data[0].fileName) {
    //         this.bannerImage = `https://development.api.optio.ai/api/v2/blob/${res.data[0].id}`;
    //         console.log(`File ID: ${res.data[0].id}`);
    //       }
    //     },
    //     (error) => {
    //       console.error('An error occurred while fetching the blob:', error);
    //     }
    // );
  }


}
