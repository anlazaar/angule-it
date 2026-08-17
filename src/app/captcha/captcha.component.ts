import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaptchaStateService } from '../services/captcha-state.service';
import { CaptchaEngineService } from '../services/captcha-engine.service';
import { MathChallengeComponent } from './components/math-challenge/math-challenge.component';
import { LogicChallengeComponent } from './components/logic-challenge/logic-challenge.component';
import { PatternChallengeComponent } from './components/pattern-challenge/pattern-challenge.component';
import { ImageChallengeComponent } from './components/image-challenge/image-challenge.component';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [
    CommonModule,
    MathChallengeComponent,
    LogicChallengeComponent,
    PatternChallengeComponent,
    ImageChallengeComponent,
  ],
  template: `
    <div class="card captcha-card">
      <div class="captcha-header">
        <div class="progress-bar-container">
          <div
            class="progress-bar"
            [style.width.%]="state.progressPercent()"
          ></div>
        </div>
        <div class="stage-info">
          @if (!state.isFirstStage()) {
            <button
              class="btn-back"
              (click)="goBack()"
              aria-label="Go back to previous challenge"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back
            </button>
          }

          <span
            class="stage-text"
            [class.no-back]="state.isFirstStage()"
          >
            Step {{ state.currentStageIndex() + 1 }} of {{ state.stages().length }}
          </span>

          @if (!state.isLastStage()) {
            <button
              class="btn-next"
              [disabled]="!state.currentStage()?.passed"
              (click)="goNext()"
              aria-label="Go to next challenge"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          }
        </div>
      </div>

      <div class="challenge-container" [class.slide-in]="isAnimating()">
        @switch (state.currentStage()?.type) {
          @case ('math') {
            <app-math-challenge
              (passed)="onStagePassed($event)"
            ></app-math-challenge>
          }
          @case ('logic') {
            <app-logic-challenge
              (passed)="onStagePassed($event)"
            ></app-logic-challenge>
          }
          @case ('pattern') {
            <app-pattern-challenge
              (passed)="onStagePassed($event)"
            ></app-pattern-challenge>
          }
          @case ('image') {
            <app-image-challenge
              (passed)="onStagePassed($event)"
            ></app-image-challenge>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      .captcha-card {
        padding: 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        background: var(--card-bg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        backdrop-filter: blur(12px);
      }
      .captcha-header {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .progress-bar-container {
        width: 100%;
        height: 6px;
        background-color: rgba(0, 0, 0, 0.06);
        border-radius: var(--radius-full);
        overflow: hidden;
      }
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #34d399);
        border-radius: var(--radius-full);
        transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
      }
      .stage-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
      }
      .stage-text {
        flex: 1;
        text-align: center;
      }
      .stage-text.no-back {
        text-align: left;
      }
      .btn-back {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-full);
        padding: 5px 14px;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }
      .btn-back:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background-color: rgba(15, 23, 42, 0.04);
      }
      .btn-next {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--primary-color);
        border: 1px solid var(--primary-color);
        border-radius: var(--radius-full);
        padding: 5px 14px;
        font-size: 12px;
        font-weight: 600;
        color: white;
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }
      .btn-next:hover:not(:disabled) {
        filter: brightness(1.08);
      }
      .btn-next:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .challenge-container {
        animation: fade-in var(--transition-normal) forwards;
      }
      .challenge-container.slide-in {
        animation: slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  ],
})
export class CaptchaComponent implements OnInit {
  public state = inject(CaptchaStateService);
  private engine = inject(CaptchaEngineService);
  private router = inject(Router);

  private stageStartTime = 0;
  isAnimating = signal(false);

  ngOnInit() {
    if (this.state.isCompleted()) {
      this.router.navigate(['/result']);
      return;
    }

    if (this.state.stages().length === 0) {
      const stages = this.engine.generateSessionStages(3);
      this.state.initializeStages(stages);
    }

    this.stageStartTime = Date.now();
  }

  onStagePassed(success: boolean) {
    const timeTaken = Date.now() - this.stageStartTime;
    this.state.completeCurrentStage(success, timeTaken);

    if (this.state.isCompleted()) {
      this.router.navigate(['/result']);
    } else {
      this.triggerAnimation();
      this.stageStartTime = Date.now();
    }
  }

  goBack() {
    this.state.goToPreviousStage();
    this.triggerAnimation();
    this.stageStartTime = Date.now();
  }

  goNext() {
    this.state.goToNextStage();
    this.triggerAnimation();
    this.stageStartTime = Date.now();
  }

  private triggerAnimation() {
    this.isAnimating.set(false);
    setTimeout(() => {
      this.isAnimating.set(true);
      setTimeout(() => this.isAnimating.set(false), 380);
    }, 10);
  }
}

