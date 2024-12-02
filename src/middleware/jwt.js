const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier et décoder le token JWT.
 */
const verifyToken = (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send({
        message: 'Aucun token fourni !',
      });
    }

    // Supprimer le préfixe "Bearer" du token
    token = token.replace('Bearer ', '');

    // Vérifier et décoder le token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter les informations d'utilisateur extraites du token à la requête
    req.user = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      role: userInfo.role,
    };

    next(); // Passer au middleware ou au contrôleur suivant
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return res.status(401).send({
      message: 'Token invalide ou expiré !',
    });
  }
};

const sendJwtToken = (res, user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return token;
};

module.exports = { verifyToken, sendJwtToken };
