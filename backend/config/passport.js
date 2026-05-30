const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://subtracker-backend123.vercel.app/api/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `github_${profile.id}@noemail.com`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email,
        password: 'github-oauth-' + profile.id,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

module.exports = passport;