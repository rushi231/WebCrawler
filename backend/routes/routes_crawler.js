const express = require('express');
const router = express.Router();
const { crawlWebsite } = require('../controllers/crawlerlogic');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.post('/crawl', authenticateToken, crawlWebsite);

router.delete('/results', authenticateToken, requireAdmin, (req, res) => {
    res.json({ message: 'Admin cleared the results.' });
});

router.get('/status', (req, res) => {
    res.json({ message: 'API ready to use.' });
});

module.exports = router;