import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, empty, merge, of, Subscription } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { AlbumsService } from './services/apis/albums.service';
import { Category } from './services/apis/types';
import { CategoryService } from './services/business/category.service';
import { OverlayRef, OverlayService } from './services/tools/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  currentCategory: Category;
  categories: Category[] = [];
  categoryDeutsch: string = "";
  subCategory: string[] = [];
  showLogin: boolean = false;

  constructor(
    private albumService: AlbumsService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.init();
  }

  changeCategory(category: Category): void {
    this.router.navigateByUrl('/albums/' + category.pinyin)
  }

  private init(): void {
    combineLatest(
      this.categoryService.getCategory(),
      this.categoryService.getSubCategory()
    ).subscribe(([category, subCategory]) => {
      console.log('category', category)
      if(category != this.categoryDeutsch) {
        this.categoryDeutsch = category;
        if(this.categories.length) {
          this.setCurrentCategory();
        }
      }
      this.subCategory = subCategory;
    });
    this.getCategories();
      
  }

  private setCurrentCategory(): void {
    this.currentCategory = this.categories.find(item => item.pinyin === this.categoryDeutsch);
  }

  private getCategories(): void {
    this.albumService.categories().subscribe(categories => {
      this.categories = categories;
      this.currentCategory = this.categories.find(item => item.pinyin === this.categoryDeutsch);
      this.cdr.markForCheck();
    })
  }
}
