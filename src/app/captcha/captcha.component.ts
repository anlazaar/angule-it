import { Component, inject, OnInit } from '@angular/core';
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
    ImageChallengeComponent
  ],
  template: `
    <div class="card captcha-card">
      <div class="captcha-header">
        <div class="progress-bar-container">
          <div class="progress-bar" [style.width]="progressPercent + '%'"></div>
        </div>
        <div class="stage-info">
          <span class="stage-text">Step {{ state.currentStageIndex() + 1 }} of {{ state.stages().length }}</span>
          <span class="secure-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Secure
          </span>
        </div>
      </div>
      
      <div class="challenge-container" [ngSwitch]="currentStage?.type || ''">
        <app-math-challenge *ngSwitchCase="'math'" (passed)="onStagePassed($event)"></app-math-challenge>
        <app-logic-challenge *ngSwitchCase="'logic'" (passed)="onStagePassed($event)"></app-logic-challenge>
        <app-pattern-challenge *ngSwitchCase="'pattern'" (passed)="onStagePassed($event)"></app-pattern-challenge>
        <app-image-challenge *ngSwitchCase="'image'" (passed)="onStagePassed($event)"></app-image-challenge>
      </div>
    </div>
  `,
  styles: [`
    .captcha-card {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .captcha-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .progress-bar-container {
      width: 100%;
      height: 6px;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: var(--radius-full);
      overflow: hidden;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      border-radius: var(--radius-full);
      transition: width var(--transition-normal);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
    }
    .stage-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .secure-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--success-color);
    }
    .challenge-container {
      animation: fade-in var(--transition-normal) forwards;
    }
  `]
})
export class CaptchaComponent implements OnInit {
  state = inject(CaptchaStateService);
  engine = inject(CaptchaEngineService);
  router = inject(Router);

  private stageStartTime = 0;

  get currentStage(): import('../models/captcha-stage.model').CaptchaStage | undefined {
    return this.state.stages()[this.state.currentStageIndex()];
  }

  get progressPercent() {
    const total = this.state.stages().length;
    if (total === 0) return 0;
    return (this.state.currentStageIndex() / total) * 100;
  }

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
      this.stageStartTime = Date.now(); // reset for next stage
    }
  }
}
