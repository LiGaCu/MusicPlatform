import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { ArtistpageComponent } from './components/artistpage/artistpage.component';
import { AlbumpageComponent } from './components/albumpage/albumpage.component';
import { TrackpageComponent } from './components/trackpage/trackpage.component';
const routes: Routes = [
  {path:'', component:HomepageComponent, runGuardsAndResolvers: 'always'},
  {path:'artist/:artistName', component:ArtistpageComponent, runGuardsAndResolvers: 'always'},
  {path:'album/:artistName/:albumName', component:AlbumpageComponent, runGuardsAndResolvers: 'always'},
  {path:'track/:artistName/:trackName', component:TrackpageComponent, runGuardsAndResolvers: 'always'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
