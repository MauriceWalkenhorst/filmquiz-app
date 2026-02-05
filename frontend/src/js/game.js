/**
 * Film Quiz Game Logic
 */

class FilmQuizGame {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.category = 'all';
        this.playerName = '';
        this.timer = null;
        this.timeLeft = 30;
        this.maxTime = 30;
        this.questionTimes = [];
        this.startTime = null;
        this.isPaused = false;
    }

    /**
     * Initialize new game
     */
    async init(category = 'all', playerName = 'Spieler') {
        this.category = category;
        this.playerName = playerName;
        
        try {
            const response = await API.getQuestions(category, 10);
            this.questions = response.questions;
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.correctCount = 0;
            this.wrongCount = 0;
            this.questionTimes = [];
            
            return true;
        } catch (error) {
            console.error('Failed to load questions:', error);
            UI.showToast('Fehler beim Laden der Fragen', 'error');
            return false;
        }
    }

    /**
     * Get current question
     */
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    /**
     * Start timer for current question
     */
    startTimer(onTick, onTimeUp) {
        this.timeLeft = this.maxTime;
        this.startTime = Date.now();
        this.isPaused = false;

        if (this.timer) {
            clearInterval(this.timer);
        }

        onTick(this.timeLeft);

        this.timer = setInterval(() => {
            if (this.isPaused) return;

            this.timeLeft--;
            onTick(this.timeLeft);

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.questionTimes.push(this.maxTime);
                onTimeUp();
            }
        }, 1000);
    }

    /**
     * Pause timer
     */
    pauseTimer() {
        this.isPaused = true;
    }

    /**
     * Resume timer
     */
    resumeTimer() {
        this.isPaused = false;
    }

    /**
     * Stop timer
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Record time taken for this question
        if (this.startTime) {
            const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
            this.questionTimes.push(Math.min(timeTaken, this.maxTime));
        }
    }

    /**
     * Check answer
     */
    checkAnswer(answerIndex) {
        const question = this.getCurrentQuestion();
        const isCorrect = answerIndex === question.correctIndex;

        if (isCorrect) {
            this.correctCount++;
            // Points based on time left (faster = more points)
            const timeBonus = Math.floor(this.timeLeft / 3);
            this.score += 10 + timeBonus;
        } else {
            this.wrongCount++;
        }

        return {
            isCorrect,
            correctIndex: question.correctIndex,
            score: this.score,
            points: isCorrect ? 10 + Math.floor(this.timeLeft / 3) : 0
        };
    }

    /**
     * Move to next question
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        return this.currentQuestionIndex < this.questions.length;
    }

    /**
     * Check if game is complete
     */
    isComplete() {
        return this.currentQuestionIndex >= this.questions.length;
    }

    /**
     * Get game results
     */
    getResults() {
        const accuracy = Math.round((this.correctCount / this.questions.length) * 100);
        const avgTime = this.questionTimes.length > 0
            ? Math.round(this.questionTimes.reduce((a, b) => a + b, 0) / this.questionTimes.length)
            : 0;

        return {
            score: this.score,
            correctAnswers: this.correctCount,
            wrongAnswers: this.wrongCount,
            totalQuestions: this.questions.length,
            accuracy,
            avgTime,
            category: this.category,
            playerName: this.playerName
        };
    }

    /**
     * Get category display name
     */
    getCategoryName() {
        const names = {
            emoji: '😀 Emoji Quiz',
            quote: '💬 Filmzitat',
            facts: '🎭 Film-Fakt'
        };
        return names[this.getCurrentQuestion()?.category] || '🎲 Quiz';
    }
}

// Global game instance
const game = new FilmQuizGame();
