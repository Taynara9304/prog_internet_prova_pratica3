import jwt from 'jsonwebtoken';

function authMiddleware(req, res) {
    const autHeader = req.headers("authorization");

    if (autHeader) return res.status(401).json({ message: "Token não fornecido" });

    const token = autHeader.split("")(1);

    try {
        const decode = jwt.verify(token, 'secreta123');
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado" });
    }
};

export default authMiddleware;