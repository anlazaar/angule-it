import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon';

export interface PatternItem {
  shape: ShapeType;
  isOdd: boolean;
}

@Component({
  selector: 'app-pattern-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="challenge-content">
      <h2 class="challenge-title">Odd One Out</h2>
      <p class="challenge-desc">Select the shape that does not belong.</p>

      <div class="pattern-grid">
        @for (item of items(); track $index) {
          <button
            class="item-btn"
            [class.invalid]="selectedIndex() === $index && hasError()"
            (click)="verify($index)"
            [aria-label]="'Select item ' + ($index + 1)"
          >
            <div class="icon">
              @switch (item.shape) {
                @case ('circle') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                }
                @case ('square') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  </svg>
                }
                @case ('triangle') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  </svg>
                }
                @case ('hexagon') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                }
              }
            </div>
          </button>
        }
      </div>

      @if (hasError()) {
        <p class="error-msg">Incorrect choice, please try again.</p>
      }
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
        margin-top: -12px;
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
        transform: translateY(-2px);
      }
      .item-btn .icon {
        width: 44px;
        height: 44px;
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
        font-size: 13px;
        font-weight: 500;
        text-align: center;
      }
      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
      }
    `,
  ],
})
export class PatternChallengeComponent implements OnInit {
  passed = output<boolean>();

  items = signal<PatternItem[]>([]);
  hasError = signal(false);
  selectedIndex = signal<number | null>(null);

  private availableShapes: ShapeType[] = ['circle', 'square', 'triangle', 'hexagon'];

  ngOnInit() {
    this.generatePattern();
  }

  generatePattern() {
    const shuffled = [...this.availableShapes].sort(() => 0.5 - Math.random());
    const commonShape = shuffled[0];
    const oddShape = shuffled[1];

    const grid: PatternItem[] = Array.from({ length: 6 }, () => ({
      shape: commonShape,
      isOdd: false,
    }));

    const oddIndex = Math.floor(Math.random() * 6);
    grid[oddIndex] = {
      shape: oddShape,
      isOdd: true,
    };

    this.items.set(grid);
    this.selectedIndex.set(null);
    this.hasError.set(false);
  }

  verify(index: number) {
    this.selectedIndex.set(index);
    const item = this.items()[index];

    if (item && item.isOdd) {
      this.passed.emit(true);
      return;
    }

    this.hasError.set(true);
    setTimeout(() => {
      this.generatePattern();
    }, 700);
  }
}

