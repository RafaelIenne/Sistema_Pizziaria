
interface Pedido {

    cliente: string;

    celular: string;

    tamanho: string;

    sabor: string;

    borda: string;

    quantidade: number;

    bebida: string;

    sobremesa: string;

    cep: string;

    rua: string;

    bairro: string;

    ponto: string;

    pagamento: string;

    total: number;



    data: string; 

}



// --- 2. Funções de Exibição e Filtragem ---

function carregarVendasDiarias(): void {



    const inputData = document.getElementById("data-selecionada") as HTMLInputElement;

    const listaDiv = document.getElementById("lista");

    

    if (!inputData || !listaDiv) return;



    const dataSelecionada = inputData.value;


    if (!dataSelecionada) {

        listaDiv.innerHTML = `<p style="font-style: italic;">Selecione uma data para carregar o relatório.</p>`;

        return;

    }


    const [ano, mes, dia] = dataSelecionada.split('-').map(Number);



    const historicoCompleto: Pedido[] = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");

    

    let totalDiario = 0;



    const vendasDoDia = historicoCompleto.filter(pedido => {


        if (!pedido.data) return false; 

        

        const dataPedido = new Date(pedido.data);



        const diaPedido = dataPedido.getDate();

        const mesPedido = dataPedido.getMonth() + 1; 

        const anoPedido = dataPedido.getFullYear();



        return diaPedido === dia && mesPedido === mes && anoPedido === ano;

    });



    listaDiv.innerHTML = "";

    

    const dataFormatadaBR = new Date(dataSelecionada).toLocaleDateString('pt-BR');



    if (vendasDoDia.length === 0) {

        listaDiv.innerHTML = `<p style="font-style: italic;">Nenhuma venda registrada para o dia ${dataFormatadaBR}.</p>`;

        return;

    }

    

    vendasDoDia.forEach((pedido, index) => {

        totalDiario += pedido.total;



        const horaFormatada = new Date(pedido.data).toLocaleTimeString('pt-BR', {

            hour: '2-digit', minute: '2-digit'

        });



        listaDiv.innerHTML += `

            <div class="item-venda">

                <h4>Pedido #${index + 1} (${horaFormatada})</h4>

                <p>Cliente: <strong>${pedido.cliente}</strong> (${pedido.celular})</p>

                <p>Itens: ${pedido.quantidade}x ${pedido.tamanho} ${pedido.sabor} | Bebida: ${pedido.bebida}</p>

                <p class="total">Total: R$ ${pedido.total.toFixed(2)}</p>

            </div>

        `;

    });



    listaDiv.innerHTML = `

        <h3 class="total-diario">Total de Vendas do Dia (${dataFormatadaBR}): R$ ${totalDiario.toFixed(2)}</h3>

        <hr>

        ${listaDiv.innerHTML}

    `;

}



function apagarVendasDoDia(): void {

    const inputData = document.getElementById("data-selecionada") as HTMLInputElement;

    const dataSelecionada = inputData.value;

    

    if (!dataSelecionada) {

        alert("Por favor, selecione uma data para apagar as vendas.");

        return;

    }



    const dataFormatadaBR = new Date(dataSelecionada).toLocaleDateString('pt-BR');



    if (!confirm(`Tem certeza que deseja APAGAR TODAS as vendas do dia ${dataFormatadaBR}? Esta ação não pode ser desfeita.`)) {

        return;

    }



    const [ano, mes, dia] = dataSelecionada.split('-').map(Number);



    let historicoCompleto: Pedido[] = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");



    const historicoAtualizado = historicoCompleto.filter(pedido => {

        if (!pedido.data) return true;


        const dataPedido = new Date(pedido.data);

        const diaPedido = dataPedido.getDate();

        const mesPedido = dataPedido.getMonth() + 1;

        const anoPedido = dataPedido.getFullYear();



        return !(diaPedido === dia && mesPedido === mes && anoPedido === ano);

    });



    localStorage.setItem("historicoPedidos", JSON.stringify(historicoAtualizado));

    

    alert(`Vendas do dia ${dataFormatadaBR} apagadas com sucesso.`);



    carregarVendasDiarias(); 

}





document.addEventListener("DOMContentLoaded", () => {

    const inputData = document.getElementById("data-selecionada");

    const btnApagar = document.getElementById("apagar");

    

    if (inputData && !inputData.getAttribute('value')) {

        const hoje = new Date().toISOString().split('T')[0];

        (inputData as HTMLInputElement).value = hoje;

    }



    inputData?.addEventListener("change", carregarVendasDiarias);



    btnApagar?.addEventListener("click", apagarVendasDoDia);



    carregarVendasDiarias(); 

});