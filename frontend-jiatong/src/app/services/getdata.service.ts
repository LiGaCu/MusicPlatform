import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {
  serverURL: string = "http://ec2-18-144-45-158.us-west-1.compute.amazonaws.com:8080";
  //serverURL: string = "http://localhost:8080";
  constructor(private httpClient: HttpClient) { }

  searchArtist(artist_name: string){
    let URL = this.serverURL + "/api/artist_search";
    return this.httpClient.get(URL,{params:{"artist_name":artist_name}});
  }
  searchAlbums(artist_id: string){
    let URL = this.serverURL + "/api/album_artist";
    return this.httpClient.get(URL,{params:{"id":artist_id}});
  }

  searchAlbum(artist_name: string,album_name: string){
    let URL = this.serverURL + "/api/album_search";
    return this.httpClient.get(URL,{params:{"artist_name":artist_name,"album_name":album_name}});
  }
  searchTracks(album_id: string){
    let URL = this.serverURL + "/api/track_album";
    return this.httpClient.get(URL,{params:{"id":album_id}});
  }
  searchTrack(artist_name: string,track_name: string){
    let URL = this.serverURL + "/api/track_search";
    return this.httpClient.get(URL,{params:{"artist_name":artist_name,"track_name":track_name}});
  }

  postScore(track_id: string, lyric_score: string,melody_score: string,singer_score:string,mv_score:string){
    let URL = this.serverURL + "/api/post_score";
    return this.httpClient.post(URL,{"track_id":track_id,"lyric_score":lyric_score,"melody_score":melody_score,"singer_score":singer_score,"mv_score":mv_score});
  }
  postReview(track_id: string, review: string){
    let URL = this.serverURL + "/api/post_review";
    return this.httpClient.post(URL,{"track_id":track_id,"review":review});
  }
}
