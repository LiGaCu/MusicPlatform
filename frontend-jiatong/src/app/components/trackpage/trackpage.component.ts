import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../../services/getdata.service';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-trackpage',
  templateUrl: './trackpage.component.html',
  styleUrls: ['./trackpage.component.css']
})
export class TrackpageComponent implements OnInit {
  private navigationSubscription: any;

  public artistName: any;
  public trackName: any;
  public trackDetails: any;
  public nullTrackPicture: string = "https://yt3.ggpht.com/C-xe7nTkSvsZeluNi-Yu8kI9LN1caZvO4Y7PfggXpIYVo8I29lcUekyqbT-9otN_4m1Zu3YT=s900-c-k-c0x00ffffff-no-rj";
  
  public trackScore: any = {};
  public trackReview: any = [];

  public lyricScore: any = "0";
  public melodyScore: any = "0";
  public singerScore: any = "0";
  public mvScore: any = "0";
  public myReview: any = "";

  constructor(private route: ActivatedRoute,private router: Router, private getdataService:GetdataService,private sanitizer:DomSanitizer) { 
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
    this.trackName = this.route.snapshot.paramMap.get('trackName');
    this.artistName = this.route.snapshot.paramMap.get('artistName');
    this.getdataService.searchTrack(this.artistName,this.trackName).subscribe(res =>{
      this.trackDetails = res;
      this.trackDetails.strTrackThumb = this.trackDetails.strTrackThumb || this.nullTrackPicture;
      this.trackDetails.strTrack = this.trackDetails.strTrack || this.trackName;
      this.trackDetails.strArtist = this.trackDetails.strArtist || this.artistName;
      this.trackDetails.intDuration = this.trackDetails.intDuration && this.trackDetails.intDuration/60000;
      this.trackDetails.intDuration = this.trackDetails.intDuration || 0;
      if(this.trackDetails.strMusicVid){
        let index_vid = this.trackDetails.strMusicVid.indexOf("v=");
        if(index_vid!=-1){
          this.trackDetails.strMusicVid = "https://www.youtube.com/embed/" + this.trackDetails.strMusicVid.substring(index_vid+2);
        }
        this.trackDetails.strMusicVid = this.sanitizer.bypassSecurityTrustResourceUrl(this.trackDetails.strMusicVid);
      }

      this.trackScore.lyricScore = this.trackDetails.lyricScore || 0;
      this.trackScore.melodyScore = this.trackDetails.melodyScore || 0;
      this.trackScore.singerScore = this.trackDetails.singerScore || 0;
      this.trackScore.mvScore = this.trackDetails.mvScore || 0;
      this.trackReview = this.trackDetails.reviewContent;
      for(let i=0;i<this.trackReview.length;i++){
        this.trackReview[i].create_at = new Date(this.trackReview[i].create_at);         
      }
    });
  }
  submitRating(){
    if(this.lyricScore=="0" || this.melodyScore=="0" || this.singerScore=="0" || this.mvScore=="0"){
      alert("Please make sure choose all scores!");
    }else{
      this.getdataService.postScore(this.trackDetails.idTrack,this.lyricScore,this.melodyScore,this.singerScore,this.mvScore).subscribe(res =>{
        let temp: any = res;
        if(!temp.status){
          alert("Score submission failed!");
        }else{
          this.trackScore = res;
        }
      });
    }
  }
  submitReview(){
    if(this.myReview==""){
      alert("Please do not submit blank review!");
    }else{
      this.getdataService.postReview(this.trackDetails.idTrack,this.myReview).subscribe(res=>{
        let temp: any = res;
        if(!temp.status){
          alert("Review submission failed!");
        }else{
          this.trackReview = temp.reviewContent;
          for(let i=0;i<this.trackReview.length;i++){
            this.trackReview[i].create_at = new Date(this.trackReview[i].create_at); 
          }
        }
      });
    }
  }
}
