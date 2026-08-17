import { Component, OnInit, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-math-challenge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="challenge-content">
      <h2 class="challenge-title">Quick Math Challenge</h2>
      <p class="challenge-desc">Solve the simple equation to verify you are human.</p>

      <div class="equation-box">
        <span class="number">{{ num1() }}</span>
        <span class="operator">{{ operator() }}</span>
        <span class="number">{{ num2() }}</span>
        <span class="operator">=</span>
        <span class="question-mark">?</span>
      </div>

      <div class="input-group">
        <input
          type="number"
          [formControl]="answerControl"
          class="input-field"
          placeholder="Enter the answer..."
          (keydown.enter)="verify()"
          [class.invalid]="hasError()"
          (paste)="$event.preventDefault()"
          (copy)="$event.preventDefault()"
          (cut)="$event.preventDefault()"
          autocomplete="off"
        />
        @if (hasError()) {
          <p class="error-msg">Incorrect answer, please try again.</p>
        }
      </div>

      <button
        class="btn btn-primary verify-btn"
        (click)="verify()"
        [disabled]="answerControl.invalid"
      >
        Verify Answer
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
        letter-spacing: -0.01em;
      }
      .challenge-desc {
        color: var(--text-secondary);
        font-size: 14px;
        margin-top: -12px;
      }
      .equation-box {
        background: rgba(15, 23, 42, 0.03);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 14px;
        font-size: 32px;
        font-weight: 700;
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
      .input-field {
        font-size: 16px;
        padding: 12px 16px;
      }
      .input-field.invalid {
        border-color: var(--danger-color);
        background-color: rgba(255, 59, 48, 0.05);
      }
      .error-msg {
        color: var(--danger-color);
        font-size: 13px;
        font-weight: 500;
      }
      .verify-btn {
        width: 100%;
        margin-top: 4px;
      }
    `,
  ],
})
export class MathChallengeComponent implements OnInit {
  passed = output<boolean>();

  num1 = signal(0);
  num2 = signal(0);
  operator = signal('+');
  expectedAnswer = signal(0);
  hasError = signal(false);

  answerControl = new FormControl<number | null>(null, [Validators.required]);

  ngOnInit() {
    this.generateEquation();
  }

  generateEquation() {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    this.operator.set(op);

    let n1 = 0;
    let n2 = 0;

    if (op === '*') {
      n1 = Math.floor(Math.random() * 9) + 2;
      n2 = Math.floor(Math.random() * 9) + 2;
    } else {
      n1 = Math.floor(Math.random() * 40) + 10;
      n2 = Math.floor(Math.random() * 20) + 5;
    }

    if (op === '-' && n2 > n1) {
      [n1, n2] = [n2, n1];
    }

    this.num1.set(n1);
    this.num2.set(n2);

    let ans = 0;
    if (op === '+') ans = n1 + n2;
    if (op === '-') ans = n1 - n2;
    if (op === '*') ans = n1 * n2;

    this.expectedAnswer.set(ans);
    this.answerControl.setValue(null);
    this.hasError.set(false);
  }

  verify() {
    if (this.answerControl.value === this.expectedAnswer()) {
      this.passed.emit(true);
    } else {
      this.hasError.set(true);
      setTimeout(() => {
        this.generateEquation();
      }, 600);
    }
  }
}

