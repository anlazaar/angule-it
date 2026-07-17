import { Injectable, inject, signal } from '@angular/core';
import { CaptchaStage } from '../models/captcha-stage.model';
import { StorageSecurityService } from './storage-security.service';

interface PersistedState {
  stages: CaptchaStage[];
  currentIndex: number;
  isCompleted: boolean;
  score: number;
}

interface StoredState {
  data: string;
  signature: string;
}

@Injectable({
  providedIn: 'root',
})
export class CaptchaStateService {
  private readonly STATE_KEY = 'angul_it_captcha_state';

  private security = inject(StorageSecurityService);

  public currentStageIndex = signal<number>(0);
  public stages = signal<CaptchaStage[]>([]);
  public isCompleted = signal<boolean>(false);
  public score = signal<number>(0);

  async initialize(): Promise<void> {
    await this.loadState();
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
        timeTaken,
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

  goToPreviousStage() {
    if (this.currentStageIndex() > 0) {
      this.currentStageIndex.update((i) => i - 1);
      this.saveState();
    }
  }

  goToNextStage() {
    const current = this.currentStageIndex();

    if (current < this.stages().length - 1 && this.stages()[current].passed) {
      this.currentStageIndex.set(current + 1);
      this.saveState();
    }
  }

  reset() {
    localStorage.removeItem(this.STATE_KEY);
    this.stages.set([]);
    this.currentStageIndex.set(0);
    this.isCompleted.set(false);
    this.score.set(0);
  }

  // ------------------------------------------------------------------------

  private calculateScore() {
    const passedCount = this.stages().filter((s) => s.passed).length;

    this.score.set(Math.round((passedCount / this.stages().length) * 100));
  }

  private saveState(): void {
    const state: PersistedState = {
      stages: this.stages(),
      currentIndex: this.currentStageIndex(),
      isCompleted: this.isCompleted(),
      score: this.score(),
    };

    const data = JSON.stringify(state);

    this.security
      .sign(data)
      .then((signature) => {
        const stored: StoredState = {
          data,
          signature,
        };

        localStorage.setItem(this.STATE_KEY, JSON.stringify(stored));
      })
      .catch((err) => {
        console.error('[Storage] Save failed:', err);
      });
  }

  private async loadState(): Promise<void> {
    const raw = localStorage.getItem(this.STATE_KEY);

    if (!raw) return;

    try {
      const stored: StoredState = JSON.parse(raw);

      const valid = await this.security.verify(stored.data, stored.signature);

      if (!valid) {
        console.warn('[Storage] State has been tampered with.');
        localStorage.removeItem(this.STATE_KEY);
        return;
      }

      const state: PersistedState = JSON.parse(stored.data);

      this.stages.set(state.stages ?? []);
      this.currentStageIndex.set(state.currentIndex ?? 0);
      this.isCompleted.set(state.isCompleted ?? false);
      this.score.set(state.score ?? 0);
    } catch (err) {
      console.error('[Storage] Failed to restore state:', err);
      localStorage.removeItem(this.STATE_KEY);
    }
  }
}
