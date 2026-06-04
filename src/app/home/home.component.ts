import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card home-card">
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <h1>Verify you are human</h1>
      <p>Please complete a quick security check to continue your journey.</p>
      <button routerLink="/captcha" class="btn btn-primary start-btn">
        Start Challenge
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 8px">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .home-card {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }
    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-full);
      background-color: var(--bg-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-color);
      margin-bottom: 8px;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    p {
      color: var(--text-secondary);
      font-size: 15px;
      max-width: 300px;
    }
    .start-btn {
      margin-top: 8px;
      width: 100%;
    }
  `]
})
export class HomeComponent {}
