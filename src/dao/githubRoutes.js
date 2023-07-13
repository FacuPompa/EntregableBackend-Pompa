const express = require('express');
const router = express.Router();
const GithubManager = require('./GithubManager');

router.get('/login/github', GithubManager.authenticate);

router.get('/auth/github/callback', GithubManager.authenticateCallback, (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;
