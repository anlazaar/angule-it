import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

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
        animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
      .error-msg {
        color: var(--danger-color);
        font-size: 12px;
        text-align: center;
      }
      @keyframes shake {
        10%,
        90% {
          transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
          transform: translate3d(2px, 0, 0);
        }
        30%,
        50%,
        70% {
          transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
          transform: translate3d(4px, 0, 0);
        }
      }
    `,
  ],
})
export class LogicChallengeComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  @Output() passed = new EventEmitter<boolean>();

  questions: LogicQuestion[] = [
    {
      question: 'Which month comes after April?',
      options: ['March', 'May', 'June', 'July'],
      correctIndex: 1,
    },
    {
      question: 'How many days are in one week?',
      options: ['5', '6', '7', '8'],
      correctIndex: 2,
    },
    {
      question: 'What color is the sky on a clear day?',
      options: ['Blue', 'Green', 'Purple', 'Orange'],
      correctIndex: 0,
    },
    {
      question: 'Which number is even?',
      options: ['3', '5', '8', '9'],
      correctIndex: 2,
    },
    {
      question: 'What is 10 - 4?',
      options: ['5', '6', '7', '8'],
      correctIndex: 1,
    },
    {
      question: 'Which animal can fly?',
      options: ['Dog', 'Bird', 'Fish', 'Horse'],
      correctIndex: 1,
    },
    {
      question: 'Which is the smallest number?',
      options: ['12', '3', '8', '15'],
      correctIndex: 1,
    },
    {
      question: 'If today is Friday, what is tomorrow?',
      options: ['Thursday', 'Saturday', 'Sunday', 'Monday'],
      correctIndex: 1,
    },
    {
      question: 'How many wheels does a bicycle usually have?',
      options: ['1', '2', '3', '4'],
      correctIndex: 1,
    },
    {
      question: 'Which of these is a fruit?',
      options: ['Carrot', 'Potato', 'Apple', 'Onion'],
      correctIndex: 2,
    },
    {
      question: 'Which shape has three sides?',
      options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
      correctIndex: 1,
    },
    {
      question: 'What is 5 + 7?',
      options: ['11', '12', '13', '14'],
      correctIndex: 1,
    },
    {
      question: 'Which one is a season?',
      options: ['Morning', 'Winter', 'Weekend', 'Noon'],
      correctIndex: 1,
    },
    {
      question: 'Which letter comes after B?',
      options: ['A', 'C', 'D', 'E'],
      correctIndex: 1,
    },
    {
      question: 'How many hours are in one day?',
      options: ['12', '18', '24', '36'],
      correctIndex: 2,
    },
    {
      question: 'Which number is greater?',
      options: ['15', '9', '12', '8'],
      correctIndex: 0,
    },
    {
      question: "What is the opposite of 'up'?",
      options: ['Left', 'Right', 'Down', 'Forward'],
      correctIndex: 2,
    },
    {
      question: 'Which of these is a color?',
      options: ['Banana', 'Blue', 'Table', 'Window'],
      correctIndex: 1,
    },
    {
      question: 'How many legs does a spider have?',
      options: ['6', '8', '10', '12'],
      correctIndex: 1,
    },
    {
      question: 'What comes before 100?',
      options: ['98', '99', '101', '97'],
      correctIndex: 1,
    },
    {
      question: 'Which is a drink?',
      options: ['Water', 'Bread', 'Rice', 'Cheese'],
      correctIndex: 0,
    },
    {
      question: 'Which day comes after Sunday?',
      options: ['Monday', 'Tuesday', 'Saturday', 'Friday'],
      correctIndex: 0,
    },
    {
      question: 'How many minutes are in one hour?',
      options: ['30', '45', '60', '90'],
      correctIndex: 2,
    },
    {
      question: 'Which is heavier?',
      options: ['1 kg', '500 g', '250 g', '100 g'],
      correctIndex: 0,
    },
    {
      question: 'What is 9 × 2?',
      options: ['16', '18', '20', '21'],
      correctIndex: 1,
    },
    {
      question: 'Which one is a vehicle?',
      options: ['Chair', 'Car', 'Tree', 'Book'],
      correctIndex: 1,
    },
    {
      question: 'Which is a primary color?',
      options: ['Purple', 'Pink', 'Red', 'Brown'],
      correctIndex: 2,
    },
    {
      question: 'How many months are in a year?',
      options: ['10', '11', '12', '13'],
      correctIndex: 2,
    },
    {
      question: 'Which number comes next: 5, 10, 15, ...?',
      options: ['18', '20', '25', '30'],
      correctIndex: 1,
    },
    {
      question: 'If you freeze water, what does it become?',
      options: ['Steam', 'Ice', 'Snow', 'Cloud'],
      correctIndex: 1,
    },
  ];

  currentQuestion!: LogicQuestion;
  hasError = false;
  selectedIndex: number | null = null;

  ngOnInit() {
    this.generateQuestion();
  }

  generateQuestion() {
    this.currentQuestion =
      this.questions[Math.floor(Math.random() * this.questions.length)];
    this.hasError = false;
    this.selectedIndex = null;
  }

  verify(index: number) {
    this.selectedIndex = index;
    if (index === this.currentQuestion.correctIndex) {
      this.passed.emit(true);
    } else {
      this.hasError = true;

      setTimeout(() => {
        this.generateQuestion();
        this.cdr.detectChanges();
      }, 800);
    }
  }
}
