import { Injectable } from '@angular/core';
import { CaptchaStage, CaptchaStageType } from '../models/captcha-stage.model';

@Injectable({
  providedIn: 'root'
})
export class CaptchaEngineService {
  private readonly AVAILABLE_STAGES: CaptchaStageType[] = ['math', 'logic', 'pattern', 'image'];
  
  constructor() {}

  generateSessionStages(count: number = 3): CaptchaStage[] {
    const shuffled = [...this.AVAILABLE_STAGES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, this.AVAILABLE_STAGES.length));
    
    return selected.map(type => ({
      id: crypto.randomUUID(),
      type,
      passed: false
    }));
  }
}
