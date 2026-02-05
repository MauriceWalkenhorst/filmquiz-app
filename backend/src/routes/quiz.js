const express = require('express');
const router = express.Router();
const { dbAsync } = require('../database/db');

// GET /api/quiz/questions - Get random questions
router.get('/questions', async (req, res) => {
  try {
    const { category = 'all', limit = 10 } = req.query;
    let questions;

    if (category === 'all') {
      // Get random questions from all categories
      questions = await dbAsync.all(
        `SELECT * FROM questions ORDER BY RANDOM() LIMIT ?`,
        [parseInt(limit)]
      );
    } else {
      // Get questions from specific category
      questions = await dbAsync.all(
        `SELECT * FROM questions WHERE category = ? ORDER BY RANDOM() LIMIT ?`,
        [category, parseInt(limit)]
      );
    }

    // Parse answers JSON and shuffle them
    const processedQuestions = questions.map(q => {
      const answers = JSON.parse(q.answers);
      const correctAnswer = answers[q.correct_index];
      
      // Shuffle answers
      const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
      
      return {
        id: q.id,
        category: q.category,
        type: q.type,
        question: q.question,
        hint: q.hint,
        answers: shuffledAnswers,
        correctIndex: shuffledAnswers.indexOf(correctAnswer),
        difficulty: q.difficulty
      };
    });

    res.json({
      success: true,
      count: processedQuestions.length,
      questions: processedQuestions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch questions' });
  }
});

// GET /api/quiz/categories - Get all available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbAsync.all(
      `SELECT DISTINCT category FROM questions ORDER BY category`
    );

    const categoryInfo = {
      emoji: { name: 'Emoji Quiz', icon: '😀', description: 'Rate Filme anhand von Emojis' },
      quote: { name: 'Filmzitate', icon: '💬', description: 'Erkenne berühmte Filmzitate' },
      facts: { name: 'Film-Fakten', icon: '🎭', description: 'Teste dein Filmwissen' }
    };

    const result = categories.map(c => ({
      id: c.category,
      ...categoryInfo[c.category]
    }));

    res.json({
      success: true,
      categories: result
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// GET /api/quiz/stats - Get quiz statistics
router.get('/stats', async (req, res) => {
  try {
    const totalQuestions = await dbAsync.get('SELECT COUNT(*) as count FROM questions');
    const categoryStats = await dbAsync.all(
      `SELECT category, COUNT(*) as count FROM questions GROUP BY category`
    );
    const difficultyStats = await dbAsync.all(
      `SELECT difficulty, COUNT(*) as count FROM questions GROUP BY difficulty`
    );

    res.json({
      success: true,
      stats: {
        totalQuestions: totalQuestions.count,
        byCategory: categoryStats,
        byDifficulty: difficultyStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

module.exports = router;
