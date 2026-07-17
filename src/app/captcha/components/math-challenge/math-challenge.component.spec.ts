import { TestBed } from '@angular/core/testing';
import { MathChallengeComponent } from './math-challenge.component';

describe('MathChallengeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathChallengeComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MathChallengeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should generate an equation on init', () => {
    const fixture = TestBed.createComponent(MathChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.num1).toBeGreaterThan(0);
    expect(component.num2).toBeGreaterThan(0);
    expect(['+', '-', '*']).toContain(component.operator);
    expect(component.expectedAnswer).toBeDefined();
  });

  it('should disable Verify button when input is empty', () => {
    const fixture = TestBed.createComponent(MathChallengeComponent);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-primary');
    expect(btn.disabled).toBeTrue();
  });

  it('should enable Verify button when input has a value', () => {
    const fixture = TestBed.createComponent(MathChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.answerControl.setValue(42);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-primary');
    expect(btn.disabled).toBeFalse();
  });

  it('should emit true when the correct answer is entered', () => {
    const fixture = TestBed.createComponent(MathChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    spyOn(component.passed, 'emit');
    component.answerControl.setValue(component.expectedAnswer);
    component.verify();

    expect(component.passed.emit).toHaveBeenCalledWith(true);
    expect(component.hasError).toBeFalse();
  });

  it('should set hasError when the wrong answer is entered', () => {
    const fixture = TestBed.createComponent(MathChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    spyOn(component.passed, 'emit');
    // Use a clearly wrong answer
    component.answerControl.setValue(component.expectedAnswer + 999);
    component.verify();

    expect(component.hasError).toBeTrue();
    expect(component.passed.emit).not.toHaveBeenCalled();
  });
});
