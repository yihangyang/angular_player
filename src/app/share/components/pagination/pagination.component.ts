import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { clamp } from 'lodash';

type PageItemType = 'page' | 'prev' | 'next' | 'prev5' | 'next5'
interface PageItem {
  type: PageItemType;
  num?: number;
  disabled?: boolean;
}

@Component({
  selector: 'charlene-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() total = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Output() changed = new EventEmitter<number>();
  lastNum = 0;
  listOfPageItems: PageItem[] = [];
  
  constructor() { }
  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.lastNum = Math.ceil(this.total / this.pageSize) || 1;
    this.listOfPageItems = this.getListOfPageItems(this.currentPage, this.lastNum);
    // console.log('listOfPageItems', this.listOfPageItems)
  }

  inputVal(num: number): void {
    if(num > 0) {
      this.pageClick({
        type: 'page',
        num
      });
    }
  }

  pageClick({ type, num, disabled }: PageItem): void {
    if (!disabled) { // not be disabled
      let newCurrentPage = this.currentPage
      if(type === 'page') {
        newCurrentPage = num;
      } else {
        const diff: any = {
          next: 1,
          prev: -1,
          next5: 5,
          prev5: -5
        };
        newCurrentPage += diff[type];
      }
      // console.log('newCurrentPage', newCurrentPage)
      this.changed.emit(clamp(newCurrentPage, 1, this.lastNum));
    }
  }

  private getListOfPageItems(currentPage: number, lastNum: number): PageItem[] {
    if(lastNum <= 9){ // no ...
      return concatWithPrevNext(generatePage(1, lastNum), currentPage, lastNum );
    } else { // with ...
      const firstPageitem = generatePage(1, 1);
      const lastPageitem = generatePage(lastNum, lastNum);
      const nextFiveItems = { type: 'next5'}
      const prevFiveItems = { type: 'prev5'}
      let listOfMidPages = [];
      if (currentPage < 4) { // frond
        listOfMidPages = [...generatePage(2,5), nextFiveItems];
      } else if (currentPage > lastNum - 4){ // end
        listOfMidPages = [prevFiveItems, ...generatePage(lastNum - 4, lastNum - 1)];
      } else { // middle
        listOfMidPages = [prevFiveItems, ...generatePage(currentPage - 2, currentPage + 2), nextFiveItems];
      }
      return concatWithPrevNext([...firstPageitem, ...listOfMidPages, ...lastPageitem], currentPage, lastNum);
    }
  }

}

function generatePage(start: number, end: number): PageItem[] {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push({
      num: i,
      type: 'page',
    })
  }
  return list;
}

function concatWithPrevNext(listOfPage: PageItem[], currentPage: number, lastNum: number): PageItem[] {
  return [
    {
      type: 'prev',
      disabled: currentPage === 1
    },
    ...listOfPage,
    {
      type: 'next',
      disabled: currentPage === lastNum
    }
  ]
}