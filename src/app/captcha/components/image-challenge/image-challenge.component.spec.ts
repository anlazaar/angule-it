import { TestBed } from '@angular/core/testing';
import { ImageChallengeComponent } from './image-challenge.component';

describe('ImageChallengeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageChallengeComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should generate a 9-item grid on init', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.images.length).toBe(9);
  });

  it('should set a targetCategory on init', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.targetCategory).toBeTruthy();
  });

  it('should show error and not emit when verifying with no selection', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    spyOn(component.passed, 'emit');
    component.verify();

    expect(component.hasError).toBeTrue();
    expect(component.errorMessage).toContain('Please select at least one');
    expect(component.passed.emit).not.toHaveBeenCalled();
  });

  it('should emit true when all selections are correct', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    // Select exactly the target items
    component.images.forEach((img, i) => {
      component.images[i].selected = img.isTarget;
    });

    spyOn(component.passed, 'emit');
    component.verify();

    expect(component.passed.emit).toHaveBeenCalledWith(true);
  });

  it('should show error and reset selection when answer is wrong', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    // Select wrong items (non-targets only)
    const hasNonTarget = component.images.some(img => !img.isTarget);
    if (hasNonTarget) {
      component.images.forEach((img, i) => {
        component.images[i].selected = !img.isTarget;
      });

      spyOn(component.passed, 'emit');
      component.verify();

      expect(component.hasError).toBeTrue();
      expect(component.images.every(img => !img.selected)).toBeTrue();
    } else {
      // Edge case: all are targets; skip
      expect(true).toBeTrue();
    }
  });
});
