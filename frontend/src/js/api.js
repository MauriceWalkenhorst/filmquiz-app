/**
 * Film Quiz API Client
 * Handles all communication with the backend
 */

const API = {
    baseUrl: '', // Empty for same-origin requests

    /**
     * Make a fetch request with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Get random questions
     * @param {string} category - Category filter (all, emoji, quote, facts)
     * @param {number} limit - Number of questions
     */
    async getQuestions(category = 'all', limit = 10) {
        return this.request(`/api/quiz/questions?category=${category}&limit=${limit}`);
    },

    /**
     * Get available categories
     */
    async getCategories() {
        return this.request('/api/quiz/categories');
    },

    /**
     * Get quiz statistics
     */
    async getStats() {
        return this.request('/api/quiz/stats');
    },

    /**
     * Get highscores
     * @param {string} category - Category filter
     * @param {number} limit - Number of scores
     */
    async getHighscores(category = 'all', limit = 10) {
        const url = category === 'all' 
            ? `/api/scores?limit=${limit}`
            : `/api/scores?category=${category}&limit=${limit}`;
        return this.request(url);
    },

    /**
     * Save a new score
     * @param {Object} scoreData - Score data
     */
    async saveScore(scoreData) {
        return this.request('/api/scores', {
            method: 'POST',
            body: JSON.stringify(scoreData)
        });
    },

    /**
     * Get player stats
     * @param {string} playerName - Player name
     */
    async getPlayerStats(playerName) {
        return this.request(`/api/scores/player/${encodeURIComponent(playerName)}`);
    },

    /**
     * Health check
     */
    async healthCheck() {
        return this.request('/api/health');
    }
};
