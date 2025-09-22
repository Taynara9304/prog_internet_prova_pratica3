import express from 'express';
import rotasAutenticacao from './routes/auth.js';
import rotasUsuario from './routes/users.js';

const app = express();

app.use(express.json());

app.use("/", rotasAutenticacao);
app.use("/", rotasUsuario);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
})