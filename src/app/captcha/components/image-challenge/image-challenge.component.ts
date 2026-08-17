import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ImageItem {
  id: number;
  type: 'circle' | 'square' | 'triangle';
  color: string;
  isTarget: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-image-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="challenge-content">
      <h2 class="challenge-title">Visual Selection</h2>
      <p class="challenge-desc">
        Select all <strong>{{ targetCategory() }}</strong>.
      </p>

      <div class="image-grid">
        @for (img of images(); track img.id; let i = $index) {
          <div
            class="image-item"
            [class.selected]="img.selected"
            (click)="toggleSelection(i)"
          >
            <div class="shape-container">
              @switch (img.type) {
                @case ('circle') {
                  <div class="shape circle" [style.background-color]="img.color"></div>
                }
                @case ('square') {
                  <div class="shape square" [style.background-color]="img.color"></div>
                }
                @case ('triangle') {
                  <div class="shape triangle" [style.border-bottom-color]="img.color"></div>
                }
              }
            </div>
            <div class="selection-overlay">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
        }
      </div>

      @if (hasError()) {
        <p class="error-msg">{{ errorMessage() }}</p>
      }

      <button class="btn btn-primary verify-btn" (click)="verify()">
        Verify Selection
      </button>
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
      .challenge-desc strong {
        color: var(--primary-color);
        font-weight: 600;
      }
      .image-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      .image-item {
        aspect-ratio: 1;
        position: relative;
        cursor: pointer;
        border-radius: var(--radius-md);
        overflow: hidden;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        transition: all var(--transition-fast);
      }
      .shape-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform var(--transition-normal);
      }
      .image-item:hover .shape-container {
        transform: scale(1.06);
      }

      .shape {
        width: 54px;
        height: 54px;
      }
      .circle {
        border-radius: 50%;
      }
      .square {
        border-radius: 10px;
      }
      .triangle {
        width: 0;
        height: 0;
        background-color: transparent !important;
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        border-bottom: 54px solid;
      }

      .selection-overlay {
        position: absolute;
        inset: 0;
        background-color: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: 0;
        transition: opacity var(--transition-fast);
        border: 3px solid var(--primary-color);
        border-radius: var(--radius-md);
      }
      .image-item.selected .selection-overlay {
        opacity: 1;
      }
      .image-item.selected .shape-container {
        transform: scale(0.85);
      }
      .error-msg {
        color: var(--danger-color);
        font-size: 13px;
        font-weight: 500;
        text-align: center;
      }
      .verify-btn {
        width: 100%;
        margin-top: 4px;
      }
    `,
  ],
})
export class ImageChallengeComponent implements OnInit {
  passed = output<boolean>();

  targetCategory = signal('');
  images = signal<ImageItem[]>([]);
  hasError = signal(false);
  errorMessage = signal('');

  private shapes: ('circle' | 'square' | 'triangle')[] = [
    'circle',
    'square',
    'triangle',
  ];
  private colors = ['#FF3B30', '#34C759', '#007AFF', '#FF9500', '#AF52DE'];

  ngOnInit() {
    this.generateGrid();
  }

  generateGrid() {
    const targetShape =
      this.shapes[Math.floor(Math.random() * this.shapes.length)];
    this.targetCategory.set(targetShape + 's');

    let list: ImageItem[] = Array(9)
      .fill(null)
      .map((_, i) => {
        const isTarget = Math.random() > 0.55;
        let shape = targetShape;
        if (!isTarget) {
          const otherShapes = this.shapes.filter((s) => s !== targetShape);
          shape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
        }
        return {
          id: i,
          type: shape,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          isTarget,
          selected: false,
        };
      });

    // Ensure at least one target
    if (!list.some((img) => img.isTarget)) {
      list[0].isTarget = true;
      list[0].type = targetShape;
    }

    // Shuffle grid items
    list = [...list].sort(() => Math.random() - 0.5);
    this.images.set(list);

    this.hasError.set(false);
    this.errorMessage.set('');
  }

  toggleSelection(index: number) {
    const updated = this.images().map((img, i) =>
      i === index ? { ...img, selected: !img.selected } : img
    );
    this.images.set(updated);
    this.hasError.set(false);
  }

  verify() {
    const currentList = this.images();
    const hasSelection = currentList.some((img) => img.selected);

    if (!hasSelection) {
      this.hasError.set(true);
      this.errorMessage.set('Please select at least one item before verifying.');
      return;
    }

    const isCorrect = currentList.every((img) => img.selected === img.isTarget);

    if (isCorrect) {
      this.passed.emit(true);
      return;
    }

    this.hasError.set(true);
    this.errorMessage.set('Incorrect selection, please try again.');

    setTimeout(() => {
      this.generateGrid();
    }, 750);
  }
}

