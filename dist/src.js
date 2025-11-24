"use strict";
// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    // Configura eventos dos botões iniciais
    const btnHistorico = document.getElementById("btn-historico");
    if (btnHistorico) {
        btnHistorico.addEventListener("click", mostrarHistorico);
    }
    const form = document.getElementById("pedidoForm");
    if (form) {
        form.addEventListener("submit", processarFormulario);
    }
    // Lógica de URL
    if (params.get("abrir") === "historico") {
        alternarVisibilidade("historico");
        mostrarHistorico();
    }
    carregarSaboresBebidas();
});
// --- Funções Principais ---
function carregarSaboresBebidas() {
    const selectSabor = document.getElementById("sabor");
    const selectBebida = document.getElementById("bebida");
    if (!selectSabor || !selectBebida)
        return;
    selectSabor.innerHTML = "";
    selectBebida.innerHTML = '<option value="Nenhuma" selected>Nenhuma</option>';
    // Dados padrão caso o localStorage esteja vazio
    const saboresPadrao = [
        "Mussarela", "Calabresa", "Portuguesa", "Marguerita",
        "Brócolis", "Frango com Catupiry", "Quatro Queijos"
    ];
    const sabores = JSON.parse(localStorage.getItem("sabores") || "null") || saboresPadrao;
    let bebidas = JSON.parse(localStorage.getItem("bebidas") || "[]");
    // Filtragem simples
    bebidas = bebidas.filter(b => b && b.nome && !isNaN(Number(b.preco)));
    sabores.forEach(sabor => {
        const opt = document.createElement("option");
        opt.textContent = sabor;
        opt.value = sabor;
        selectSabor.appendChild(opt);
    });
    bebidas.forEach(bebida => {
        const opt = document.createElement("option");
        opt.value = bebida.nome;
        opt.textContent = `${bebida.nome} (R$ ${Number(bebida.preco).toFixed(2)})`;
        selectBebida.appendChild(opt);
    });
    // Salva de volta para garantir persistência dos padrões
    if (!localStorage.getItem("sabores")) {
        localStorage.setItem("sabores", JSON.stringify(sabores));
    }
    localStorage.setItem("bebidas", JSON.stringify(bebidas));
}
function processarFormulario(event) {
    event.preventDefault();
    // Captura dos elementos (Casting as HTMLInputElement para acessar .value)
    const cliente = document.getElementById("client").value;
    const celular = document.getElementById("number").value;
    const tamanho = document.getElementById("tamanho").value;
    const sabor = document.getElementById("sabor").value;
    const bordaCheckbox = document.getElementById("borda-recheada");
    const bordaAtiva = bordaCheckbox.checked;
    const borda = bordaAtiva ? "Com borda recheada" : "Sem borda";
    const quantityInput = document.getElementById("quantity");
    const quantidade = parseInt(quantityInput.value);
    const bebidaSelect = document.getElementById("bebida");
    const bebidaNome = bebidaSelect.value || "Nenhuma";
    const sobremesaCheck = document.getElementById("sobremesaCheck");
    const sobremesaAtiva = sobremesaCheck.checked;
    const sobremesaSelect = document.getElementById("sobremesa");
    const sobremesa = sobremesaAtiva ? sobremesaSelect.value : "Nenhuma";
    const cep = document.getElementById("cep").value;
    const rua = document.getElementById("rua").value;
    const bairro = document.getElementById("bairro").value;
    const ponto = document.getElementById("ponto").value;
    const pagamento = document.getElementById("pagamento").value;
    // --- Cálculos ---
    const precoPizza = tamanho === "Pequena" ? 10 : tamanho === "Média" ? 20 : 30;
    const precoBorda = bordaAtiva ? 10 : 0;
    let precoBebida = 0;
    if (bebidaNome !== "Nenhuma") {
        const bebidas = JSON.parse(localStorage.getItem("bebidas") || "[]");
        const bebidaSelecionada = bebidas.find(b => b.nome === bebidaNome);
        precoBebida = bebidaSelecionada ? Number(bebidaSelecionada.preco) : 0;
    }
    const tabelaPrecosSobremesa = {
        "Sorvete": 10,
        "Bolo de Chocolate": 10
    };
    const precoSobremesa = sobremesaAtiva ? (tabelaPrecosSobremesa[sobremesa] || 0) : 0;
    const total = quantidade * (precoPizza + precoBorda) + precoBebida + precoSobremesa;
    // Criação do objeto Pedido
    const pedido = {
        cliente, celular, tamanho, sabor, borda,
        quantidade, bebida: bebidaNome, sobremesa,
        cep, rua, bairro, ponto, pagamento, total,
        data: new Date().toISOString()
    };
    salvarHistorico(pedido);
    exibirConfirmacao(pedido);
}
function salvarHistorico(pedido) {
    let historico = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");
    historico.push(pedido);
    localStorage.setItem("historicoPedidos", JSON.stringify(historico));
}
function exibirConfirmacao(pedido) {
    var _a;
    alternarVisibilidade("confirmacao");
    const confirmacaoDiv = document.getElementById("confirmacao");
    if (!confirmacaoDiv)
        return;
    confirmacaoDiv.innerHTML = `

        <h2 style="margin-top: 30px; font-size: 1.3rem;">Pedido Enviado com Sucesso!</h2>

        <div class="card mx-auto mt-3 p-3" style="max-width: 400px; background-color: #FFFFFF;">

          <h4>Resumo do Pedido</h4>

          <p><strong>Cliente:</strong> ${pedido.cliente}</p>

          <p><strong>Celular:</strong> ${pedido.celular}</p>

          <p><strong>Pizza:</strong> ${pedido.quantidade}x ${pedido.tamanho} ${pedido.sabor} (${pedido.borda})</p>

          <p><strong>Bebida:</strong> ${pedido.bebida}</p>

          <p><strong>Sobremesa:</strong> ${pedido.sobremesa}</p>

          <p><strong>Endereço:</strong> ${pedido.rua}, ${pedido.bairro}, CEP: ${pedido.cep}</p>

          <p><strong>Ponto de referência:</strong> ${pedido.ponto}</p>

          <p><strong>Pagamento:</strong> ${pedido.pagamento}</p>

          <h4>Total: R$ ${pedido.total.toFixed(2)}</h4>

        </div>

        <div class="mt-4 text-center">

          <button id="btn-ver-historico" class="btn btn-warning">Ver Histórico</button>

        </div>

    `;
    // Adiciona evento ao botão gerado dinamicamente
    (_a = document.getElementById("btn-ver-historico")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", mostrarHistorico);
}
function mostrarHistorico() {
    var _a, _b;
    alternarVisibilidade("historico");
    const historicoDiv = document.getElementById("historico");
    if (!historicoDiv)
        return;
    const historico = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");
    let htmlContent = "<h2>Pedidos Ativos</h2>";
    if (historico.length === 0) {
        htmlContent += `<p>Nenhum pedido registrado.</p>`;
    }
    else {
        historico.forEach((pedido, index) => {
            htmlContent += `

              <div class="card mt-3 p-3" style="background:#fff; max-width:500px; margin:auto; text-align: left;">

                <h5>Pedido #${index + 1}</h5>

                <p><strong>Cliente:</strong> ${pedido.cliente}</p>

                <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>

                <hr>

                <small>Detalhes: ${pedido.quantidade}x ${pedido.tamanho} - ${pedido.sabor}</small>

              </div>`;
        });
    }
    htmlContent += `

        <div class="mt-4">

          <button id="btn-apagar" class="btn btn-warning">Apagar Histórico</button>

          <button id="btn-voltar" class="btn btn-secondary">Voltar</button>

        </div>`;
    historicoDiv.innerHTML = htmlContent;
    // Reatribuir eventos aos botões gerados dinamicamente
    (_a = document.getElementById("btn-apagar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", apagarHistorico);
    (_b = document.getElementById("btn-voltar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", voltarCadastro);
}
function apagarHistorico() {
    if (confirm("Apagar histórico?")) {
        localStorage.removeItem("historicoPedidos");
        mostrarHistorico();
    }
}
function voltarCadastro() {
    window.location.href = "index.html";
}
function alternarVisibilidade(telaAtiva) {
    const form = document.querySelector(".form");
    const confirmacao = document.getElementById("confirmacao");
    const historico = document.getElementById("historico");
    if (form)
        form.style.display = telaAtiva === "form" ? "block" : "none";
    if (confirmacao)
        confirmacao.style.display = telaAtiva === "confirmacao" ? "block" : "none";
    if (historico)
        historico.style.display = telaAtiva === "historico" ? "block" : "none";
}
