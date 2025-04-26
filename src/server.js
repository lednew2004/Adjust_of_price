import { fastify } from "fastify";
import fastifyCors from "fastify-cors";

import { Database } from "./database.js";
const database = new Database();

const app = fastify();



app.register(fastifyCors, {
    origin: "*"
})

app.get("/produtos", async (req, res) => {
    const { search } = req.params;

    const data = database.select("produtos", search);

    return data;
});

app.post("/produtos", async (req, res) => {
    const { nome, quantidade, preco, desconto } = req.body;

    database.insert("produtos", {
        nome,
        quantidade,
        preco,
        desconto
    });

    return res.status(202).send();
});

app.listen({
    port: 5050
}).then(() => {
    console.log("Server rodando")
})