const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { query } = require('./database');

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const result = await query(
      'SELECT id, email, first_name, last_name, location, email_verified FROM users WHERE id = $1',
      [payload.userId]
    );
    
    if (result.rows.length > 0) {
      return done(null, result.rows[0]);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let result = await query(
      'SELECT * FROM users WHERE google_id = $1',
      [profile.id]
    );

    if (result.rows.length > 0) {
      // User exists, return user
      return done(null, result.rows[0]);
    }

    // Check if user exists with same email
    result = await query(
      'SELECT * FROM users WHERE email = $1',
      [profile.emails[0].value]
    );

    if (result.rows.length > 0) {
      // User exists with same email, link Google account
      const updatedUser = await query(
        'UPDATE users SET google_id = $1, email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING *',
        [profile.id, profile.emails[0].value]
      );
      return done(null, updatedUser.rows[0]);
    }

    // Create new user
    const newUser = await query(
      `INSERT INTO users (google_id, email, first_name, last_name, email_verified, terms_accepted) 
       VALUES ($1, $2, $3, $4, true, true) RETURNING *`,
      [
        profile.id,
        profile.emails[0].value,
        profile.name.givenName,
        profile.name.familyName
      ]
    );

    return done(null, newUser.rows[0]);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;