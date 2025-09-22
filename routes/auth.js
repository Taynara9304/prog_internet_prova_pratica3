import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import authMiddleware from "../middleware/auth.middleware.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function lerArquivo() {
    try {
        const dados = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(dados || '[]');
    } catch (error) {
        console.log("Erro ao ler arquivo");
        return [];
    }
}

function salvar(usuarios) {
    fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
}

const router = Router();
const filePath = path.join(__dirname, '..', 'db.json');

const usuarios = lerArquivo();

router.post("/cadastro", async (req, res) => {

    const {nome, email, senha} = req.body;

    const usuarioExiste = usuarios.find((u) => u.email === email);

    if (usuarioExiste) {
        return res.status(400).json({ message: "Usuário já existe"});
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    
    usuarios.push({id: usuarios.length + 1, nome, email, senha:senhaHash});

    salvar(usuarios);

    res.json({ message: "Usuário registrado com sucesso" });
});

router.post("/login", async (req, res) => {
    const {email, senha} = req.body;

    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaEValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaEValida) {
        return res.status(400).json({ message: "Senha inválida" });
    }

    const tokenPayload = { email: usuario.email, senha: usuario.senha };
    const token = jwt.sign(tokenPayload, "secreta123", { expiresIn: '1h' });
  
    res.json({token});

    //Rota protegida
    router.get('/profile', authMiddleware, (req, res) => {
        res.json({ message: `Bem vindo ${usuario}`})
    })
});

export default router;