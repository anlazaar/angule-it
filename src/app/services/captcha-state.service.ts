import { Injectable, computed, inject, signal } from '@angular/core';
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

  // Core signals
  public currentStageIndex = signal<number>(0);
  public stages = signal<CaptchaStage[]>([]);
  public isCompleted = signal<boolean>(false);
  public score = signal<number>(0);

  // Computed signals
  public currentStage = computed<CaptchaStage | undefined>(() => {
    const list = this.stages();
    const idx = this.currentStageIndex();
    return list[idx];
  });

  public progressPercent = computed<number>(() => {
    const total = this.stages().length;
    if (total === 0) return 0;
    return Math.round((this.currentStageIndex() / total) * 100);
  });

  public isFirstStage = computed<boolean>(() => this.currentStageIndex() === 0);

  public isLastStage = computed<boolean>(() => {
    const total = this.stages().length;
    return total > 0 && this.currentStageIndex() === total - 1;
  });

  // Async queue to prevent race conditions during rapid state persistence
  private saveQueue: Promise<void> = Promise.resolve();

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

  startNewSession(newStages: CaptchaStage[]) {
    this.reset();
    this.initializeStages(newStages);
  }

  completeCurrentStage(passed: boolean, timeTaken: number) {
    const currentStages = [...this.stages()];
    const currentIndex = this.currentStageIndex();

    if (currentIndex >= 0 && currentIndex < currentStages.length) {
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
      if (this.isCompleted()) {
        this.isCompleted.set(false);
      }
      this.saveState();
    }
  }

  goToNextStage() {
    const current = this.currentStageIndex();
    const list = this.stages();

    if (current < list.length - 1 && list[current]?.passed) {
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

  /**
   * Helper for tests or async callers to wait for all pending saves to complete.
   */
  async flushSave(): Promise<void> {
    await this.saveQueue;
  }

  // ------------------------------------------------------------------------

  private calculateScore() {
    const total = this.stages().length;
    if (total === 0) {
      this.score.set(0);
      return;
    }
    const passedCount = this.stages().filter((s) => s.passed).length;
    this.score.set(Math.round((passedCount / total) * 100));
  }

  private saveState(): void {
    const state: PersistedState = {
      stages: this.stages(),
      currentIndex: this.currentStageIndex(),
      isCompleted: this.isCompleted(),
      score: this.score(),
    };

    const data = JSON.stringify(state);

    // Queue save operation sequentially to prevent async signature race conditions
    this.saveQueue = this.saveQueue.then(async () => {
      try {
        const signature = await this.security.sign(data);
        const stored: StoredState = { data, signature };
        localStorage.setItem(this.STATE_KEY, JSON.stringify(stored));
      } catch (err) {
        console.error('[CaptchaStateService] Save failed:', err);
      }
    });
  }

  private async loadState(): Promise<void> {
    const raw = localStorage.getItem(this.STATE_KEY);
    if (!raw) return;

    try {
      const stored: StoredState = JSON.parse(raw);
      const valid = await this.security.verify(stored.data, stored.signature);

      if (!valid) {
        console.warn('[Storage] Captcha state signature invalid or tampered with.');
        localStorage.removeItem(this.STATE_KEY);
        return;
      }

      const state: PersistedState = JSON.parse(stored.data);
      const loadedStages = state.stages ?? [];
      let loadedIndex = state.currentIndex ?? 0;

      // Validate bounds to prevent invalid stage index state
      if (loadedIndex < 0 || (loadedStages.length > 0 && loadedIndex >= loadedStages.length)) {
        loadedIndex = 0;
      }

      this.stages.set(loadedStages);
      this.currentStageIndex.set(loadedIndex);
      this.isCompleted.set(state.isCompleted ?? false);
      this.score.set(state.score ?? 0);
    } catch (err) {
      console.error('[Storage] Failed to restore captcha state:', err);
      localStorage.removeItem(this.STATE_KEY);
    }
  }
}

