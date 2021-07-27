import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { fromEvent, merge, Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface OverlayRef {
  container: HTMLElement;
  backdropClick: () => Observable<MouseEvent>;
  backdropKeyup: () => Observable<KeyboardEvent>;
  dispose: () => void;
}
export interface OverlayConfig {
  center?: boolean;
  fade?: boolean;
  backgroundColor?: string;
  responseEvent?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private rd2: Renderer2;
  readonly defaultConfig: Required<OverlayConfig> = {
    center: false,
    fade: false,
    backgroundColor: 'transparent',
    responseEvent: true,
  }
  private overlayRef: OverlayRef;
  private config: Required<OverlayConfig>;
  private backdropElement: HTMLElement;
  private detachment$ = new Subject<void>();
  private backdropClick$ = new Subject<MouseEvent>();
  private backdropKeyup$ = new Subject<KeyboardEvent>();

  constructor(
    private rdFactory2: RendererFactory2,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.rd2 = rdFactory2.createRenderer(null, null);
  }

  create(config?: OverlayConfig): OverlayRef {
    if(isPlatformBrowser(this.platformId)) {
      this.config = {...this.defaultConfig, ...config}
      const container = this.rd2.createElement('div');
      this.rd2.addClass(container, 'overlay-container');
      container.innerHTML = '<div class="overlay-mask overlay-mask-show"></div>';
      this.rd2.appendChild(this.doc.body, container);
      this.backdropElement = container.querySelector('.overlay-mask');
      this.setConfigs(container);
      this.overlayRef = {
        container,
        backdropClick: this.backdropClick.bind(this),
        backdropKeyup: this.backdropKeyup.bind(this),
        dispose: this.dispose.bind(this)
      }
      return this.overlayRef;
    }
  }

  private backdropClick(): Observable<MouseEvent> {
    return this.backdropClick$.asObservable();
  }

  private backdropKeyup(): Observable<KeyboardEvent> {
    return this.backdropKeyup$.asObservable();
  }

  private listenEvents(): void {
    merge(
      fromEvent(this.backdropElement, 'click'),
      fromEvent(this.doc, 'keyup'),
    ).pipe(takeUntil(this.detachment$)).subscribe((event: MouseEvent | KeyboardEvent) => {
      if(event instanceof KeyboardEvent) {
        this.backdropKeyup$.next(event);
      } else {
        this.backdropClick$.next(event);
      }
    });
  }

  private setConfigs(container: HTMLElement): void {
    const { center, fade, backgroundColor, responseEvent } = this.config;
    if (center) {
      this.rd2.addClass(container, 'overlay-center');
    }
    if (backgroundColor) {
      this.rd2.setStyle(this.backdropElement, 'background-color', backgroundColor);
    }
    if (fade) {
      timer(0).subscribe(() => {
        this.rd2.addClass(this.backdropElement, 'overlay-mask-show');
      })
    } else {
      this.rd2.addClass(this.backdropElement, 'overlay-mask-show');
    }
    if(responseEvent) {
      this.rd2.setStyle(this.backdropElement, 'pointer-events', 'auto');
      this.listenEvents();
    }
  }

  private dispose(): void {
    if (this.overlayRef) {
      if(this.config.fade) {
        fromEvent(this.backdropElement, 'transitionend')
          .pipe(takeUntil(this.detachment$)).subscribe(() => {
            this.destroy();
          })
        this.rd2.removeClass(this.backdropElement, 'overlay-mask-show');
      } else {
        this.destroy();
      }
    }
  }

  private destroy(): void {
    this.detachment$.next();
    this.detachment$.complete();
    this.rd2.removeChild(this.doc.body, this.overlayRef.container);
    this.overlayRef = null;
  }
}
