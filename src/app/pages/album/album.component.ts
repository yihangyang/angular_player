import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlbumsService, AlbumTrackArgs } from 'src/app/services/apis/albums.service';
import { AlbumInfo, Anchor, RelatedAlbum, Track } from 'src/app/services/apis/types';
import { CategoryService } from 'src/app/services/business/category.service';
import { IconType } from 'src/app/share/directives/icon/type';

interface MoreState {
  full: boolean;
  label: string;
  icon: IconType;
}

@Component({
  selector: 'charlene-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumComponent implements OnInit {
  albumInfo: AlbumInfo;
  score: number;
  anchor: Anchor;
  relatedAlbums: RelatedAlbum[];
  tracks: Track[] = [];
  selectedTracks: Track[] = [];
  total = 0;
  trackParams: AlbumTrackArgs = {
    albumId: '',
    sort: 1,
    pageNum: 1,
    pageSize: 30
  };
  
  moreState: MoreState = {
    full: false,
    label: 'show all',
    icon: 'arrow-down-line'
  }

  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumsService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) { }

  submit(): void {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( paramMap => {
      this.trackParams.albumId = paramMap.get('albumId');
      this.initPageData();
    })
  };
  
  changePage(page: number): void {
    if(this.trackParams.pageNum != page) {
      this.trackParams.pageNum = page;
      this.updateTracks();
    }
  }
  
  updateTracks(): void {
    this.albumService.tracks(this.trackParams).subscribe(res => {
      this.tracks = res.tracks;
      this.total = res.trackTotalCount;
      this.cdr.markForCheck();
    })
  }

  private initPageData(): void {
    forkJoin([
      this.albumService.album(this.trackParams.albumId),
      this.albumService.albumScore(this.trackParams.albumId),
      this.albumService.relatedAlbums(this.trackParams.albumId)
    ]).subscribe(([albumInfo, score, relatedAlbums]) => {
      this.albumInfo = { ...albumInfo.mainInfo, albumId: albumInfo.albumId };
      this.score = score / 2;
      this.anchor = albumInfo.anchorInfo;
      // this.tracks = albumInfo.tracksInfo.tracks;
      // this.total = albumInfo.tracksInfo.trackTotalCount;
      this.updateTracks();
      this.relatedAlbums = relatedAlbums.slice(0, 10);

      // const category = localStorage.getItem('categoryPinyin');
      // const {categoryPinyin} = this.albumInfo.crumbs;
      // if(category != categoryPinyin) {
      //   this.categoryService.setCategory(categoryPinyin);
      // }
      this.categoryService.getCategory().pipe(first()).subscribe(category => {
        const { categoryPinyin } = this.albumInfo.crumbs;
        if(category != categoryPinyin) {
          this.categoryService.setCategory(categoryPinyin);
        }
      })
      this.categoryService.setSubCategory([this.albumInfo.albumTitle]);
      this.cdr.markForCheck();
    })
  }

  toggleMore(): void {
    this.moreState.full = !this.moreState.full;
    if(this.moreState.full) {
      this.moreState.icon = "arrow-up-line";
      this.moreState.label = "show less";
    } else {
      this.moreState.icon = "arrow-down-line";
      this.moreState.label = "show more";
    }
  }

  checkedChange(checked: boolean, track: Track): void {
    const targetIndex = this.selectedIndex(track.trackId);
    if(checked) {
      if(targetIndex == -1) {
        this.selectedTracks.push(track);
      }
    } else {
      if(targetIndex > -1) {
        this.selectedTracks.splice(targetIndex, 1);
      }
    }
    console.log(checked, 'checkedChange-checked', this.selectedTracks);
  }

  isChecked(id: number): boolean {
    return this.selectedIndex(id) > -1;
  }

  isCheckedAll(): boolean {
    if(this.selectedTracks.length >= this.tracks.length) {
      return this.tracks.every(item => { // every item member in the tracks must be follow this rule, if yes => true, otherwise => false
        return this.selectedIndex(item.trackId) > -1;
      })
    }
    return false;
  }


  checkedAllChange(checked): void {
    this.tracks.forEach(item => {
      const targetIndex = this.selectedIndex(item.trackId);
      if(checked){ // selected
        if(targetIndex === -1) { // not found in the list
          this.selectedTracks.push(item); // add the item
        }
      } else { // unselected
        if(targetIndex > -1) { // found
          this.selectedTracks.splice(targetIndex, 1); // delete this item
        }
      }
    });
  }
  

  private selectedIndex(id: number): number {
    return this.selectedTracks.findIndex(item => item.trackId === id);
  }

  trackByTracks(index: number, item: Track): number {
    return item.trackId;
  }
}
