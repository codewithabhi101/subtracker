const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://subtracker-backend123.vercel.app/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `google_${profile.id}@noemail.com`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email,
        password: 'google-oauth-' + profile.id,
        authProvider: 'google',
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

module.exports = passport;
