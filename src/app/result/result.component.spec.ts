import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ResultComponent } from './result.component';
import { CaptchaStateService } from '../services/captcha-state.service';
import { CaptchaStage } from '../models/captcha-stage.model';

describe('ResultComponent', () => {
  let stateService: CaptchaStateService;
  let router: Router;

  const completedStages: CaptchaStage[] = [
    { id: '1', type: 'math',    passed: true,  timeTaken: 1200 },
    { id: '2', type: 'image',   passed: false, timeTaken: 3400 },
    { id: '3', type: 'logic',   passed: true,  timeTaken: 900  }
  ];

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ResultComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    stateService = TestBed.inject(CaptchaStateService);
    router = TestBed.inject(Router);

    // Simulate a completed session
    stateService.initializeStages(completedStages);
    stateService.completeCurrentStage(true,  1200); // stage 0
    stateService.completeCurrentStage(false, 3400); // stage 1
    stateService.completeCurrentStage(true,  900);  // stage 2 — marks completed
  });

  afterEach(() => localStorage.clear());

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ResultComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the score', () => {
    const fixture = TestBed.createComponent(ResultComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.score-circle')?.textContent).toContain(stateService.score().toString());
  });

  it('should list all challenge stages', () => {
    const fixture = TestBed.createComponent(ResultComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.summary-item');
    expect(items.length).toBe(3);
  });

  it('should reset state and navigate to / on restart', () => {
    const fixture = TestBed.createComponent(ResultComponent);
    fixture.detectChanges();
    spyOn(stateService, 'reset');
    spyOn(router, 'navigate');

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.restart-btn');
    btn.click();

    expect(stateService.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
