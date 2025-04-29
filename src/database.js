const databasePath = new URL("../db.json", import.meta.url);
import fs from "node:fs/promises";

export class Database {
    #database = {};

    constructor() {
        // Lê o arquivo e carrega os dados na inicialização
        fs.readFile(databasePath, "utf8")
            .then(data => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                this.#persist(); // Cria o banco de dados inicial, se não existir
            });
    }

    // Persistir dados no arquivo JSON
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
    }

    // Inserir dados
    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }

        this.#persist()
        return data
    }

    // Selecionar todos os dados ou uma marca específica
    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    if (!value) return true
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        return data
    }

    update(table, nome, data) {
        const findRow = this.#database[table].findIndex(row => {
            return row.nome.toLowerCase() === nome.toLowerCase();
        })

        if (findRow > -1) {
            this.#database[table][findRow] = { nome, ...data }
            this.#persist()
        }
    }
}
