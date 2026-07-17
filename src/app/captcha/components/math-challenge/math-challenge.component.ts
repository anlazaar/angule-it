import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-math-challenge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="challenge-content">
      <h2 class="challenge-title">Quick Math</h2>
      <p class="challenge-desc">Solve the equation to prove you are human.</p>

      <div class="equation-box">
        <span class="number">{{ num1 }}</span>
        <span class="operator">{{ operator }}</span>
        <span class="number">{{ num2 }}</span>
        <span class="operator">=</span>
        <span class="question-mark">?</span>
      </div>

      <div class="input-group">
        <input
          type="number"
          [formControl]="answerControl"
          class="input-field"
          placeholder="Enter the result"
          (keydown.enter)="verify()"
          [class.invalid]="hasError"
          (paste)="$event.preventDefault()"
          (copy)="$event.preventDefault()"
          (cut)="$event.preventDefault()"
        />
        <p class="error-msg" *ngIf="hasError">
          Incorrect answer, please try again.
        </p>
      </div>

      <button
        class="btn btn-primary"
        (click)="verify()"
        [disabled]="answerControl.invalid"
      >
        Verify
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
      .equation-box {
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        font-size: 28px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .operator {
        color: var(--text-secondary);
      }
      .question-mark {
        color: var(--primary-color);
      }
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .input-field.invalid {
        border-color: var(--danger-color);
        background-color: rgba(255, 59, 48, 0.05);
      }
      .error-msg {
        color: var(--danger-color);
        font-size: 12px;
      }
    `,
  ],
})
export class MathChallengeComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  @Output() passed = new EventEmitter<boolean>();

  num1 = 0;
  num2 = 0;
  operator = '+';
  expectedAnswer = 0;
  hasError = false;

  answerControl = new FormControl<number | null>(null, [Validators.required]);

  ngOnInit() {
    this.generateEquation();
  }

  generateEquation() {
    const ops = ['+', '-', '*'];
    this.operator = ops[Math.floor(Math.random() * ops.length)];

    if (this.operator === '*') {
      this.num1 = Math.floor(Math.random() * 9) + 2;
      this.num2 = Math.floor(Math.random() * 9) + 2;
    } else {
      this.num1 = Math.floor(Math.random() * 50) + 10;
      this.num2 = Math.floor(Math.random() * 20) + 5;
    }

    if (this.operator === '-' && this.num2 > this.num1) {
      [this.num1, this.num2] = [this.num2, this.num1];
    }

    if (this.operator === '+') this.expectedAnswer = this.num1 + this.num2;
    if (this.operator === '-') this.expectedAnswer = this.num1 - this.num2;
    if (this.operator === '*') this.expectedAnswer = this.num1 * this.num2;

    this.answerControl.setValue(null);
    this.hasError = false;
  }

  verify() {
    if (this.answerControl.value === this.expectedAnswer) {
      this.passed.emit(true);
    } else {
      this.hasError = true;

      setTimeout(() => {
        this.generateEquation();
        this.cdr.detectChanges();
      }, 500);
    }
  }
}
