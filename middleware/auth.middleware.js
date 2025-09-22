import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
        // Obter o token do cabeçalho da requisição (normalmente na propriedade Authorization)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: Bearer TOKEN
      
        if (token == null) {
          return res.sendStatus(401); // Se não houver token, retornar 401 Unauthorized
        }
      
        jwt.verify(token, "secreta123", (err, user) => {
          if (err) {
            // Se o token for inválido ou expirado
            return res.status(401).json({ message: "Token inválido ou expirado" });
          }
          req.user = user; // Anexa o payload (informações do usuário) ao objeto request
          next(); // Prossegue para a próxima função de middleware ou para o manipulador da rota
        });
};

export default authMiddleware;