import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LogicQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

@Component({
  selector: 'app-logic-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="challenge-content" *ngIf="currentQuestion">
      <h2 class="challenge-title">Logic Puzzle</h2>
      <p class="challenge-desc">Answer the following reasoning question.</p>
      
      <div class="question-box">
        <p>{{ currentQuestion.question }}</p>
      </div>
      
      <div class="options-grid">
        <button 
          *ngFor="let option of currentQuestion.options; let i = index"
          class="btn btn-outline option-btn"
          [class.invalid]="selectedIndex === i && hasError"
          (click)="verify(i)"
        >
          {{ option }}
        </button>
      </div>
      
      <p class="error-msg" *ngIf="hasError">Incorrect, please try again.</p>
    </div>
  `,
  styles: [`
    .challenge-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .challenge-title {
      font-size: 20px;
      font-weight: 600;
    }
    .challenge-desc {
      color: var(--text-secondary);
      font-size: 14px;
    }
    .question-box {
      background-color: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 24px;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .option-btn {
      padding: 16px;
      height: auto;
      white-space: normal;
      font-size: 15px;
    }
    .option-btn.invalid {
      border-color: var(--danger-color);
      background-color: rgba(255, 59, 48, 0.05);
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
    .error-msg {
      color: var(--danger-color);
      font-size: 12px;
      text-align: center;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `]
})
export class LogicChallengeComponent implements OnInit {
  @Output() passed = new EventEmitter<boolean>();
  
  questions: LogicQuestion[] = [
    {
      question: "If tomorrow is Tuesday, what is today?",
      options: ["Monday", "Wednesday", "Sunday", "Thursday"],
      correctIndex: 0
    },
    {
      question: "Which of these is not a programming language?",
      options: ["Python", "JavaScript", "Cobra", "HTML"],
      correctIndex: 3
    },
    {
      question: "If you have 3 apples and you take away 2, how many do you have?",
      options: ["1", "2", "3", "5"],
      correctIndex: 1
    },
    {
      question: "What comes next in the sequence: 2, 4, 8, 16, ...?",
      options: ["24", "32", "64", "18"],
      correctIndex: 1
    }
  ];
  
  currentQuestion!: LogicQuestion;
  hasError = false;
  selectedIndex: number | null = null;

  ngOnInit() {
    this.generateQuestion();
  }

  generateQuestion() {
    this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
    this.hasError = false;
    this.selectedIndex = null;
  }

  verify(index: number) {
    this.selectedIndex = index;
    if (index === this.currentQuestion.correctIndex) {
      this.passed.emit(true);
    } else {
      this.hasError = true;
      setTimeout(() => this.generateQuestion(), 800);
    }
  }
}
