import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { storageKeys } from './configs';
import { AlbumsService } from './services/apis/albums.service';
import { Category } from './services/apis/types';
import { UserService } from './services/apis/user.service';
import { CategoryService } from './services/business/category.service';
import { ContextService } from './services/business/context.service';
import { WindowService } from './services/tools/window.service';

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
    private windowService: WindowService,
    private userService: UserService,
    private contextService: ContextService,
  ) {
  }

  ngOnInit(): void {
    if(this.windowService.getStorage(storageKeys.remember)) {
      this.userService.userInfo().subscribe(({user, token}) => {
        this.contextService.setUser(user);
        this.windowService.setStorage(storageKeys.auth, token)
      }, error => {
        console.log(error);
        this.clearStorage();
      })
    }
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
  
  logout(): void {
    this.userService.logout().subscribe(() => {
      this.contextService.setUser(null);
      this.clearStorage();
      alert('logout successfully')
    })
  }

  private clearStorage() {
    this.windowService.removeStorage(storageKeys.remember);
    this.windowService.removeStorage(storageKeys.auth);
  }
}
