let fraldas = [];
    
        function adicionarFralda(tipo) {
            let marca = document.getElementById(tipo === 'Antiga' ? 'marcaAntiga' : 'marcaNova').value;
            let tamanho = document.getElementById(tipo === 'Antiga' ? 'tamanhoAntiga' : 'tamanhoNova').value;
            
            let quantidade = parseInt(document.getElementById(tipo === 'Antiga' ? 'quantidadeAntiga' : 'quantidadeNova').value);
            let preco = parseFloat(document.getElementById(tipo === 'Antiga' ? 'precoAntigo' : 'precoNovo').value);
            
            if (marca && tamanho && quantidade > 0 && preco > 0) {
                let tipoFralda = tipo === 'Antiga' ? 'Estoque Antigo' : 'Estoque Novo';
                fraldas.push({ marca, tamanho, quantidade, preco, tipo: tipoFralda });
                atualizarTabela();
            }
        }
    
        function atualizarTabela() {
            let tabela = document.getElementById("listaFraldas");
            tabela.innerHTML = "";
            fraldas.forEach(fralda => {
                let row = `<tr>
                    <td>${fralda.marca}</td>
                    <td>${fralda.tamanho}</td>
                    <td>${fralda.quantidade}</td>
                    <td>R$ ${fralda.preco.toFixed(2)}</td>
                    <td>R$ ${(fralda.preco * fralda.quantidade).toFixed(2)}</td>
                    <td>${fralda.tipo}</td>
                </tr>`;
                tabela.innerHTML += row;
            });
        }
    
        function calcularPrecoVenda() {
            let custoTotal = 0;
            let quantidadeTotal = 0;
            
            fraldas.forEach(fralda => {
                custoTotal += fralda.quantidade * fralda.preco;
                quantidadeTotal += fralda.quantidade;
            });
            
            if (quantidadeTotal > 0) {
                let custoMedio = custoTotal / quantidadeTotal;
                let precoVenda = custoMedio * 1.2;
                document.getElementById("resultado").innerText = `Preço de Venda: R$ ${precoVenda.toFixed(2)}`;
            } else {
                document.getElementById("resultado").innerText = "Adicione fraldas para calcular.";
            }
        }