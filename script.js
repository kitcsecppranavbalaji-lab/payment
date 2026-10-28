/* ==========================================================
   Digital Payment Awareness - script.js
   Beginner-friendly JavaScript for an educational website.
   No login, no payments, no personal data is collected.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupActiveLinks();
  setupScrollReveal();
  setupQuiz();
});

/* ----------------------------------------------------------
   1. Mobile menu (hamburger button)
   ---------------------------------------------------------- */
function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close the menu when a link is tapped on a phone
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ----------------------------------------------------------
   2. Highlight the navigation link for the section on screen
   ---------------------------------------------------------- */
function setupActiveLinks() {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section");

  window.addEventListener("scroll", function () {
    let currentId = "home";

    sections.forEach(function (section) {
      // 100px offset so the sticky navbar does not cover the heading
      if (window.scrollY >= section.offsetTop - 100) {
        currentId = section.id;
      }
    });

    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  });
}

/* ----------------------------------------------------------
   3. Fade sections in as the user scrolls to them
   ---------------------------------------------------------- */
function setupScrollReveal() {
  // Only sections marked with the "section" class fade in, not the hero
  const sections = document.querySelectorAll("main section.section");

  if (!("IntersectionObserver" in window)) {
    return; // Older browsers: content simply stays visible
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(function (section) {
    section.classList.add("reveal-ready");
    observer.observe(section);
  });
}

/* ----------------------------------------------------------
   4. Awareness quiz
   ---------------------------------------------------------- */

// Each question has a text, 3 or 4 options, the index of the correct
// option, and a short explanation shown after the user answers.
const quizQuestions = [
  {
    question: "Someone asks you to enter your UPI PIN so that you can receive money. What should you do?",
    options: [
      "Enter the PIN, because it is needed to receive money",
      "Refuse, because you never need a UPI PIN to receive money",
      "Share the PIN only with people you know"
    ],
    correct: 1,
    explanation: "You enter your UPI PIN only to send money. Anyone asking for it to receive money is a scammer."
  },
  {
    question: "Which of these should you NEVER share with anyone?",
    options: [
      "Your mobile number",
      "Your OTP",
      "The name of your city"
    ],
    correct: 1,
    explanation: "An OTP is a one-time password that proves it is you. Sharing it lets someone else take your money."
  },
  {
    question: "You receive a message with a link saying you won a prize. What is the safest action?",
    options: [
      "Click the link quickly before the offer ends",
      "Delete the message and do not click the link",
      "Forward the link to your friends"
    ],
    correct: 1,
    explanation: "Prize links are a common phishing trick. Delete the message and never open suspicious links."
  },
  {
    question: "A customer care number is shown in an online search result. How should you check if it is genuine?",
    options: [
      "Call the first number you see",
      "Use the number printed on your bank's official website or card",
      "Ask a stranger on social media"
    ],
    correct: 1,
    explanation: "Fake helpline numbers can appear in search results. Always use the number from your bank's official source."
  },
  {
    question: "Money was taken from your account by fraud. What should you do first?",
    options: [
      "Wait a few days to see if it comes back",
      "Contact your bank immediately and call 1930",
      "Delete all your transaction messages"
    ],
    correct: 1,
    explanation: "Acting quickly helps. Contact your bank at once, call 1930, and save all evidence."
  }
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let answered = false;

function setupQuiz() {
  document.getElementById("nextBtn").addEventListener("click", goToNextQuestion);
  document.getElementById("restartBtn").addEventListener("click", restartQuiz);
  showQuestion();
}

// Display the current question and its options
function showQuestion() {
  const question = quizQuestions[currentQuestion];
  const optionsList = document.getElementById("optionsList");
  answered = false;

  document.getElementById("questionText").textContent = question.question;
  document.getElementById("quizCount").textContent =
    "Question " + (currentQuestion + 1) + " of " + quizQuestions.length;
  document.getElementById("quizScore").textContent = "Score: " + score;
  document.getElementById("progressFill").style.width =
    (currentQuestion / quizQuestions.length) * 100 + "%";

  const feedback = document.getElementById("feedback");
  feedback.textContent = "";
  feedback.className = "feedback";
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nextBtn").textContent =
    currentQuestion === quizQuestions.length - 1 ? "See My Score" : "Next Question";

  // Build one button for each option
  optionsList.innerHTML = "";
  question.options.forEach(function (optionText, index) {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = optionText;
    button.addEventListener("click", function () {
      checkAnswer(index);
    });
    optionsList.appendChild(button);
  });
}

// Check the chosen answer and show whether it was correct
function checkAnswer(chosenIndex) {
  if (answered) {
    return; // Only one answer is allowed per question
  }
  answered = true;

  const question = quizQuestions[currentQuestion];
  const buttons = document.querySelectorAll(".option-btn");
  const feedback = document.getElementById("feedback");

  buttons.forEach(function (button) {
    button.disabled = true;
  });

  if (chosenIndex === question.correct) {
    score++;
    buttons[chosenIndex].classList.add("correct");
    feedback.textContent = "✅ Correct! " + question.explanation;
    feedback.className = "feedback good";
  } else {
    buttons[chosenIndex].classList.add("wrong");
    buttons[question.correct].classList.add("correct"); // Show the right answer
    feedback.textContent = "❌ Not quite. The correct answer is highlighted. " + question.explanation;
    feedback.className = "feedback bad";
  }

  document.getElementById("quizScore").textContent = "Score: " + score;
  document.getElementById("nextBtn").disabled = false;
}

// Move to the next question, or show the final result
function goToNextQuestion() {
  currentQuestion++;

  if (currentQuestion < quizQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// Show the final score with a message
function showResult() {
  const total = quizQuestions.length;
  const percent = Math.round((score / total) * 100);

  document.getElementById("progressFill").style.width = "100%";
  document.getElementById("quizArea").hidden = true;

  const resultArea = document.getElementById("resultArea");
  resultArea.hidden = false;

  document.getElementById("resultTitle").textContent =
    "Your score: " + score + " out of " + total + " (" + percent + "%)";

  let icon = "📚";
  let message = "Good effort. Read the fraud and safety sections again, then try once more.";

  if (score === total) {
    icon = "🏆";
    message = "Excellent! You know how to stay safe while paying digitally.";
  } else if (score >= 3) {
    icon = "👍";
    message = "Well done. Review the questions you missed to strengthen your awareness.";
  }

  document.getElementById("resultIcon").textContent = icon;
  document.getElementById("resultText").textContent = message;
}

// Reset the quiz so it can be taken again
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("resultArea").hidden = true;
  document.getElementById("quizArea").hidden = false;
  showQuestion();
}
