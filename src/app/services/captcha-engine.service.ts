import { Injectable } from '@angular/core';
import { CaptchaStage, CaptchaStageType } from '../models/captcha-stage.model';

@Injectable({
  providedIn: 'root',
})
export class CaptchaEngineService {
  private readonly AVAILABLE_STAGES: CaptchaStageType[] = [
    'math',
    'logic',
    'pattern',
    'image',
  ];

  generateSessionStages(count: number = 3): CaptchaStage[] {
    // Fisher-Yates shuffle algorithm for unbiased randomization
    const shuffled = [...this.AVAILABLE_STAGES];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selected = shuffled.slice(
      0,
      Math.min(count, this.AVAILABLE_STAGES.length)
    );

    return selected.map((type) => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `stage-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      passed: false,
    }));
  }
}

