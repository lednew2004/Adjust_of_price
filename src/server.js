import { fastify } from "fastify";
import fastifyCors from "fastify-cors";

import { config } from "dotenv";
config()
const port = process.env.PORT || 5050;

import { Database } from "./database.js";
const database = new Database();

const app = fastify();



app.register(fastifyCors, {
    origin: "*"
})

app.get("/produtos", async (req, res) => {
    const { search } = req.query;
    console.log(search)
    const data = database.select("produtos", search ? { nome: search } : null);

    return data;
});

app.post("/produtos", async (req, res) => {
    const { nome, quantidade, preco, desconto } = req.body;

    const response = await fetch(`http://localhost:5050/produtos?search=${nome}`);
    const [data] = await response.json()

    if (data.nome.toLowerCase() === nome.toLowerCase()) {
        await fetch(`http://localhost:5050/produtos/${nome}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quantidade,
                preco,
                desconto
            })
        });
        return
    }

    database.insert("produtos", {
        nome,
        quantidade,
        preco,
        desconto
    });

    return res.status(202).send();
});

app.put("/produtos/:name", async (req, res) => {
    const { nome, quantidade, preco, desconto } = req.body;
    const { name } = req.params;

    database.update("produtos", name, {
        quantidade,
        preco,
        desconto
    });

    return res.status(202).send();
});

app.listen({
    port: port,
    host: "0.0.0.0"

}).then(() => {
    console.log("Server rodando")
})