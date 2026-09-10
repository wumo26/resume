import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly email = 'wupsnmo26@gmail.com';
  readonly menuOpen = signal(false);
  readonly activeSection = signal('');
  readonly copyStatus = signal('');

  private readonly document = inject(DOCUMENT);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private desktopQuery?: MediaQueryList;
  private readonly onDesktopChange = (event: MediaQueryListEvent): void => {
    if (event.matches) this.closeMenu();
  };

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.element.nativeElement.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && !target.closest('.nav-wrap')) this.closeMenu();
  }

  ngAfterViewInit(): void {
    if (typeof window.matchMedia === 'function') {
      this.desktopQuery = window.matchMedia('(min-width: 601px)');
      this.desktopQuery.addEventListener('change', this.onDesktopChange);
    }
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) this.activeSection.set(entry.target.id);
        });
      }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
      this.element.nativeElement.querySelectorAll('main section[id]').forEach(section => {
        this.observer?.observe(section);
      });
    }
  }

  async copyEmail(): Promise<void> {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(this.email);
      this.copyStatus.set('已複製！');
    } catch {
      const emailElement = this.element.nativeElement.querySelector('.email-address');
      const selection = this.document.getSelection();
      if (emailElement && selection) {
        const range = this.document.createRange();
        range.selectNodeContents(emailElement);
        selection.removeAllRanges();
        selection.addRange(range);
        this.copyStatus.set('已選取信箱，請長按或按 Ctrl/Cmd+C 複製');
      } else {
        this.copyStatus.set('請手動複製信箱：' + this.email);
      }
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.desktopQuery?.removeEventListener('change', this.onDesktopChange);
  }
}
