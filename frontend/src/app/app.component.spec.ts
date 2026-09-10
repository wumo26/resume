import { TestBed, ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppComponent } from './app.component';

describe('Resume interactions', () => {
  let fixture: ComponentFixture<AppComponent>;
  let page: HTMLElement;
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    page = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('renders resume sections, working section targets, and the original download link', () => {
    expect(page.querySelector('h1')?.textContent).toContain('吳柏勳');
    for (const link of page.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
      const target = link.getAttribute('href')!.slice(1);
      expect(page.querySelector(`[id="${target}"]`)).not.toBeNull();
    }
    expect(page.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href'))
      .toBe('assets/resume.docx');
  });

  it('opens the mobile menu and closes it after choosing a section', () => {
    const toggle = page.querySelector<HTMLButtonElement>('.menu-toggle')!;
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(page.querySelector('#navigation')!.classList.contains('is-open')).toBe(true);
    page.querySelector<HTMLAnchorElement>('#navigation a')!.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu with Escape and returns keyboard focus to its toggle', () => {
    const toggle = page.querySelector<HTMLButtonElement>('.menu-toggle')!;
    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });

  it('copies the correct address and announces success only after the write resolves', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('isSecureContext', true);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    await fixture.componentInstance.copyEmail();
    fixture.detectChanges();
    expect(writeText).toHaveBeenCalledWith('wupsnmo26@gmail.com');
    expect(page.querySelector('[role="status"]')!.textContent).toContain('已複製');
  });

  it('selects the actual email and gives manual instructions when clipboard access fails', async () => {
    vi.stubGlobal('isSecureContext', false);
    await fixture.componentInstance.copyEmail();
    fixture.detectChanges();
    expect(document.getSelection()?.toString().trim()).toBe('wupsnmo26@gmail.com');
    expect(page.querySelector('[role="status"]')!.textContent).toContain('Ctrl/Cmd+C');
    expect(page.querySelector('[role="status"]')!.textContent).not.toContain('已複製！');
  });
});
