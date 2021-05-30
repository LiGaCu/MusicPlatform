import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  @Input() botton_content: any = "Search For ... ";

  artistForm = this.formBuilder.group({
    artistArtist: ''
  });
  albumForm = this.formBuilder.group({
    albumArtist: '',
    albumAlbum:''
  });
  trackForm = this.formBuilder.group({
    trackArtist: '',
    trackTrack:''
  });
  constructor(private formBuilder: FormBuilder,private router: Router) { }

  ngOnInit(): void {
  }
  
  changeCatagory(catagoty:string){
    this.botton_content = catagoty;
  }
  searchArtist(){
    this.router.navigate(['/artist',this.artistForm.value.artistArtist]);
  }
  searchAlbum(){
    this.router.navigate(['/album',this.albumForm.value.albumArtist,this.albumForm.value.albumAlbum]);
  }
  searchTrack(){
    this.router.navigate(['/track',this.trackForm.value.trackArtist,this.trackForm.value.trackTrack]);
  }
}
