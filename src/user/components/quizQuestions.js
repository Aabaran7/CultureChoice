export const QUIZ_QUESTIONS = [
  {
    id: 'pg1',
    questions: [
      {
        id: 'q1',
        question: 'Do all three wheels have the same probability of winning?',
        multiSelect: false,
        answers: [
          'Yes, all three wheels are identical',
          'No, some wheels are more likely to win',
          'It depends on the trial',
        ],
        correctAnswer: ['Yes, all three wheels are identical'],
      },
      {
        id: 'q2',
        question: 'Who chooses the wheel on "computer decides" trials?',
        multiSelect: false,
        answers: ['I choose the wheel', 'The computer chooses, and I click to confirm', 'We both choose together'],
        correctAnswer: ['The computer chooses, and I click to confirm'],
      },
    ],
  },
]
