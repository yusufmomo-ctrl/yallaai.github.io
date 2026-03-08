// HOME PAGE NAVIGATION
const homeScreen = document.getElementById('home-screen');
const tasksScreen = document.getElementById('tasks-screen');
const examScreenWrapper = document.getElementById('exam-screen-wrapper');
const taskCard = document.getElementById('task-card');
const examCard = document.getElementById('exam-card');
const homeBtn1 = document.getElementById('home-btn-tasks');
const homeBtn2 = document.getElementById('home-btn-exam');

taskCard.addEventListener('click', () => {
  homeScreen.classList.add('hidden');
  tasksScreen.classList.remove('hidden');
});

examCard.addEventListener('click', () => {
  homeScreen.classList.add('hidden');
  examScreenWrapper.classList.remove('hidden');
});

homeBtn1.addEventListener('click', () => {
  tasksScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
});

homeBtn2.addEventListener('click', () => {
  examScreenWrapper.classList.add('hidden');
  homeScreen.classList.remove('hidden');
});

// Step 1: Grab your HTML elements
const input = document.getElementById('task-input')
const addBtn = document.getElementById('add-btn')
const taskList = document.getElementById('task-list')
const counter = document.getElementById('counter')
const categorySelect = document.getElementById('category-select')
const deadlineInput = document.getElementById('deadline-input')

// Step 2: Keep track of how many tasks are left
let taskCount = 0

// Step 3: The main function that adds a task
function addTask() {
  // Don't do anything if input is empty
  if (input.value.trim() === '') return

  // Create a new list item
  const li = document.createElement('li')

  // Create the circle
  const circle = document.createElement('span')
  circle.classList.add('circle')

  // Create a span to hold the task text
  const taskText = document.createElement('span')
  taskText.classList.add('task-text')
  taskText.textContent = input.value

  // Create category span
  const categorySpan = document.createElement('span')
  categorySpan.classList.add('category')
  categorySpan.textContent = categorySelect.value

  // Create deadline span
  const deadlineSpan = document.createElement('span')
  deadlineSpan.classList.add('deadline')
  deadlineSpan.textContent = deadlineInput.value || 'No deadline'

  // Create the delete button
  const deleteBtn = document.createElement('button')
  deleteBtn.textContent = '✕'
  deleteBtn.classList.add('delete-btn')

  // Delete the task when delete button is clicked
  deleteBtn.addEventListener('click', () => {
    li.remove()
    taskCount--
    updateCounter()
  })

  // Complete the task when the circle is clicked
  circle.addEventListener('click', () => {
    li.classList.toggle('done')
    updateCounter()
  })

  // Put it all together
  li.appendChild(circle)
  li.appendChild(taskText)
  li.appendChild(categorySpan)
  li.appendChild(deadlineSpan)
  li.appendChild(deleteBtn)
  taskList.appendChild(li)

  // Clear inputs and update count
  input.value = ''
  categorySelect.value = 'Low'
  deadlineInput.value = ''
  taskCount++
  updateCounter()
}

