"use strict";
// --- Funções Auxiliares de LocalStorage ---
// Inicializa o localStorage se os dados não existirem
function inicializarLocalStorage() {
    if (!localStorage.getItem("sabores")) {
        localStorage.setItem("sabores", JSON.stringify(["Mussarela", "Calabresa", "Portuguesa"]));
    }
    if (!localStorage.getItem("bebidas")) {
        localStorage.setItem("bebidas", JSON.stringify([
            { nome: "Coca-Cola 2L", preco: 10 },
            { nome: "Água 500ml", preco: 3 }
        ]));
    }
}
// Carrega dados e garante que estejam no formato de array
function carregarLista(chave) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
}
// Salva dados no localStorage
function salvarLista(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista));
    // Dispara evento para que outras páginas (como o formulário de pedido) saibam da mudança
    try {
        window.dispatchEvent(new Event('storage'));
    }
    catch (e) {
        console.error("Erro ao disparar evento de storage:", e);
    }
}
// --- Renderização de Listas ---
function mostrarSabores() {
    const listaDiv = document.getElementById("lista-sabores");
    if (!listaDiv)
        return;
    listaDiv.innerHTML = "";
    const sabores = carregarLista("sabores");
    sabores.forEach((sabor, i) => {
        const div = document.createElement("div");
        div.className = "item";
        const nomeSpan = document.createElement("span");
        nomeSpan.textContent = sabor;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Remover";
        // Anexa o evento de remoção
        btn.addEventListener('click', () => remover('sabores', i));
        div.appendChild(nomeSpan);
        div.appendChild(btn);
        listaDiv.appendChild(div);
    });
}
function mostrarBebidas() {
    const listaDiv = document.getElementById("lista-bebidas");
    if (!listaDiv)
        return;
    listaDiv.innerHTML = "";
    const bebidas = carregarLista("bebidas");
    bebidas.forEach((b, i) => {
        const div = document.createElement("div");
        div.className = "item";
        const nomeSpan = document.createElement("span");
        // Protege contra dados mal formatados e garante 2 casas decimais
        const preco = (typeof b.preco === "number") ? b.preco : parseFloat(String(b.preco));
        nomeSpan.textContent = `${b.nome} — R$ ${preco.toFixed(2)}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Remover";
        // Anexa o evento de remoção
        btn.addEventListener('click', () => remover('bebidas', i));
        div.appendChild(nomeSpan);
        div.appendChild(btn);
        listaDiv.appendChild(div);
    });
}
// --- Lógica de CRUD ---
function adicionarSabor() {
    const input = document.getElementById("novo-sabor");
    const valor = input.value.trim();
    if (!valor)
        return alert("Digite um sabor!");
    let sabores = carregarLista("sabores");
    // Verifica se já existe (ignorando caixa)
    if (sabores.some(s => s.toLowerCase() === valor.toLowerCase())) {
        return alert("Sabor já existe!");
    }
    sabores.push(valor);
    salvarLista("sabores", sabores);
    input.value = "";
    mostrarSabores();
}
function adicionarBebida() {
    const nomeInput = document.getElementById("nova-bebida");
    const precoInput = document.getElementById("preco-bebida");
    const nome = nomeInput.value.trim();
    let precoRaw = precoInput.value.trim();
    if (!nome || precoRaw === "")
        return alert("Digite nome e preço da bebida!");
    // Normalização e conversão de preço
    precoRaw = precoRaw.replace(",", ".");
    const preco = parseFloat(precoRaw);
    if (isNaN(preco) || preco <= 0) {
        return alert("Digite um preço válido (ex: 10,50 ou 10.50) maior que zero.");
    }
    let bebidas = carregarLista("bebidas");
    // Verifica se já existe
    if (bebidas.some(b => b.nome.toLowerCase() === nome.toLowerCase())) {
        return alert("Bebida já existe!");
    }
    const novaBebida = { nome, preco: parseFloat(preco.toFixed(2)) };
    bebidas.push(novaBebida);
    salvarLista("bebidas", bebidas);
    nomeInput.value = "";
    precoInput.value = "";
    mostrarBebidas();
}
function remover(tipo, index) {
    if (!confirm(`Tem certeza que deseja remover este item?`))
        return;
    let lista = carregarLista(tipo);
    if (index >= 0 && index < lista.length) {
        lista.splice(index, 1);
        salvarLista(tipo, lista);
        tipo === "sabores" ? mostrarSabores() : mostrarBebidas();
    }
}
// --- Inicialização da Página ---
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b;
    inicializarLocalStorage();
    // Anexa eventos aos botões
    (_a = document.getElementById("btn-adicionar-sabor")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", adicionarSabor);
    (_b = document.getElementById("btn-adicionar-bebida")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", adicionarBebida);
    // Renderiza as listas ao carregar a página
    mostrarSabores();
    mostrarBebidas();
});
