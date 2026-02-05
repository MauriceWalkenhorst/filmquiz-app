/**
 * Film Quiz UI Controller
 */

const UI = {
    // Screen elements
    screens: {
        loading: document.getElementById('loading-screen'),
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        end: document.getElementById('end-screen'),
        leaderboard: document.getElementById('leaderboard-screen')
    },

    // Current screen
    currentScreen: 'loading',

    /**
     * Initialize UI
     */
    init() {
        this.loadPlayerName();
        this.setupEventListeners();
        this.loadCategories();
    },

    /**
     * Show a specific screen
     */
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Start screen
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('view-leaderboard-btn').addEventListener('click', () => this.showLeaderboard());
        
        // Player name input
        document.getElementById('player-name').addEventListener('input', (e) => {
            localStorage.setItem('filmQuizPlayerName', e.target.value);
        });

        // Game screen
        document.getElementById('quit-btn').addEventListener('click', () => this.quitGame());

        // End screen
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        document.getElementById('home-btn').addEventListener('click', () => this.showScreen('start'));

        // Leaderboard screen
        document.getElementById('back-btn').addEventListener('click', () => this.showScreen('start'));

        // Leaderboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadLeaderboard(e.target.dataset.tab);
            });
        });
    },

    /**
     * Load player name from storage
     */
    loadPlayerName() {
        const savedName = localStorage.getItem('filmQuizPlayerName');
        if (savedName) {
            document.getElementById('player-name').value = savedName;
        }
    },

    /**
     * Load and display categories
     */
    async loadCategories() {
        try {
            const response = await API.getCategories();
            const container = document.getElementById('category-grid');
            
            // Add "All" option
            const allCard = this.createCategoryCard({
                id: 'all',
                name: 'Alle Kategorien',
                icon: '🎲',
                description: 'Gemischte Fragen'
            }, true);
            container.appendChild(allCard);

            // Add category cards
            response.categories.forEach(cat => {
                container.appendChild(this.createCategoryCard(cat, false));
            });

            // Load stats
            const stats = await API.getStats();
            document.getElementById('total-questions-count').textContent = stats.stats.totalQuestions;

            // Load personal highscore
            const playerName = localStorage.getItem('filmQuizPlayerName');
            if (playerName) {
                try {
                    const playerStats = await API.getPlayerStats(playerName);
                    document.getElementById('your-highscore').textContent = playerStats.stats.bestScore || 0;
                } catch (e) {
                    document.getElementById('your-highscore').textContent = '0';
                }
            }

        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    },

    /**
     * Create category card element
     */
    createCategoryCard(category, selected) {
        const card = document.createElement('div');
        card.className = `category-card ${selected ? 'selected' : ''}`;
        card.dataset.category = category.id;
        card.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <div class="category-name">${category.name}</div>
            <div class="category-desc">${category.description}</div>
        `;

        card.addEventListener('click', () => {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });

        return card;
    },

    /**
     * Start the game
     */
    async startGame() {
        const playerName = document.getElementById('player-name').value.trim() || 'Spieler';
        const selectedCategory = document.querySelector('.category-card.selected')?.dataset.category || 'all';

        this.showScreen('loading');

        const success = await game.init(selectedCategory, playerName);
        
        if (success) {
            this.showScreen('game');
            this.displayQuestion();
        } else {
            this.showScreen('start');
            this.showToast('Konnte das Spiel nicht starten', 'error');
        }
    },

    /**
     * Display current question
     */
    displayQuestion() {
        const question = game.getCurrentQuestion();
        
        // Update UI
        document.getElementById('question-type').textContent = game.getCategoryName();
        document.getElementById('question').textContent = question.question;
        document.getElementById('hint').textContent = question.hint ? `💡 ${question.hint}` : '';
        document.getElementById('current-question').textContent = game.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = game.questions.length;
        document.getElementById('score').textContent = game.score;

        // Update progress
        const progress = (game.currentQuestionIndex / game.questions.length) * 100;
        document.getElementById('progress').style.width = `${progress}%`;

        // Render answers
        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.handleAnswer(index));
            answersContainer.appendChild(btn);
        });

        // Hide feedback
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback';
        feedback.textContent = '';

        // Start timer
        game.startTimer(
            (timeLeft) => this.updateTimer(timeLeft),
            () => this.handleTimeUp()
        );
    },

    /**
     * Update timer display
     */
    updateTimer(timeLeft) {
        const timerEl = document.getElementById('time');
        const timerContainer = document.querySelector('.timer');
        const circle = document.getElementById('timer-circle');

        timerEl.textContent = timeLeft;

        // Update circle
        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (timeLeft / game.maxTime) * circumference;
        circle.style.strokeDashoffset = offset;

        // Warning color
        if (timeLeft <= 5) {
            timerContainer.classList.add('warning');
        } else {
            timerContainer.classList.remove('warning');
        }
    },

    /**
     * Handle answer selection
     */
    handleAnswer(answerIndex) {
        game.stopTimer();

        const result = game.checkAnswer(answerIndex);
        const buttons = document.querySelectorAll('.answer-btn');
        const feedback = document.getElementById('feedback');

        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);

        // Show result
        if (result.isCorrect) {
            buttons[answerIndex].classList.add('correct');
            feedback.className = 'feedback correct show';
            feedback.textContent = `🎉 Richtig! +${result.points} Punkte`;
        } else {
            buttons[answerIndex].classList.add('wrong');
            buttons[result.correctIndex].classList.add('correct');
            feedback.className = 'feedback wrong show';
            feedback.textContent = '❌ Falsch!';
        }

        // Update score
        document.getElementById('score').textContent = result.score;

        // Next question or end
        setTimeout(() => {
            if (game.nextQuestion()) {
                this.displayQuestion();
            } else {
                this.endGame();
            }
        }, 1500);
    },

    /**
     * Handle time up
     */
    handleTimeUp() {
        const question = game.getCurrentQuestion();
        const buttons = document.querySelectorAll('.answer-btn');
        const feedback = document.getElementById('feedback');

        buttons.forEach(btn => btn.disabled = true);
        buttons[question.correctIndex].classList.add('correct');

        feedback.className = 'feedback wrong show';
        feedback.textContent = '⏱️ Zeit abgelaufen!';

        game.wrongCount++;

        setTimeout(() => {
            if (game.nextQuestion()) {
                this.displayQuestion();
            } else {
                this.endGame();
            }
        }, 1500);
    },

    /**
     * Quit current game
     */
    quitGame() {
        if (confirm('Möchtest du das Spiel wirklich beenden?')) {
            game.stopTimer();
            this.showScreen('start');
        }
    },

    /**
     * End game and show results
     */
    async endGame() {
        const results = game.getResults();
        this.showScreen('end');

        // Save score
        try {
            const saveResponse = await API.saveScore({
                playerName: results.playerName,
                score: results.score,
                correctAnswers: results.correctAnswers,
                totalQuestions: results.totalQuestions,
                category: results.category
            });

            // Show rank if available
            if (saveResponse.rank) {
                const rankEl = document.getElementById('rank-display');
                const rankValueEl = document.getElementById('player-rank');
                rankEl.classList.remove('hidden');
                rankValueEl.textContent = saveResponse.rank;
            }
        } catch (error) {
            console.error('Failed to save score:', error);
        }

        // Update UI
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('correct-answers').textContent = results.correctAnswers;
        document.getElementById('wrong-answers').textContent = results.wrongAnswers;
        document.getElementById('accuracy').textContent = `${results.accuracy}%`;
        document.getElementById('avg-time').textContent = `${results.avgTime}s`;

        // Check for new record
        const savedHighscore = parseInt(localStorage.getItem('filmQuizHighscore') || '0');
        if (results.score > savedHighscore) {
            localStorage.setItem('filmQuizHighscore', results.score);
            document.getElementById('new-record').classList.remove('hidden');
            document.getElementById('result-animation').textContent = '🏆';
        } else {
            document.getElementById('new-record').classList.add('hidden');
        }

        // Result message
        let message = '';
        let icon = '';
        if (results.accuracy >= 90) {
            message = 'Perfekt! Du bist ein Film-Experte!';
            icon = '🏆';
        } else if (results.accuracy >= 70) {
            message = 'Sehr gut! Du kennst dich mit Filmen aus!';
            icon = '🌟';
        } else if (results.accuracy >= 50) {
            message = 'Nicht schlecht! Aber da geht noch mehr!';
            icon = '👍';
        } else {
            message = 'Zeit für einen Film-Marathon!';
            icon = '📺';
        }

        document.getElementById('result-message').textContent = message;
        document.getElementById('result-animation').textContent = icon;

        // Update highscore display on start screen
        document.getElementById('your-highscore').textContent = Math.max(results.score, savedHighscore);
    },

    /**
     * Show leaderboard
     */
    async showLeaderboard() {
        this.showScreen('leaderboard');
        await this.loadLeaderboard('all');
    },

    /**
     * Load leaderboard data
     */
    async loadLeaderboard(category) {
        const container = document.getElementById('leaderboard-list');
        container.innerHTML = '<div class="text-center">Lädt...</div>';

        try {
            const response = await API.getHighscores(category, 20);
            
            if (response.scores.length === 0) {
                container.innerHTML = '<div class="text-center">Noch keine Einträge</div>';
                return;
            }

            container.innerHTML = '';
            response.scores.forEach((score, index) => {
                const item = document.createElement('div');
                item.className = `leaderboard-item ${index < 3 ? 'top-3' : ''}`;
                item.innerHTML = `
                    <div class="leaderboard-rank">${score.rank}</div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-name">${this.escapeHtml(score.playerName)}</div>
                        <div class="leaderboard-meta">${this.formatCategory(score.category)}</div>
                    </div>
                    <div class="leaderboard-score">
                        <span class="leaderboard-score-value">${score.score}</span>
                        <span class="leaderboard-accuracy">${Math.round((score.correctAnswers / score.totalQuestions) * 100)}%</span>
                    </div>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            container.innerHTML = '<div class="text-center">Fehler beim Laden</div>';
        }
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Format category name
     */
    formatCategory(category) {
        const names = {
            all: 'Alle',
            emoji: 'Emoji',
            quote: 'Zitate',
            facts: 'Fakten'
        };
        return names[category] || category;
    }
};
