export type CaptchaStageType = 'math' | 'logic' | 'pattern' | 'image';

export interface CaptchaStage {
  id: string;
  type: CaptchaStageType;
  passed: boolean;
  timeTaken?: number;
  userAnswer?: unknown;
}
