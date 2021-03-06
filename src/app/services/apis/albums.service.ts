import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Album, AlbumInfo, Anchor, Base, Category, MetaData, RelatedAlbum, SubCategory, TracksInfo } from './types';
import { map } from 'rxjs/operators'
import {stringify} from 'qs';

export interface CategoryInfo {
  category: Category;
  currentSubcategory: SubCategory;
  subcategories: SubCategory[];
  metadata: MetaData[];
}

export interface AlbumsInfo {
  albums: Album[];
  page: number;
  pageSize: number;
  total: number;
  pageConfig: { h1title: string };
}
export interface AlbumArgs {
  category: string;
  subcategory: string;
  meta: string;
  sort: number;
  page: number;
  perPage: number;
}

export interface AlbumRes {
  albumId: number;
  mainInfo: AlbumInfo;
  anchorInfo: Anchor;
  tracksInfo: TracksInfo;
}

export interface AlbumTrackArgs {
  albumId: string;
  sort: number;
  pageNum: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  readonly prefix = '/xmly/';
  constructor(private http: HttpClient) {}

  // first class list
  categories(categoryId = 3): Observable<Category[]> {
    const params = new HttpParams().set('categoryId', categoryId.toString());
    return this.http
      .get(`${environment.baseUrl}${this.prefix}breadcrumb`, { params })
      .pipe(map((res: Base<{ categories: Category[] }>) => res.data.categories));
  }

  // second and third class list
  detailCategoryPageInfo(args: Pick<AlbumArgs, 'category' | 'subcategory'>): Observable<CategoryInfo> {
    return this.http
      .get(`${environment.baseUrl}${this.prefix}categories`, { params: args })
      .pipe(map((res: Base<CategoryInfo>) => res.data));
  }

  // get album data list
  albums(args: AlbumArgs): Observable<AlbumsInfo> {
    const params = new HttpParams({ fromString: stringify(args) });
    return this.http
      .get(`${environment.baseUrl}${this.prefix}albums`, { params })
      .pipe(map((res: Base<AlbumsInfo>) => res.data));
  }

  // get album detail
  album(albumId: string): Observable<AlbumRes> {
    const params = new HttpParams().set('albumId', albumId);
    return this.http
    .get(`${environment.baseUrl}${this.prefix}album`, { params })
    .pipe(map((res: Base<AlbumRes>) => res.data));
  }

  // get rating star
  albumScore(albumId: string): Observable<number> {
    return this.http
      .get(`${environment.baseUrl}${this.prefix}album-score/${albumId}`)
      .pipe(map((res: Base<{albumScore: number}>) => res.data.albumScore || 0));
  }

  // related album
  relatedAlbums(albumId: string): Observable<RelatedAlbum[]> {
    const params = new HttpParams().set('id', albumId);
    return this.http
    .get(`${environment.baseUrl}${this.prefix}album-relate`, { params })
    .pipe(map((res: Base<{hotWordAlbums: RelatedAlbum[]}>) => res.data.hotWordAlbums));
  }

  // tracks list
  tracks(args: AlbumTrackArgs): Observable<TracksInfo> {
    const params = new HttpParams({ fromString: stringify(args) });
    return this.http.get(`${environment.baseUrl}${this.prefix}album-tracks`, { params })
      .pipe(map((res: Base<TracksInfo>) => res.data));
  }

}

