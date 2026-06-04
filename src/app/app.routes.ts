import { Routes } from '@angular/router';
import { resultGuard } from './guards/result.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'captcha',
    loadComponent: () => import('./captcha/captcha.component').then(m => m.CaptchaComponent)
  },
  {
    path: 'result',
    canActivate: [resultGuard],
    loadComponent: () => import('./result/result.component').then(m => m.ResultComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
