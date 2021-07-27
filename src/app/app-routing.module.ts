import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'album/:albumId',
    loadChildren: () => import('./pages/album/album.module').then(m => m.AlbumModule),
    data: {title: 'album detail'}
  },
  {path: '', redirectTo: '/albums/youshengshu', pathMatch: 'full'},
  {path: '**', redirectTo: '/albums/youshengshu', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
