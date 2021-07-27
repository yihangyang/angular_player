import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { storageKeys } from '../../../app/configs';
import { AlbumArgs, AlbumsInfo, AlbumsService, CategoryInfo } from '../../services/apis/albums.service';
import { Album, MetaData, MetaValue, SubCategory } from '../../services/apis/types';
import { CategoryService } from '../../services/business/category.service';
import { WindowService } from '../../services/tools/window.service';

interface CheckedMeta {
  metaRowId: number;
  metaRowName: string;
  metaId: number;
  metaName: string;
}
@Component({
  selector: 'charlene-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {

  searchParams: AlbumArgs = {
    category: '',
    subcategory: '',
    meta: '',
    sort: 0,
    page: 1,
    perPage: 30
  };
  total = 0;
  categoryInfo: CategoryInfo;
  checkedMetas: CheckedMeta[] = [];
  albumsInfo: AlbumsInfo;
  sorts = ['default sort', 'newly', 'most play'];

  constructor(
    private albumService: AlbumsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private winService: WindowService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(withLatestFrom(this.categoryService.getCategory()))
      .subscribe(([paramMap,category]) => {
      const pinyin = paramMap.get('pinyin');
      let needSetStatus = false;
      console.log('category', category);
      console.log('pinyin params', pinyin);
      this.searchParams.category = pinyin;
      if(pinyin !== category) { // about to switch 1st
        this.categoryService.setCategory(pinyin); // set 1st
        this.clearSubcategory();
        this.unCheckedMeta('clear'); // clear 3rd
      } else {
        const cacheSubCategory = this.winService.getStorage(storageKeys.subcategoryCode);
        const cacheMetas = this.winService.getStorage(storageKeys.metas);
        if(cacheSubCategory){
          needSetStatus = true;
          this.searchParams.subcategory = cacheSubCategory;
        }
        if(cacheMetas){
          needSetStatus = true;
          this.searchParams.meta = cacheMetas;
        } else {
          this.clearSubcategory();
        }
      }
      this.updatePageData(needSetStatus);
    })
  }

  changeSubCategory(subCategory?: SubCategory): void {
    console.log(subCategory,'subCategory');
    if(subCategory){
      this.searchParams.subcategory = subCategory.code;
      this.categoryService.setSubCategory([subCategory.displayValue]);
      this.winService.setStorage(storageKeys.subcategoryCode, this.searchParams.subcategory);
    } else {
      this.clearSubcategory();
    }
    this.unCheckedMeta('clear');
    this.updatePageData();
  }

  changeMeta(row: MetaData, meta: MetaValue): void {
    // row.id_meta.id e.g: 121_0320
    console.log(row);
    console.log(meta);
    this.checkedMetas.push({
      metaRowId: row.id,
      metaRowName: row.name,
      metaId: meta.id,
      metaName: meta.displayName
    });
    this.winService.setStorage(storageKeys.metas, this.searchParams.meta);
    this.searchParams.meta = this.getMetaParams();
    this.updateAlbums();
  }

  unCheckedMeta(meta: CheckedMeta | 'clear'): void {
    if(meta === "clear"){
      this.checkedMetas = [];
      this.searchParams.meta = this.getMetaParams();
      this.winService.removeStorage(storageKeys.metas);
    } else {
      const targetIndex = this.checkedMetas.findIndex(item => {
        return (item.metaRowId === meta.metaRowId) && (item.metaId === meta.metaId);
      })
      if(targetIndex > -1){
        this.checkedMetas.splice(targetIndex, 1);
        this.searchParams.meta = this.getMetaParams();
        this.winService.setStorage(storageKeys.metas, this.searchParams.meta);
      }
    }
    this.updateAlbums();
  }

  changePage(newCurrentPage: number): void {
    if(this.searchParams.page !== newCurrentPage){
      this.searchParams.page = newCurrentPage;
      this.updateAlbums();
    }
  }

  private getMetaParams(): string {
    let result = '';
    if(this.checkedMetas.length){
      this.checkedMetas.forEach(item => {
        result += item.metaRowId + '_' + item.metaId + '-';
      });
    }
    console.log('meta params', result.slice(0, -1));
    return result.slice(0, -1);
  }

  changeSort(index: number): void {
    if(this.searchParams.sort !== index){
      this.searchParams.sort = index;
      this.updateAlbums();
    } 
  }

  showMetaRow(name: string): boolean {
    if(this.checkedMetas.length){
      return this.checkedMetas.findIndex(item => item.metaRowName === name) === -1;
    }
    return true;
  }


  private updatePageData(needSetStatus: boolean = false): void {
    forkJoin([
      this.albumService.albums(this.searchParams),
      this.albumService.detailCategoryPageInfo(this.searchParams)
    ]).subscribe(([albumsInfo, categoryInfo]) => {
      // console.log('albumsInfo', albumsInfo);
      this.categoryInfo = categoryInfo;
      this.albumsInfo = albumsInfo;
      this.total = albumsInfo.total;
      if (needSetStatus) {
        this.setStatus(categoryInfo);
      }
      this.cdr.markForCheck();
    });
  }

  private updateAlbums(): void {
    this.albumService.albums(this.searchParams).subscribe(albumsInfo => {
      this.albumsInfo = albumsInfo;
      this.total = albumsInfo.total;
      this.cdr.markForCheck();
    })
  }

  private setStatus({metadata, subcategories}: CategoryInfo): void {
    // show brandcrumb second branch
    const subCategory = subcategories.find(item => item.code === this.searchParams.subcategory);
    if(subCategory) {
      this.categoryService.setSubCategory([subCategory.displayValue]);
    }
    if (this.searchParams.meta) { // need to update meta status
      // 19_156-22_4433
      const metasMap = this.searchParams.meta.split('-').map(item => item.split('_'));
      metasMap.forEach(meta => {
        const targetRow = metadata.find(row => row.id === Number(meta[0]));
        const { id: metaRowId, name, metaValues} = targetRow || metadata[0];
        const targetMeta = metaValues.find(item => item.id === Number(meta[1]))
        const { id, displayName } = targetMeta || metaValues[0];
        this.checkedMetas.push({
          metaRowId,
          metaRowName: name,
          metaId: id,
          metaName: displayName
        })
      })
    }
    
  }

  private clearSubcategory(): void {
    this.searchParams.subcategory = ''; // clear 2nd
    this.categoryService.setSubCategory([]); // clear 2nd service
    this.winService.removeStorage(storageKeys.subcategoryCode); // remove 2nd storage
  }

  trackBySubCategory(item: SubCategory): string {
    return item.code;
  }
  trackByMetas(item: SubCategory): number {
    return item.id;
  }
  trackByAlbums(index: number, item: Album){
    return item.albumId;
  }

}
