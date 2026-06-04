import { Injectable, signal } from '@angular/core';
import { CaptchaStage } from '../models/captcha-stage.model';

@Injectable({
  providedIn: 'root'
})
export class CaptchaStateService {
  private readonly STATE_KEY = 'angul_it_captcha_state';

  public currentStageIndex = signal<number>(0);
  public stages = signal<CaptchaStage[]>([]);
  public isCompleted = signal<boolean>(false);
  public score = signal<number>(0);

  constructor() {
    this.loadState();
  }

  initializeStages(newStages: CaptchaStage[]) {
    this.stages.set(newStages);
    this.currentStageIndex.set(0);
    this.isCompleted.set(false);
    this.score.set(0);
    this.saveState();
  }

  completeCurrentStage(passed: boolean, timeTaken: number) {
    const currentStages = [...this.stages()];
    const currentIndex = this.currentStageIndex();
    
    if (currentIndex < currentStages.length) {
      currentStages[currentIndex] = {
        ...currentStages[currentIndex],
        passed,
        timeTaken
      };
      
      this.stages.set(currentStages);
      
      if (currentIndex + 1 < currentStages.length) {
        this.currentStageIndex.set(currentIndex + 1);
      } else {
        this.isCompleted.set(true);
        this.calculateScore();
      }
      this.saveState();
    }
  }

  private calculateScore() {
    const passedCount = this.stages().filter(s => s.passed).length;
    this.score.set(Math.round((passedCount / this.stages().length) * 100));
  }

  reset() {
    localStorage.removeItem(this.STATE_KEY);
    this.stages.set([]);
    this.currentStageIndex.set(0);
    this.isCompleted.set(false);
    this.score.set(0);
  }

  private saveState() {
    const state = {
      stages: this.stages(),
      currentIndex: this.currentStageIndex(),
      isCompleted: this.isCompleted(),
      score: this.score()
    };
    localStorage.setItem(this.STATE_KEY, JSON.stringify(state));
  }

  private loadState() {
    const saved = localStorage.getItem(this.STATE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.stages.set(state.stages || []);
        this.currentStageIndex.set(state.currentIndex || 0);
        this.isCompleted.set(state.isCompleted || false);
        this.score.set(state.score || 0);
      } catch (e) {
        this.reset();
      }
    }
  }
}
