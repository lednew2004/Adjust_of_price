let produtos = [];


function toggleMenu() {
    document.getElementById("menuLateral").classList.toggle("ativo");
    document.getElementById("menuBtn").classList.toggle("Active")
}

async function buscarProduto() {
    const termo = document.getElementById("inputBusca").value.toLowerCase();
    const resultados = document.getElementById("resultadosBusca");
    resultados.innerHTML = "";

    const response = await fetch(`http://localhost:5050/produtos?search=${termo}`);
    const data = await response.json()

    data.forEach(prod => {
        const item = document.createElement("li");
        item.textContent = `${prod.nome} - ${prod.quantidade} un. - R$ ${prod.preco.toFixed(2)} Desc(${prod.desconto}%)`;
        resultados.appendChild(item);
    })

    loadingInput()
}

function loadingInput() {
    const liItens = document.querySelectorAll("#resultadosBusca li");

    liItens.forEach(li => {
        li.addEventListener("click", async () => {
            const text = li.textContent
            const arrayOfLi = text.split(" ")


            const response = await fetch(`http://localhost:5050/produtos?search=${arrayOfLi[0]}`);
            const [data] = await response.json()

            console.log(data)
            document.getElementById('nomeAntigo').value = data.nome;
            document.getElementById('quantidadeAntiga').value = data.quantidade;
            document.getElementById('precoAntigo').value = data.preco;
            document.getElementById('descontoAntigo').value = data.desconto;



        })

    })
}

async function adicionarProduto(tipo) {
    let nome = document.getElementById(tipo === 'Antiga' ? 'nomeAntigo' : 'nomeNovo').value;
    let quantidade = parseInt(document.getElementById(tipo === 'Antiga' ? 'quantidadeAntiga' : 'quantidadeNova').value);
    let preco = parseFloat(document.getElementById(tipo === 'Antiga' ? 'precoAntigo' : 'precoNovo').value);
    let desconto = parseFloat(document.getElementById(tipo === 'Antiga' ? 'descontoAntigo' : 'descontoNovo').value);

    if (nome && quantidade > 0 && preco > 0) {
        // Se o desconto for um número válido, aplica o desconto
        if (!isNaN(desconto) && desconto > 0) {
            preco = preco - (preco * (desconto / 100));
        }

        let tipoProduto = tipo === 'Antiga' ? 'Estoque Antigo' : 'Estoque Novo';
        produtos.push({ nome, quantidade, preco, tipo: tipoProduto });
        localStorage.setItem('produtos', JSON.stringify(produtos));
        atualizarTabela();
    }
}

async function salvarProduto() {
    let nome = document.getElementById('nomeNovo').value;
    let quantidade = parseInt(document.getElementById('quantidadeNova').value);
    let preco = parseFloat(document.getElementById('precoNovo').value);
    let desconto = parseFloat(document.getElementById('descontoNovo').value);

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



function atualizarTabela() {
    let tabela = document.getElementById("listaProdutos");
    tabela.innerHTML = "";
    const produtosLocalStorage = JSON.parse(localStorage.getItem("produtos"));

    if (!produtosLocalStorage) {
        return
    }
    produtosLocalStorage.forEach(produto => {
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

atualizarTabela()

function calcularPrecoVenda() {
    let custoTotal = 0;
    let quantidadeTotal = 0;

    const produtosLocalStorage = JSON.parse(localStorage.getItem("produtos"));

    if (!produtosLocalStorage) {
        document.getElementById("resultado").innerText = "Adicione produtos e informe a porcentagem.";
        return
    }
    produtosLocalStorage.forEach(produto => {
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


function clearLocalStorage() {
    localStorage.clear("produtos")
    atualizarTabela()
}

document.getElementById("clearTable").addEventListener("click", clearLocalStorage)