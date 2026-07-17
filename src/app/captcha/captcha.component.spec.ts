import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { CaptchaComponent } from './captcha.component';
import { CaptchaStateService } from '../services/captcha-state.service';
import { CaptchaEngineService } from '../services/captcha-engine.service';
import { CaptchaStage } from '../models/captcha-stage.model';

describe('CaptchaComponent', () => {
  let stateService: CaptchaStateService;
  let router: Router;

  const mockStages: CaptchaStage[] = [
    { id: '1', type: 'math', passed: false },
    { id: '2', type: 'image', passed: false },
    { id: '3', type: 'logic', passed: false }
  ];

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CaptchaComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    stateService = TestBed.inject(CaptchaStateService);
    router = TestBed.inject(Router);
  });

  afterEach(() => localStorage.clear());

  it('should create the component', () => {
    const fixture = TestBed.createComponent(CaptchaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize stages via engine if none exist', () => {
    const fixture = TestBed.createComponent(CaptchaComponent);
    fixture.detectChanges(); // triggers ngOnInit
    expect(stateService.stages().length).toBeGreaterThan(0);
  });

  it('should not show back button on stage 1', () => {
    stateService.initializeStages(mockStages);
    const fixture = TestBed.createComponent(CaptchaComponent);
    fixture.detectChanges();
    const backBtn = fixture.nativeElement.querySelector('.btn-back');
    expect(backBtn).toBeNull();
  });

  it('should show back button on stage 2+', () => {
    stateService.initializeStages(mockStages);
    stateService.completeCurrentStage(true, 500); // move to stage 2
    const fixture = TestBed.createComponent(CaptchaComponent);
    fixture.detectChanges();
    const backBtn = fixture.nativeElement.querySelector('.btn-back');
    expect(backBtn).not.toBeNull();
  });

  it('should call goToPreviousStage when back button clicked', () => {
    stateService.initializeStages(mockStages);
    stateService.completeCurrentStage(true, 500);
    const fixture = TestBed.createComponent(CaptchaComponent);
    fixture.detectChanges();

    spyOn(stateService, 'goToPreviousStage');
    const backBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-back');
    backBtn.click();
    expect(stateService.goToPreviousStage).toHaveBeenCalled();
  });

  it('should redirect to /result when all stages complete', () => {
    stateService.initializeStages(mockStages);
    const fixture = TestBed.createComponent(CaptchaComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    spyOn(router, 'navigate');
    // Complete all stages via onStagePassed
    stateService.completeCurrentStage(true, 100); // stage 0
    stateService.completeCurrentStage(true, 100); // stage 1
    // Simulate last stage passed event
    component.onStagePassed(true);

    expect(router.navigate).toHaveBeenCalledWith(['/result']);
  });
});
