let produtos = [];


function toggleMenu() {
    document.getElementById("menuLateral").classList.toggle("ativo");
    document.getElementById("menuBtn").classList.toggle("Active")
}

async function buscarProduto() {
    const termo = document.getElementById("inputBusca").value.toLowerCase();
    const resultados = document.getElementById("resultadosBusca");
    resultados.innerHTML = "";

    const response = await fetch("http://localhost:5050/produtos");
    const data = await response.json()

    data.forEach(prod => {
        const item = document.createElement("li");
        item.textContent = `${prod.nome} - ${prod.quantidade} un. - R$ ${prod.preco.toFixed(2)} Desc(${prod.desconto}%)`;
        resultados.appendChild(item);
    })

    //loadingInput()
}

function loadingInput() {
    const liItens = document.querySelectorAll("#resultadosBusca li");

    liItens.forEach(li => {
        li.addEventListener("click", () => {
            const text = li.textContent
            const arrayOfLi = text.split(" ")
            console.log(arrayOfLi)
            let nome = document.getElementById('nomeAntigo');
            let quantidade = document.getElementById('quantidadeAntiga');
            let preco = document.getElementById('precoAntigo');
            let desconto = document.getElementById('descontoAntigo');

            nome.value = arrayOfLi[0]
            quantidade.value = arrayOfLi[2]
            preco.value = arrayOfLi[6]
            desconto.value = arrayOfLi[7]

        })

    })
}

async function adicionarProduto(tipo) {
    let nome = document.getElementById(tipo === 'Antiga' ? 'nomeAntigo' : 'nomeNovo').value;
    let quantidade = parseInt(document.getElementById(tipo === 'Antiga' ? 'quantidadeAntiga' : 'quantidadeNova').value);
    let preco = parseFloat(document.getElementById(tipo === 'Antiga' ? 'precoAntigo' : 'precoNovo').value);
    let desconto = parseFloat(document.getElementById(tipo === 'Antiga' ? 'descontoAntigo' : 'descontoNovo').value);

    //requisitarDb(tipo, nome, quantidade, preco, desconto)

    if (nome && quantidade > 0 && preco > 0) {
        // Se o desconto for um número válido, aplica o desconto
        if (!isNaN(desconto) && desconto > 0) {
            preco = preco - (preco * (desconto / 100));
        }

        let tipoProduto = tipo === 'Antiga' ? 'Estoque Antigo' : 'Estoque Novo';
        produtos.push({ nome, quantidade, preco, tipo: tipoProduto });
        atualizarTabela();
    }
}

async function requisitarDb(tipo, nome, quantidade, preco, desconto) {
    if (tipo === "Nova") {
        await fetch("http://localhost:5050/produtos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome, quantidade, preco, desconto
            })
        })
    }
}

function atualizarTabela() {
    let tabela = document.getElementById("listaProdutos");
    tabela.innerHTML = "";
    produtos.forEach(produto => {
        let row = `<tr>
                    <td>${produto.nome}</td>
                    <td>${produto.quantidade}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    <td>R$ ${(produto.preco * produto.quantidade).toFixed(2)}</td>
                    <td>${produto.tipo}</td>
                  </tr>`;
        tabela.innerHTML += row;
    });
}

function calcularPrecoVenda() {
    let custoTotal = 0;
    let quantidadeTotal = 0;

    produtos.forEach(produto => {
        custoTotal += produto.quantidade * produto.preco;
        quantidadeTotal += produto.quantidade;
    });

    const porcentagemInput = document.getElementById("porcentagemLucro").value;
    const porcentagemLucro = parseFloat(porcentagemInput);

    if (quantidadeTotal > 0 && !isNaN(porcentagemLucro)) {
        let custoMedio = custoTotal / quantidadeTotal;
        let acrescimo = custoMedio * (porcentagemLucro / 100);
        let precoVenda = custoMedio + acrescimo;

        document.getElementById("resultado").innerText = `Preço de Venda (com ${porcentagemLucro}%): R$ ${precoVenda.toFixed(2)}`;
    } else {
        document.getElementById("resultado").innerText = "Adicione produtos e informe a porcentagem.";
    }
}
