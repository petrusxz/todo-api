const jwt = require('jsonwebtoken');

class AuthMiddleware {
  static secret = 'psc@18pofe12g5412';

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  static authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .send('Access denied');
    }

    try {
      const decoded = jwt.verify(token, AuthMiddleware.secret);
      req.user = decoded;
      next();
    } catch (error) {
      res
        .status(400)
        .send('Invalid data');
    }
  }

  static getCredetials(user) {
    const token = jwt.sign({ _id: user._id }, AuthMiddleware.secret, { expiresIn: '1h' });
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      token
    }
  }
}

module.exports = AuthMiddleware;