import { TestBed } from '@angular/core/testing';
import { CaptchaStateService } from './captcha-state.service';
import { CaptchaStage } from '../models/captcha-stage.model';

describe('CaptchaStateService', () => {
  let service: CaptchaStateService;

  const mockStages: CaptchaStage[] = [
    { id: '1', type: 'math', passed: false },
    { id: '2', type: 'image', passed: false },
    { id: '3', type: 'logic', passed: false }
  ];

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptchaStateService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeStages', () => {
    it('should set stages and reset progress', () => {
      service.initializeStages(mockStages);
      expect(service.stages().length).toBe(3);
      expect(service.currentStageIndex()).toBe(0);
      expect(service.isCompleted()).toBeFalse();
      expect(service.score()).toBe(0);
    });

    it('should persist state to localStorage', () => {
      service.initializeStages(mockStages);
      const saved = localStorage.getItem('angul_it_captcha_state');
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      expect(parsed.stages.length).toBe(3);
    });
  });

  describe('completeCurrentStage', () => {
    beforeEach(() => service.initializeStages(mockStages));

    it('should advance to the next stage on completion', () => {
      service.completeCurrentStage(true, 1000);
      expect(service.currentStageIndex()).toBe(1);
    });

    it('should mark the stage with passed and timeTaken', () => {
      service.completeCurrentStage(true, 1500);
      expect(service.stages()[0].passed).toBeTrue();
      expect(service.stages()[0].timeTaken).toBe(1500);
    });

    it('should mark isCompleted and calculate score when all stages done', () => {
      service.completeCurrentStage(true, 100);  // stage 0
      service.completeCurrentStage(false, 200); // stage 1
      service.completeCurrentStage(true, 300);  // stage 2
      expect(service.isCompleted()).toBeTrue();
      expect(service.score()).toBe(67); // 2/3 rounded
    });
  });

  describe('goToPreviousStage', () => {
    beforeEach(() => {
      service.initializeStages(mockStages);
      service.completeCurrentStage(true, 500);
    });

    it('should decrement the stage index', () => {
      expect(service.currentStageIndex()).toBe(1);
      service.goToPreviousStage();
      expect(service.currentStageIndex()).toBe(0);
    });

    it('should reset completion state', () => {
      service.goToPreviousStage();
      expect(service.isCompleted()).toBeFalse();
    });

    it('should not go below index 0', () => {
      service.goToPreviousStage(); // now at 0
      service.goToPreviousStage(); // should stay at 0
      expect(service.currentStageIndex()).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear all state', () => {
      service.initializeStages(mockStages);
      service.reset();
      expect(service.stages().length).toBe(0);
      expect(service.currentStageIndex()).toBe(0);
      expect(service.isCompleted()).toBeFalse();
      expect(service.score()).toBe(0);
      expect(localStorage.getItem('angul_it_captcha_state')).toBeNull();
    });
  });

  describe('state persistence', () => {
    it('should restore state from localStorage on construction', () => {
      service.initializeStages(mockStages);
      service.completeCurrentStage(true, 800);

      // Re-create the service (simulate page refresh)
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(CaptchaStateService);

      expect(newService.stages().length).toBe(3);
      expect(newService.currentStageIndex()).toBe(1);
    });
  });
});
