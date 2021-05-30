import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../../services/getdata.service';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-albumpage',
  templateUrl: './albumpage.component.html',
  styleUrls: ['./albumpage.component.css']
})
export class AlbumpageComponent implements OnInit {
  private navigationSubscription: any;

  public artistName: any;
  public albumName: any;
  public albumDetails: any;
  public nullAlbumPicture: string = "https://cdn.iconscout.com/icon/premium/png-512-thumb/music-disc-1831868-1554719.png";

  public albumTracks: any = [];
  public nullTrackPicture: string = "https://yt3.ggpht.com/C-xe7nTkSvsZeluNi-Yu8kI9LN1caZvO4Y7PfggXpIYVo8I29lcUekyqbT-9otN_4m1Zu3YT=s900-c-k-c0x00ffffff-no-rj";

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
    this.albumName = this.route.snapshot.paramMap.get('albumName');
    this.artistName = this.route.snapshot.paramMap.get('artistName');

    this.getdataService.searchAlbum(this.artistName,this.albumName).subscribe(res =>{
      this.albumDetails = res;
      this.albumDetails.strAlbumThumb = this.albumDetails.strAlbumThumb || this.nullAlbumPicture;
      this.albumDetails.strAlbumStripped = this.albumDetails.strAlbumStripped || this.albumName;
      this.albumDetails.strArtistStripped = this.albumDetails.strArtistStripped || this.artistName;
      this.albumDetails.intScore = this.albumDetails.intScore || 0;

      this.albumTracks = [];
      if(this.albumDetails.idAlbum){
        this.fetchTracks();
      }
    });
  }
  fetchTracks(){
    this.getdataService.searchTracks(this.albumDetails.idAlbum).subscribe(res =>{
      this.albumTracks = res;
      for(let i=0;i<this.albumTracks.length;i++){
        this.albumTracks[i].strTrackThumb = this.albumTracks[i].strTrackThumb || this.nullTrackPicture;
        this.albumTracks[i].intDuration = this.albumTracks[i].intDuration && this.albumTracks[i].intDuration/60000;
        this.albumTracks[i].intDuration = this.albumTracks[i].intDuration || 0;
      }
    });
  }
  routeToTrack(trackName:string){
    this.router.navigate(['/track',this.artistName,trackName]);
  }
}
