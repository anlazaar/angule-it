import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaptchaStateService } from '../services/captcha-state.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card result-card">
      <div class="result-header">
        <div class="score-circle" [class.perfect]="state.score() === 100">
          {{ state.score() }}%
        </div>
        <h2>Verification Complete</h2>
        <p>You have successfully passed the security check.</p>
      </div>

      <div class="summary-list">
        @for (stage of state.stages(); track stage.id; let i = $index) {
          <div class="summary-item">
            <div class="item-info">
              <span class="stage-name">Step {{ i + 1 }}: {{ stage.type | titlecase }}</span>
              @if (stage.timeTaken) {
                <span class="stage-time">{{ (stage.timeTaken / 1000).toFixed(1) }}s</span>
              }
            </div>
            <div class="item-status">
              @if (stage.passed) {
                <svg class="icon-success" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              } @else {
                <svg class="icon-error" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              }
            </div>
          </div>
        }
      </div>

      <button class="btn btn-primary restart-btn" (click)="restart()">
        Restart Challenge
      </button>
    </div>
  `,
  styles: [
    `
      .result-card {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }
      .result-header {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .score-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: var(--bg-color);
        border: 4px solid var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 8px;
        box-shadow: 0 0 20px rgba(0, 122, 255, 0.2);
      }
      .score-circle.perfect {
        border-color: var(--success-color);
        color: var(--success-color);
        box-shadow: 0 0 20px rgba(52, 199, 89, 0.25);
      }
      h2 {
        font-size: 24px;
        font-weight: 600;
      }
      p {
        color: var(--text-secondary);
        font-size: 15px;
      }
      .summary-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background-color: var(--bg-color);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
      }
      .item-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .stage-name {
        font-weight: 600;
      }
      .stage-time {
        font-size: 13px;
        color: var(--text-secondary);
      }
      .icon-success {
        color: var(--success-color);
      }
      .icon-error {
        color: var(--danger-color);
      }
      .restart-btn {
        width: 100%;
      }
    `,
  ],
})
export class ResultComponent {
  public state = inject(CaptchaStateService);
  private router = inject(Router);

  restart() {
    this.state.reset();
    this.router.navigate(['/']);
  }
}

