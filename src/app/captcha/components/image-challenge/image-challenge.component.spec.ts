import { TestBed } from '@angular/core/testing';
import { ImageChallengeComponent } from './image-challenge.component';

describe('ImageChallengeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageChallengeComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should generate a 9-item grid on init', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.images().length).toBe(9);
  });

  it('should set a targetCategory on init', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.targetCategory()).toBeTruthy();
  });

  it('should show error and not emit when verifying with no selection', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    spyOn(component.passed, 'emit');
    component.verify();

    expect(component.hasError()).toBeTrue();
    expect(component.errorMessage()).toContain('Please select at least one');
    expect(component.passed.emit).not.toHaveBeenCalled();
  });

  it('should emit true when all selections are correct', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    // Select exactly the target items
    const updated = component.images().map((img) => ({
      ...img,
      selected: img.isTarget,
    }));
    component.images.set(updated);

    spyOn(component.passed, 'emit');
    component.verify();

    expect(component.passed.emit).toHaveBeenCalledWith(true);
  });

  it('should show error when answer is wrong', () => {
    const fixture = TestBed.createComponent(ImageChallengeComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const currentImages = component.images();
    const hasNonTarget = currentImages.some((img) => !img.isTarget);
    if (hasNonTarget) {
      const updated = currentImages.map((img) => ({
        ...img,
        selected: !img.isTarget,
      }));
      component.images.set(updated);

      spyOn(component.passed, 'emit');
      component.verify();

      expect(component.hasError()).toBeTrue();
    } else {
      expect(true).toBeTrue();
    }
  });
});

