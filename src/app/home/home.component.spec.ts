import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterModule.forRoot([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the page heading', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Verify you are human');
  });

  it('should have a "Start Challenge" button with routerLink to /captcha', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[routerLink]');
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute('ng-reflect-router-link') ?? btn?.getAttribute('routerLink')).toContain('captcha');
  });
});
