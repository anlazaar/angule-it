import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaStateService } from '../services/captcha-state.service';

export const resultGuard: CanActivateFn = (route, state) => {
  const captchaState = inject(CaptchaStateService);
  const router = inject(Router);

  if (captchaState.isCompleted()) {
    return true;
  }

  return router.parseUrl('/captcha');
};
