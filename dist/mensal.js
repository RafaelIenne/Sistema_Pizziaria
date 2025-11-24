"use strict";
// --- 2. Variáveis Auxiliares ---
// Mapeamento de valores HTML para nomes de meses
const mapaMeses = {
    "janeiro": 1, "fevereiro": 2, "marco": 3, "abril": 4, "maio": 5, "junho": 6,
    "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12
};
// --- 3. Funções de Exibição e Filtragem ---
function carregarVendasMensais() {
    const selectMes = document.getElementById("mes");
    const listaDiv = document.getElementById("lista");
    if (!selectMes || !listaDiv)
        return;
    const mesSelecionado = selectMes.value;
    const mesNumero = mapaMeses[mesSelecionado];
    const historicoCompleto = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");
    let totalMensal = 0;
    const vendasDoMes = historicoCompleto.filter(pedido => {
        if (!pedido.data)
            return false;
        const dataPedido = new Date(pedido.data);
        const mesPedido = dataPedido.getMonth() + 1;
        const anoPedido = dataPedido.getFullYear();
        // Filtra pelo mês e verifica se o ano é o atual para evitar confusão com anos anteriores
        const anoAtual = new Date().getFullYear();
        return mesPedido === mesNumero && anoPedido === anoAtual;
    });
    // Gera o HTML da lista
    listaDiv.innerHTML = "";
    if (vendasDoMes.length === 0) {
        listaDiv.innerHTML = `<p style="font-style: italic;">Nenhuma venda registrada para ${selectMes.options[selectMes.selectedIndex].textContent} de ${new Date().getFullYear()}.</p>`;
        return;
    }
    vendasDoMes.forEach((pedido, index) => {
        totalMensal += pedido.total;
        const dataFormatada = new Date(pedido.data).toLocaleDateString('pt-BR', {
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
        });
        listaDiv.innerHTML += `
            <div class="item-venda">
                <h4>Pedido #${index + 1} (${dataFormatada})</h4>
                <p>Cliente: <strong>${pedido.cliente}</strong> (${pedido.celular})</p>
                <p>Itens: ${pedido.quantidade}x ${pedido.tamanho} ${pedido.sabor} | Bebida: ${pedido.bebida}</p>
                <p class="total">Total: R$ ${pedido.total.toFixed(2)}</p>
            </div>
        `;
    });
    // Adiciona o cabeçalho e o total
    listaDiv.innerHTML = `
        <h3 class="total-mensal">Total de Vendas no Mês: R$ ${totalMensal.toFixed(2)}</h3>
        <hr>
        ${listaDiv.innerHTML}
    `;
}
function apagarVendasDoMes() {
    const selectMes = document.getElementById("mes");
    const mesSelecionado = selectMes.value;
    const mesNome = selectMes.options[selectMes.selectedIndex].textContent;
    if (!confirm(`Tem certeza que deseja APAGAR TODAS as ${carregarVendasMensais.length} vendas de ${mesNome} de ${new Date().getFullYear()}?`)) {
        return;
    }
    const mesNumero = mapaMeses[mesSelecionado];
    const anoAtual = new Date().getFullYear();
    // Carrega o histórico completo
    let historicoCompleto = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");
    // Filtra e mantém APENAS os pedidos que NÃO são do mês selecionado
    const historicoAtualizado = historicoCompleto.filter(pedido => {
        if (!pedido.data)
            return true; // Mantém pedidos sem data (para segurança)
        const dataPedido = new Date(pedido.data);
        const mesPedido = dataPedido.getMonth() + 1;
        const anoPedido = dataPedido.getFullYear();
        // Retorna TRUE para manter o pedido no array
        return !(mesPedido === mesNumero && anoPedido === anoAtual);
    });
    // Salva o histórico filtrado de volta no localStorage
    localStorage.setItem("historicoPedidos", JSON.stringify(historicoAtualizado));
    alert(`Vendas de ${mesNome} apagadas com sucesso.`);
    // Recarrega a exibição para mostrar a lista vazia
    carregarVendasMensais();
}
// --- 4. Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    const selectMes = document.getElementById("mes");
    const btnApagar = document.getElementById("apagar");
    // Evento de mudança no select
    selectMes === null || selectMes === void 0 ? void 0 : selectMes.addEventListener("change", carregarVendasMensais);
    // Evento do botão apagar
    btnApagar === null || btnApagar === void 0 ? void 0 : btnApagar.addEventListener("click", apagarVendasDoMes);
    // Carrega os dados ao iniciar a página
    carregarVendasMensais();
});
