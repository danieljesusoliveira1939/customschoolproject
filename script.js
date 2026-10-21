// Banco de Perguntas de História e Geografia
const questions = [
    {
        category: "Geografia",
        question: "Qual é o maior país do mundo em extensão territorial?",
        options: ["Canadá", "Estados Unidos", "Rússia", "China"],
        correct: 2
    },
    {
        category: "História",
        question: "Em que ano teve início a Segunda Guerra Mundial?",
        options: ["1914", "1939", "1945", "1918"],
        correct: 1
    },
    {
        category: "Geografia",
        question: "Qual é a maior floresta tropical do planeta?",
        options: ["Floresta do Congo", "Taiga Siberiana", "Floresta Amazônica", "Mata Atlântica"],
        correct: 2
    },
    {
        category: "História",
        question: "Quem foi o primeiro presidente dos Estados Unidos?",
        options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John F. Kennedy"],
        correct: 1
    },
    {
        category: "Geografia",
        question: "Qual rio é considerado o mais extenso do mundo?",
        options: ["Rio Nilo", "Rio Amazonas", "Rio Mississipi", "Rio Yangtzé"],
        correct: 1
    },
    {
        category: "História",
        question: "Qual civilização antiga construiu as Pirâmides de Gizé?",
        options: ["Mesopotâmia", "Império Romano", "Grécia Antiga", "Egito Antigo"],
        correct: 3
    },
    {
        category: "Geografia",
        question: "Em qual continente fica localizado o deserto do Saara?",
        options: ["Ásia", "África", "Oceania", "América do Sul"],
        correct: 1
    },
    {
        category: "História",
        question: "Em que ano ocorreu a Proclamação da República no Brasil?",
        options: ["1500", "1822", "1889", "1930"],
        correct: 2
    },
    {
        category: "Geografia",
        question: "Qual é a capital do Japão?",
        options: ["Pequim", "Seul", "Quioto", "Tóquio"],
        correct: 3
    },
    {
        category: "História",
        question: "Qual evento marcou o fim da Idade Média em 1453?",
        options: ["Queda de Constantinopla", "Descobrimento da América", "Revolução Francesa", "Reforma Protestante"],
        correct: 0
    }
];

// Estado do Jogo
let currentQuestionIndex = 0;
let score = 0;

// Elementos do DOM
const categoryBadge = document.getElementById('category-badge');
const questionTracker = document.getElementById('question-tracker');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');
const nextBtn = document.getElementById('next-btn');
const resultScreen = document.getElementById('result-screen');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');

// Iniciar Quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultScreen.classList.add('hidden');
    document.querySelector('.quiz-header').classList.remove('hidden');
    document.querySelector('.progress-bar-container').classList.remove('hidden');
    questionText.classList.remove('hidden');
    optionsContainer.classList.remove('hidden');
    
    loadQuestion();
}

// Carregar pergunta atual
function loadQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];

    // Atualiza metadados
    categoryBadge.innerText = currentQuestion.category;
    questionTracker.innerText = `Pergunta ${currentQuestionIndex + 1}/${questions.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    
    // Atualiza o texto
    questionText.innerText = currentQuestion.question;

    // Gera botões das opções
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
}

// Limpar estado da pergunta anterior
function resetState() {
    feedbackMessage.classList.add('hidden');
    feedbackMessage.className = 'feedback hidden';
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = '';
}

// Processar resposta do usuário
function selectOption(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');

    // Desabilita todas as opções após escolha
    optionButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === currentQuestion.correct) {
            button.classList.add('correct');
        }
    });

    if (selectedIndex === currentQuestion.correct) {
        score++;
        feedbackMessage.innerText = "Resposta Correta!";
        feedbackMessage.classList.add('correct');
    } else {
        optionButtons[selectedIndex].classList.add('incorrect');
        feedbackMessage.innerText = "Resposta Incorreta!";
        feedbackMessage.classList.add('incorrect');
    }

    feedbackMessage.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

// Próxima pergunta ou tela de resultados
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Exibir resultado final
function showResults() {
    document.querySelector('.quiz-header').classList.add('hidden');
    document.querySelector('.progress-bar-container').classList.add('hidden');
    questionText.classList.add('hidden');
    optionsContainer.classList.add('hidden');
    feedbackMessage.classList.add('hidden');
    nextBtn.classList.add('hidden');

    finalScore.innerText = `${score} / ${questions.length}`;

    if (score === questions.length) {
        resultMessage.innerText = "Incrível! Você acertou todas as perguntas!";
    } else if (score >= questions.length * 0.7) {
        resultMessage.innerText = "Muito bem! Você demonstra um ótimo conhecimento!";
    } else if (score >= questions.length * 0.5) {
        resultMessage.innerText = "Bom trabalho, mas ainda pode melhorar!";
    } else {
        resultMessage.innerText = "Continue praticando e estudando mais História e Geografia!";
    }

    resultScreen.classList.remove('hidden');
}

restartBtn.addEventListener('click', startQuiz);

// Inicializa na carga da página
startQuiz();