// Step 4: Update the counter text
function updateCounter() {
  const doneTasks = document.querySelectorAll('li.done').length
  const remaining = taskCount - doneTasks
  counter.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`
}

// Step 5: Hook up the button and Enter key
addBtn.addEventListener('click', addTask)

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask()
})



// --- practice exam generator --------------------------------------------------
const notesInput = document.getElementById('notes-input');
const startExamBtn = document.getElementById('start-exam-btn');
const examScreen = document.getElementById('exam-screen');
const examResults = document.getElementById('exam-results');
const notesContainer = document.querySelector('.notes-container');
const questionArea = document.getElementById('question-area');
const examProgress = document.getElementById('exam-progress');
const nextQuestionBtn = document.getElementById('next-question-btn');
const backToNotesBtn = document.getElementById('back-to-notes-btn');
const retakeExamBtn = document.getElementById('retake-exam-btn');
const backNotesBtnResult = document.getElementById('back-notes-btn');
const finalScore = document.getElementById('final-score');

let examData = {
  questions: [],
  currentQuestion: 0,
  answers: [],
  notes: ''
};

// extract questions from notes
function generateExamQuestions(text, numQuestions = 5) {
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [];
  const questions = [];
  
  // extract key concepts and create questions
  for (let i = 0; i < Math.min(numQuestions, Math.max(1, Math.floor(sentences.length / 2))); i++) {
    const mainSentence = sentences[i * 2] || sentences[i];
    if (!mainSentence || mainSentence.trim().length < 10) continue;
    
    const words = mainSentence.match(/\b[A-Za-z]{5,}\b/g) || [];
    if (words.length === 0) continue;
    
    const keyWord = words[Math.floor(Math.random() * words.length)];
    const question = `Based on the notes, what can you infer about? "${keyWord}"?`;
    
    // generate answer options
    const correctAnswer = mainSentence.trim().substring(0, 100);
    const wrongAnswers = generateWrongAnswers(text, 3, mainSentence);
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    questions.push({
      question: question,
      options: options,
      correctAnswer: correctAnswer
    });
  }
  
  return questions.length > 0 ? questions : generateFallbackQuestions(text);
}

// generate wrong answer options
function generateWrongAnswers(text, count, exclude) {
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [];
  const answers = [];
  
  for (let i = 0; i < count && answers.length < count; i++) {
    const randomSent = sentences[Math.floor(Math.random() * sentences.length)];
    const cleaned = randomSent.trim().substring(0, 100);
    if (cleaned !== exclude.trim() && !answers.includes(cleaned)) {
      answers.push(cleaned);
    }
  }
  
  return answers;
}

// fallback questions if extraction fails
function generateFallbackQuestions(text) {
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [];
  const questions = [];
  
  for (let i = 0; i < Math.min(5, sentences.length - 1); i++) {
    const options = [
      sentences[i].trim().substring(0, 100),
      sentences[i + 1].trim().substring(0, 100),
      sentences[(i + 2) % sentences.length].trim().substring(0, 100),
      sentences[(i + 3) % sentences.length].trim().substring(0, 100)
    ].sort(() => Math.random() - 0.5);
    
    questions.push({
      question: `Which statement is most accurate?`,
      options: options,
      correctAnswer: sentences[i].trim().substring(0, 100)
    });
  }
  
  return questions;
}

// start exam
startExamBtn.addEventListener('click', () => {
  const notes = notesInput.value.trim();
  if (!notes) {
    alert('Please paste or upload notes first!');
    return;
  }
  
  examData.notes = notes;
  examData.questions = generateExamQuestions(notes, 5);
  examData.currentQuestion = 0;
  examData.answers = new Array(examData.questions.length).fill(null);
  
  notesContainer.style.display = 'none';
  examScreen.classList.remove('hidden');
  renderQuestion();
});

// render current question
function renderQuestion() {
  const q = examData.questions[examData.currentQuestion];
  if (!q) return;
  
  const isLast = examData.currentQuestion === examData.questions.length - 1;
  nextQuestionBtn.textContent = isLast ? 'Finish Exam' : 'Next Question';
  
  questionArea.innerHTML = `
    <div class="question-text">${q.question}</div>
    ${q.options.map((opt, idx) => `
      <div class="option" data-index="${idx}" data-text="${opt}">
        ${opt}
      </div>
    `).join('')}
  `;
  
  // add selection listeners
  document.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      examData.answers[examData.currentQuestion] = opt.dataset.text;
    });
  });
  
  // restore previous selection
  if (examData.answers[examData.currentQuestion]) {
    document.querySelectorAll('.option').forEach(opt => {
      if (opt.dataset.text === examData.answers[examData.currentQuestion]) {
        opt.classList.add('selected');
      }
    });
  }
  
  examProgress.textContent = `Question ${examData.currentQuestion + 1} of ${examData.questions.length}`;
}

// next question handler
nextQuestionBtn.addEventListener('click', () => {
  if (examData.currentQuestion < examData.questions.length - 1) {
    examData.currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
});

// back to notes
backToNotesBtn.addEventListener('click', () => {
  examScreen.classList.add('hidden');
  notesContainer.style.display = 'block';
});

// show results
function showResults() {
  let score = 0;
  examData.questions.forEach((q, idx) => {
    if (examData.answers[idx] === q.correctAnswer) {
      score++;
    }
  });
  
  const percentage = Math.round((score / examData.questions.length) * 100);
  finalScore.textContent = `You scored ${score} out of ${examData.questions.length} (${percentage}%)`;
  
  examScreen.classList.add('hidden');
  examResults.classList.remove('hidden');
}

// retake exam
retakeExamBtn.addEventListener('click', () => {
  examResults.classList.add('hidden');
  examScreen.classList.remove('hidden');
  examData.currentQuestion = 0;
  examData.answers = new Array(examData.questions.length).fill(null);
  renderQuestion();
});

// back to notes from results
backNotesBtnResult.addEventListener('click', () => {
  examResults.classList.add('hidden');
  notesContainer.style.display = 'block';
});


// --- flashcard generator --------------------------------------------------
const flashcardNotesInput = document.getElementById('flashcard-notes-input');
const generateFlashcardsBtn = document.getElementById('generate-flashcards-btn');
const flashcardStudyScreen = document.getElementById('flashcard-study-screen');
const flashcardProgress = document.getElementById('flashcard-progress');
const flashcardFront = document.getElementById('flashcard-front');
const flashcardBack = document.getElementById('flashcard-back');
const flipCardBtn = document.getElementById('flip-card-btn');
const nextFlashcardBtn = document.getElementById('next-flashcard-btn');
const flashcardBackToNotesBtn = document.getElementById('flashcard-back-to-notes-btn');
const flashcardCard = document.getElementById('flashcard-card');
const flashcardScreenWrapper = document.getElementById('flashcard-screen-wrapper');
const homeBtn3 = document.getElementById('home-btn-flashcards');

let flashcardData = {
  cards: [],
  currentCard: 0,
  showingFront: true
};

function generateFlashcards(text, numCards = 5) {
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [];
  const cards = [];

  for (let i = 0; i < Math.min(numCards, sentences.length); i++) {
    const sentence = sentences[i].trim();
    if (sentence.length < 12) continue;

    const words = sentence.match(/\b[A-Za-z]{4,}\b/g) || [];
    const keyword = words[0] || `Concept ${i + 1}`;

    cards.push({
      front: `What do your notes say about "${keyword}"?`,
      back: sentence
    });
  }

  if (cards.length === 0) {
    cards.push({
      front: 'No clear flashcards could be made.',
      back: 'Try using longer notes with full sentences.'
    });
  }

  return cards;
}

generateFlashcardsBtn.addEventListener('click', () => {
  const notes = flashcardNotesInput.value.trim();

  if (!notes) {
    alert('Please paste your notes first!');
    return;
  }

  flashcardData.cards = generateFlashcards(notes, 5);
  flashcardData.currentCard = 0;
  flashcardData.showingFront = true;

  document.querySelector('#flashcard-screen-wrapper .notes-container').style.display = 'none';
  flashcardStudyScreen.classList.remove('hidden');

  renderFlashcard();
});

function renderFlashcard() {
  const card = flashcardData.cards[flashcardData.currentCard];
  if (!card) return;

  flashcardFront.textContent = card.front;
  flashcardBack.textContent = card.back;

  flashcardFront.classList.remove('hidden');
  flashcardBack.classList.add('hidden');
  flashcardData.showingFront = true;

  flashcardProgress.textContent = `Card ${flashcardData.currentCard + 1} of ${flashcardData.cards.length}`;

  nextFlashcardBtn.textContent =
    flashcardData.currentCard === flashcardData.cards.length - 1 ? 'Start Over' : 'Next Card';
}

flipCardBtn.addEventListener('click', () => {
  flashcardData.showingFront = !flashcardData.showingFront;

  if (flashcardData.showingFront) {
    flashcardFront.classList.remove('hidden');
    flashcardBack.classList.add('hidden');
  } else {
    flashcardFront.classList.add('hidden');
    flashcardBack.classList.remove('hidden');
  }
});

nextFlashcardBtn.addEventListener('click', () => {
  if (flashcardData.currentCard === flashcardData.cards.length - 1) {
    flashcardData.currentCard = 0;
  } else {
    flashcardData.currentCard++;
  }

  renderFlashcard();
});

flashcardBackToNotesBtn.addEventListener('click', () => {
  flashcardStudyScreen.classList.add('hidden');
  document.querySelector('#flashcard-screen-wrapper .notes-container').style.display = 'block';
});

flashcardCard.addEventListener('click', () => {
  homeScreen.classList.add('hidden');
  flashcardScreenWrapper.classList.remove('hidden');
});

homeBtn3.addEventListener('click', () => {
  flashcardScreenWrapper.classList.add('hidden');
  homeScreen.classList.remove('hidden');
});