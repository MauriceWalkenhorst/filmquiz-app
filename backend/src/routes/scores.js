const express = require('express');
const router = express.Router();
const { dbAsync } = require('../database/db');

// GET /api/scores - Get top highscores
router.get('/', async (req, res) => {
  try {
    const { limit = 10, category } = req.query;
    
    let query = `SELECT * FROM highscores`;
    let params = [];

    if (category && category !== 'all') {
      query += ` WHERE category = ?`;
      params.push(category);
    }

    query += ` ORDER BY score DESC, correct_answers DESC LIMIT ?`;
    params.push(parseInt(limit));

    const scores = await dbAsync.all(query, params);

    res.json({
      success: true,
      count: scores.length,
      scores: scores.map((s, index) => ({
        rank: index + 1,
        id: s.id,
        playerName: s.player_name,
        score: s.score,
        correctAnswers: s.correct_answers,
        totalQuestions: s.total_questions,
        category: s.category,
        createdAt: s.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch scores' });
  }
});

// POST /api/scores - Save new highscore
router.post('/', async (req, res) => {
  try {
    const { playerName, score, correctAnswers, totalQuestions, category } = req.body;

    // Validation
    if (!playerName || !score === undefined || !correctAnswers === undefined || !totalQuestions === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (playerName.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Player name too long (max 50 characters)'
      });
    }

    // Sanitize player name
    const sanitizedName = playerName.trim().replace(/[<>]/g, '');

    const result = await dbAsync.run(
      `INSERT INTO highscores (player_name, score, correct_answers, total_questions, category)
       VALUES (?, ?, ?, ?, ?)`,
      [sanitizedName, score, correctAnswers, totalQuestions, category || 'all']
    );

    // Get rank
    const rankResult = await dbAsync.get(
      `SELECT COUNT(*) as rank FROM highscores WHERE score > ?`,
      [score]
    );

    res.status(201).json({
      success: true,
      message: 'Score saved successfully',
      scoreId: result.id,
      rank: rankResult.rank + 1
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ success: false, error: 'Failed to save score' });
  }
});

// GET /api/scores/player/:name - Get player history
router.get('/player/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { limit = 10 } = req.query;

    const scores = await dbAsync.all(
      `SELECT * FROM highscores 
       WHERE player_name = ? 
       ORDER BY created_at DESC LIMIT ?`,
      [name, parseInt(limit)]
    );

    // Get player stats
    const stats = await dbAsync.get(
      `SELECT 
        COUNT(*) as gamesPlayed,
        MAX(score) as bestScore,
        AVG(score) as averageScore,
        SUM(correct_answers) as totalCorrect,
        SUM(total_questions) as totalQuestions
       FROM highscores 
       WHERE player_name = ?`,
      [name]
    );

    res.json({
      success: true,
      player: name,
      stats: {
        gamesPlayed: stats.gamesPlayed,
        bestScore: stats.bestScore,
        averageScore: Math.round(stats.averageScore * 10) / 10,
        totalCorrect: stats.totalCorrect,
        totalQuestions: stats.totalQuestions,
        accuracy: Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      },
      recentGames: scores
    });
  } catch (error) {
    console.error('Error fetching player scores:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch player scores' });
  }
});

module.exports = router;
