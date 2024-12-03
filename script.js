
let cart = [];
let products = [];

// Função para buscar produtos do backend
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    products = await response.json();
    console.log(products); // Verifique os dados no console
    displayProducts(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.message);
  }
}

// Função para exibir os produtos no DOM
function displayProducts(productsToDisplay) {
  const productsGrid = document.getElementById("products-grid");

  if (!productsGrid) {
    console.error("Elemento com ID 'products-grid' não encontrado no DOM.");
    return;
  }

  // Limpa o conteúdo atual para evitar duplicação
  productsGrid.innerHTML = "";

  // Cria os cards dinamicamente com base nos produtos recebidos
  productsToDisplay.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <img src="https://via.placeholder.com/250" alt="${product.nome}">
      <h3>${product.nome}</h3>
      <p>${product.descricao}</p>
      <p><strong>R$ ${product.preco.toFixed(2)}</strong></p>
      <p>Estoque: ${product.estoque}</p>
      <button onclick="addToCart('${product._id}')">Adicionar ao Carrinho</button>
    `;

    productsGrid.appendChild(productCard);
  });
}

// Função chamada ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); // Carrega os produtos automaticamente
});

// Função para filtrar produtos por categoria
function filterProducts(category) {
  if (category === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter((product) => product.categoria === category);
    displayProducts(filtered);
  }
}

// Função para adicionar um produto ao carrinho
function addToCart(productId) {
  const product = products.find((p) => p._id === productId);
  if (product) {
    cart.push(product);
    updateCart();
  }
}

// Função para atualizar o carrinho
function updateCart() {
  const cartList = document.getElementById("cart");
  const cartTotal = document.getElementById("cart-total");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.preco;
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `
      ${item.nome} - R$ ${item.preco.toFixed(2)}
      <button onclick="removeFromCart('${item._id}')">X</button>
    `;
    cartList.appendChild(cartItem);
  });

  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Função para remover um item do carrinho
function removeFromCart(productId) {
  cart = cart.filter((item) => item._id !== productId);
  updateCart();
}

// Função para finalizar a compra
function checkout() {
  alert("Compra finalizada! Obrigado por escolher nossa loja!");
  cart = [];
  updateCart();
}

// Funções para manipulação de produtos (criar, listar, obter, atualizar, deletar)
const criarProduto = async (produto) => {
  try {
    const resposta = await fetch(`https://ecommerce-suplementos.vercel.app/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.error || "Erro ao criar produto.");
    }

    const data = await resposta.json();
    console.log("Produto criado com sucesso:", data);
  } catch (erro) {
    console.error("Erro ao criar produto:", erro.message);
  }
};

const listarProdutos = async () => {
  try {
    const resposta = await fetch(`https://ecommerce-suplementos.vercel.app/api/products`, {
      method: "GET",
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar produtos.");
    }

    const produtos = await resposta.json();
    console.log("Lista de produtos:", produtos);
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro.message);
  }
};

const obterProduto = async (id) => {
  try {
    const resposta = await fetch(`https://ecommerce-suplementos.vercel.app/api/products/${id}`, {
      method: "GET",
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar produto.");
    }

    const produto = await resposta.json();
    console.log("Detalhes do produto:", produto);
  } catch (erro) {
    console.error("Erro ao obter produto:", erro.message);
  }
};

const atualizarProduto = async (id, dadosAtualizados) => {
  try {
    const resposta = await fetch(`https://ecommerce-suplementos.vercel.app/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.error || "Erro ao atualizar produto.");
    }

    const produto = await resposta.json();
    console.log("Produto atualizado:", produto);
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro.message);
  }
};

const deletarProduto = async (id) => {
  try {
    const resposta = await fetch(`https://ecommerce-suplementos.vercel.app/api/products/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error("Erro ao deletar produto.");
    }

    const data = await resposta.json();
    console.log(data.message);
  } catch (erro) {
    console.error("Erro ao deletar produto:", erro.message);
  }
};

// Chama listar produtos para inicializar o processo
listarProdutos();
