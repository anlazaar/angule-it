import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

interface ImageItem {
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
        Select all <strong>{{ targetCategory }}</strong
        >.
      </p>

      <div class="image-grid">
        <div
          *ngFor="let img of images; let i = index"
          class="image-item"
          [class.selected]="img.selected"
          (click)="toggleSelection(i)"
        >
          <div class="shape-container">
            <div
              *ngIf="img.type === 'circle'"
              class="shape circle"
              [style.background-color]="img.color"
            ></div>
            <div
              *ngIf="img.type === 'square'"
              class="shape square"
              [style.background-color]="img.color"
            ></div>
            <div
              *ngIf="img.type === 'triangle'"
              class="shape triangle"
              [style.border-bottom-color]="img.color"
            ></div>
          </div>
          <div class="selection-overlay">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <p class="error-msg" *ngIf="hasError">{{ errorMessage }}</p>

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
      }
      .challenge-desc strong {
        color: var(--text-primary);
      }
      .image-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .image-item {
        aspect-ratio: 1;
        position: relative;
        cursor: pointer;
        border-radius: var(--radius-sm);
        overflow: hidden;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
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
        transform: scale(1.05);
      }

      .shape {
        width: 60px;
        height: 60px;
      }
      .circle {
        border-radius: 50%;
      }
      .square {
        border-radius: 8px;
      }
      .triangle {
        width: 0;
        height: 0;
        background-color: transparent !important;
        border-left: 35px solid transparent;
        border-right: 35px solid transparent;
        border-bottom: 60px solid;
      }

      .selection-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: 0;
        transition: opacity var(--transition-fast);
        border: 3px solid var(--primary-color);
        border-radius: var(--radius-sm);
      }
      .image-item.selected .selection-overlay {
        opacity: 1;
      }
      .image-item.selected .shape-container {
        transform: scale(0.85);
      }
      .error-msg {
        color: var(--danger-color);
        font-size: 12px;
        text-align: center;
      }
      .verify-btn {
        width: 100%;
        margin-top: 8px;
      }
    `,
  ],
})
export class ImageChallengeComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  @Output() passed = new EventEmitter<boolean>();

  targetCategory = '';
  images: ImageItem[] = [];
  hasError = false;
  errorMessage = '';

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
    this.targetCategory = targetShape + 's';

    this.images = Array(9)
      .fill(null)
      .map((_, i) => {
        const isTarget = Math.random() > 0.6;
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
    if (!this.images.some((img) => img.isTarget)) {
      this.images[0].isTarget = true;
      this.images[0].type = targetShape;
    }

    // Shuffle
    const shuffled = [...this.images].sort(() => Math.random() - 0.5);

    this.images = shuffled.map((img) => ({
      ...img,
      selected: false,
    }));

    this.hasError = false;
    this.errorMessage = '';
  }

  toggleSelection(index: number) {
    this.images = this.images.map((img, i) =>
      i === index ? { ...img, selected: !img.selected } : img
    );

    this.hasError = false;
  }

  verify() {
    const hasSelection = this.images.some((img) => img.selected);

    if (!hasSelection) {
      this.hasError = true;
      this.errorMessage = 'Please select at least one image before verifying.';
      return;
    }

    const isCorrect = this.images.every((img) => img.selected === img.isTarget);

    if (isCorrect) {
      this.passed.emit(true);
      return;
    }
    this.hasError = true;
    this.errorMessage = 'Incorrect selection, please try again.';

    setTimeout(() => {
      this.generateGrid();
      this.cdr.detectChanges();
    }, 800);
  }
}
