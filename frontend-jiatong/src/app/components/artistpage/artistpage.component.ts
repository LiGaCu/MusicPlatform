import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../../services/getdata.service';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-artistpage',
  templateUrl: './artistpage.component.html',
  styleUrls: ['./artistpage.component.css']
})
export class ArtistpageComponent implements OnInit {
  private navigationSubscription: any;

  public artistName: any;
  public artistDetails: any;
  public nullProfilePicture: string = "data:image/png;base64,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";
  
  public twitterURL: string = "";
  public facebookURL: string = "";
  public twitter_icon: string="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACrUlEQVRYhe2WTUhUURSAj6EUrSKD0t69b8YJU9oIunIhQtQihCByGWSRqxCKIoh+lkFGbXNRc+99M04IIRQF1sJ+Nm0qNArdJrUI0nnn3Dej/XhbqGM6r5m50wxBeOAsHlzO9517zoMLsBH/TRhT48rgBFP0jCucZYoyXNB7JnGw1TMN64+zVLoDjNkEAADtQ6aOSX22XPbu+8bhQj9hEk1oKiSeyBxt9UxDROg+5tG46+HNXAE3mTnCJBpH6Wu28O642bLcaTg8J0GLTNHi0rf/sfkh7sgV4ULfWjloK8EkDhaFr0maiIpsl6PwJBdB/5KAh+L3Q67CR00js7wYvC0+t41L+mYjwBUtMInGlf7b9iGzdakLgTdC56b8gdyihASXQY9d9zmJly3S1K8WSmT3F1igae7hhX1xvWu9QEToPnsBmtjz2GzOn6VHk0WW6DsX+MAV+hyXQQ8T6RiTeNi6e6nHQq8zKrJdTOrAqqCiH7YCrkQvD+5IfZ4n/WNcBP1c0nw5cy1ZwMPr+QJecLWa0LUL6A/kb3OhJaxwRuK6LfyXUv7T6ndPn0PhAABNcr6ZS/pUVQEPxR8FAAAa72YYF/p1tQRiqUxnQYEWaerdewutjkenmaQvlRWg5wXhAADRYbOTKdRVuQGRPlhUAADASQRXKg+n0ZLgAABgTA2XdLticEUzzojZXrrAioSiXlfh1F/O/WckTt128HXBRDrGFL6y/uUULXBFveWTjalxk/4hruiD/bWjjg6nD1gz24dMXSyV6XRFcIkpnC5z5u9YKt1RMjQqsl1c6jEucW710WifXKHPhH8Gxk2tdecwbmqZ0se5oBfWcI8mXRlcDnsxlRU8mW7iCTzFFN5xlP+GKZphUgfLj8+vrsIpJmiUeXix0ZvfWxHoRvzL+AXFnK2J8UgF/AAAAABJRU5ErkJggg==";
  public facebook_icon: string="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA7ElEQVRYhWOwjpoRZBU5/ZV15Iz/9MRWEdNf20bODGAYCMvhjoic/ophoCyH4VEHUNUBzglz/k9ffuL/nYdv/v/69ec/OqCpA/wyF/2//+QdhqV0cYBN1Iz/l26+wGs5TR1Q1beToOU0dcD+k3cH1gEv33zGsOzlm8//i9q3/neMm41XL1Uc8OfPXwwHFLVvJUovVRyADRDyOc0dQKzeoekAcsCb918H1gFHzj4YWAfMXXN6YB1Q2rV9YB3gl7loGOWCUQeMOmDUAaMOoKoDrCKmvx4wB0TMeMlgGzkzgNIeMlkOiJjx0jpimh8AnpIM8LFP2hYAAAAASUVORK5CYII=";

  public artistAlbums: any = [];
  public nullAlbumPicture: string = "https://cdn.iconscout.com/icon/premium/png-512-thumb/music-disc-1831868-1554719.png";

  constructor(private route: ActivatedRoute,private router: Router, private getdataService:GetdataService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.fetchData();
      }
    });
  }

  ngOnInit(): void {
  }

  fetchData(){
    this.twitterURL = "";
    this.facebookURL = "";

    this.artistName = this.route.snapshot.paramMap.get('artistName');

    this.getdataService.searchArtist(this.artistName).subscribe(res =>{
      this.artistDetails = res;
      this.artistDetails.strArtistThumb = this.artistDetails.strArtistThumb || this.nullProfilePicture;
      this.artistDetails.strArtist = this.artistDetails.strArtist || this.artistName;
      if(this.artistDetails.strTwitter){
        this.twitterURL = "https://" + this.artistDetails.strTwitter;
      }
      if(this.artistDetails.strFacebook){
        this.facebookURL = "https://" + this.artistDetails.strFacebook;
      }

      this.artistAlbums = [];
      if(this.artistDetails.idArtist){
        this.fetchAlbums();
      }
    });
  }
  fetchAlbums(){
    this.getdataService.searchAlbums(this.artistDetails.idArtist).subscribe(res =>{
      this.artistAlbums = res;
      for(let i=0;i<this.artistAlbums.length;i++){
        this.artistAlbums[i].strAlbumThumb = this.artistAlbums[i].strAlbumThumb || this.nullAlbumPicture;
      }
    });
  }
  routeToAlbum(albumName:string){
    this.router.navigate(['/album',this.artistName,albumName]);
  }
}
