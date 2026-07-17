import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

interface PatternItem {
  icon: SafeHtml;
  isOdd: boolean;
}

@Component({
  selector: 'app-pattern-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="challenge-content">
      <h2 class="challenge-title">Odd One Out</h2>
      <p class="challenge-desc">Select the item that does not belong.</p>

      <div class="pattern-grid">
        <button
          *ngFor="let item of items; let i = index"
          class="item-btn"
          [class.invalid]="selectedIndex === i && hasError"
          (click)="verify(i)"
        >
          <div class="icon" [innerHTML]="item.icon"></div>
        </button>
      </div>

      <p class="error-msg" *ngIf="hasError">Incorrect, please try again.</p>
    </div>
  `,
  styles: [
    `
      .challenge-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .challenge-title {
        font-size: 20px;
        font-weight: 600;
      }
      .challenge-desc {
        color: var(--text-secondary);
        font-size: 14px;
      }
      .pattern-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .item-btn {
        aspect-ratio: 1;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-fast);
        color: var(--text-primary);
      }
      .item-btn:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-sm);
      }
      .item-btn .icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .item-btn .icon svg {
        width: 100%;
        height: 100%;
      }
      .item-btn.invalid {
        border-color: var(--danger-color);
        background-color: rgba(255, 59, 48, 0.05);
        animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
      .error-msg {
        color: var(--danger-color);
        font-size: 12px;
        text-align: center;
      }
      @keyframes shake {
        10%,
        90% {
          transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
          transform: translate3d(2px, 0, 0);
        }
        30%,
        50%,
        70% {
          transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
          transform: translate3d(4px, 0, 0);
        }
      }
    `,
  ],
})
export class PatternChallengeComponent implements OnInit {
  @Output() passed = new EventEmitter<boolean>();

  items: PatternItem[] = [];
  hasError = false;
  selectedIndex: number | null = null;

  private svgShapes = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>',
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.generatePattern();
  }

  generatePattern() {
    const shuffledShapes = [...this.svgShapes].sort(() => 0.5 - Math.random());

    const commonShape = this.sanitizer.bypassSecurityTrustHtml(
      shuffledShapes[0]
    );
    const oddShape = this.sanitizer.bypassSecurityTrustHtml(shuffledShapes[1]);

    const items: PatternItem[] = Array.from({ length: 6 }, () => ({
      icon: commonShape,
      isOdd: false,
    }));

    const oddIndex = Math.floor(Math.random() * 6);

    items[oddIndex] = {
      icon: oddShape,
      isOdd: true,
    };

    this.items = [...items];

    this.selectedIndex = null;
    this.hasError = false;
  }

  verify(index: number) {
    this.selectedIndex = index;

    if (this.items[index].isOdd) {
      this.passed.emit(true);
      return;
    }

    this.hasError = true;

    setTimeout(() => {
      this.generatePattern();
      this.cdr.detectChanges();
    }, 800);
  }
}
