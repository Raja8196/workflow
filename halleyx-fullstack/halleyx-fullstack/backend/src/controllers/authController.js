const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function getRefreshExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function safeUser(user) {
  return {
    id: user.id,
    firstName: user.first_name || user.firstName,
    lastName: user.last_name || user.lastName,
    email: user.email,
    role: user.role,
  };
}

const AuthController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const id = await UserModel.create({ firstName, lastName, email, password });
      const user = await UserModel.findById(id);

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await UserModel.saveRefreshToken(user.id, refreshToken, getRefreshExpiry());

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: safeUser(user),
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (!user.is_active) {
        return res.status(403).json({ success: false, message: 'Account is deactivated' });
      }

      const valid = await UserModel.verifyPassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await UserModel.saveRefreshToken(user.id, refreshToken, getRefreshExpiry());

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: safeUser(user),
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/refresh
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token required' });
      }

      // Verify token signature
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
      }

      // Check in DB
      const stored = await UserModel.findRefreshToken(refreshToken);
      if (!stored) {
        return res.status(401).json({ success: false, message: 'Refresh token revoked or expired' });
      }

      const user = await UserModel.findById(decoded.id);
      if (!user || !user.is_active) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Rotate: delete old, issue new
      await UserModel.deleteRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      await UserModel.saveRefreshToken(user.id, newRefreshToken, getRefreshExpiry());

      return res.json({
        success: true,
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/logout
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) await UserModel.deleteRefreshToken(refreshToken);
      return res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/logout-all
  async logoutAll(req, res, next) {
    try {
      await UserModel.deleteAllRefreshTokens(req.user.id);
      return res.json({ success: true, message: 'Logged out from all devices' });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  async me(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: { user: safeUser(user) } });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/profile
  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName } = req.body;
      await UserModel.updateProfile(req.user.id, { firstName, lastName });
      const user = await UserModel.findById(req.user.id);
      return res.json({ success: true, message: 'Profile updated', data: { user: safeUser(user) } });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/change-password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await UserModel.findByEmail(req.user.email);
      const valid = await UserModel.verifyPassword(currentPassword, user.password);
      if (!valid) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      await UserModel.updatePassword(req.user.id, newPassword);

      // Revoke all refresh tokens for security
      await UserModel.deleteAllRefreshTokens(req.user.id);

      return res.json({ success: true, message: 'Password changed successfully. Please login again.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
