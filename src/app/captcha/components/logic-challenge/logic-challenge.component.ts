import { Component, OnInit, output, signal } from '@angular/core';
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
    <div class="challenge-content">
      <h2 class="challenge-title">Logic Puzzle</h2>
      <p class="challenge-desc">Answer the reasoning question below.</p>

      @if (currentQuestion(); as question) {
        <div class="question-box">
          <p>{{ question.question }}</p>
        </div>

        <div class="options-grid">
          @for (option of question.options; track $index) {
            <button
              class="btn btn-outline option-btn"
              [class.invalid]="selectedIndex() === $index && hasError()"
              (click)="verify($index)"
            >
              {{ option }}
            </button>
          }
        </div>
      }

      @if (hasError()) {
        <p class="error-msg">Incorrect answer, please try again.</p>
      }
    </div>
  `,
  styles: [
    `
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
        margin-top: -12px;
      }
      .question-box {
        background: rgba(15, 23, 42, 0.03);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 24px;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        line-height: 1.4;
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
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
      }
      .option-btn.invalid {
        border-color: var(--danger-color);
        background-color: rgba(255, 59, 48, 0.05);
        animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
      .error-msg {
        color: var(--danger-color);
        font-size: 13px;
        font-weight: 500;
        text-align: center;
      }
      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
      }
    `,
  ],
})
export class LogicChallengeComponent implements OnInit {
  passed = output<boolean>();

  private readonly questions: LogicQuestion[] = [
    { question: 'Which month comes after April?', options: ['March', 'May', 'June', 'July'], correctIndex: 1 },
    { question: 'How many days are in one week?', options: ['5', '6', '7', '8'], correctIndex: 2 },
    { question: 'What color is the sky on a clear day?', options: ['Blue', 'Green', 'Purple', 'Orange'], correctIndex: 0 },
    { question: 'Which number is even?', options: ['3', '5', '8', '9'], correctIndex: 2 },
    { question: 'What is 10 - 4?', options: ['5', '6', '7', '8'], correctIndex: 1 },
    { question: 'Which animal can fly?', options: ['Dog', 'Bird', 'Fish', 'Horse'], correctIndex: 1 },
    { question: 'Which is the smallest number?', options: ['12', '3', '8', '15'], correctIndex: 1 },
    { question: 'If today is Friday, what is tomorrow?', options: ['Thursday', 'Saturday', 'Sunday', 'Monday'], correctIndex: 1 },
    { question: 'How many wheels does a bicycle usually have?', options: ['1', '2', '3', '4'], correctIndex: 1 },
    { question: 'Which of these is a fruit?', options: ['Carrot', 'Potato', 'Apple', 'Onion'], correctIndex: 2 },
    { question: 'Which shape has three sides?', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], correctIndex: 1 },
    { question: 'What is 5 + 7?', options: ['11', '12', '13', '14'], correctIndex: 1 },
    { question: 'Which one is a season?', options: ['Morning', 'Winter', 'Weekend', 'Noon'], correctIndex: 1 },
    { question: 'Which letter comes after B?', options: ['A', 'C', 'D', 'E'], correctIndex: 1 },
    { question: 'How many hours are in one day?', options: ['12', '18', '24', '36'], correctIndex: 2 },
  ];

  currentQuestion = signal<LogicQuestion | null>(null);
  hasError = signal(false);
  selectedIndex = signal<number | null>(null);

  ngOnInit() {
    this.generateQuestion();
  }

  generateQuestion() {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion.set(this.questions[randomIndex]);
    this.hasError.set(false);
    this.selectedIndex.set(null);
  }

  verify(index: number) {
    this.selectedIndex.set(index);
    const q = this.currentQuestion();
    if (q && index === q.correctIndex) {
      this.passed.emit(true);
    } else {
      this.hasError.set(true);
      setTimeout(() => {
        this.generateQuestion();
      }, 700);
    }
  }
}

