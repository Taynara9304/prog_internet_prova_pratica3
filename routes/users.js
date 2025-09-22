import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rotas = Router();
const filePath = path.join(__dirname, '..', 'db.json');

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

rotas.get("/", authMiddleware, (req, res) => {
    res.json(lerArquivo());
});

rotas.get("/:id", authMiddleware, (req, res) => {
    const usuarios = lerArquivo();
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex((a) => a.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    usuarios[index] = { ...usuarios[index], ...req.body };

    res.json(usuarios[index]);
});

rotas.put('/:id', authMiddleware, (req, res) => {
    const usuarios = lerArquivo();
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex((a) => a.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    usuarios[index] = { ...usuarios[index], ...req.body };

    salvar(usuarios);

    res.json(usuarios[index]);
});

rotas.delete('/:id', authMiddleware, (req, res) => {
    let usuarios = lerArquivo();

    const id = parseInt(req.params.id);

    usuarios = usuarios.filter((a) => a.id !== id);
    salvar(usuarios);
    res.status(204).send();
})


export default rotas;