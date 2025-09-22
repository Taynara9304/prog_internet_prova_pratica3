import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
      
        if (token == null) {
          return res.sendStatus(401);
        }
      
        jwt.verify(token, "secreta123", (err, user) => {
          if (err) {
            return res.status(401).json({ message: "Token inválido ou expirado" });
          }
          req.user = user;
          next();
        });
};

export default authMiddleware;