import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// Función para añadir un producto al carrito
function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart");

  // Inicializar array vacío si no existe
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // Agregar producto al carrito
  cartItems.push(product);

  // Guardar carrito actualizado en localStorage
  setLocalStorage("so-cart", cartItems);
}

// Event handler para el botón "Add to Cart"
async function addToCartHandler(e) {
  const productId = e.target.dataset.id;
  const product = await dataSource.findProductById(productId);
  
  const productData = {
    Name: product.Name,
    Image: product.Image,
    Colors: product.Colors,
    FinalPrice: product.FinalPrice
  };

  addProductToCart(productData);
}

// Cargar productos en la página principal dinámicamente
async function loadProducts() {
  const productList = document.querySelector(".product-list");
  const products = await dataSource.getData();

  // Generar la lista de productos
  productList.innerHTML = products.map(productTemplate).join('');
}

// Template para cada producto
function productTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/index.html?product=${product.Id}"> <!-- Enlace dinámico a la página de detalles -->
        <img src="${product.Image}" alt="${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button class="addToCart" data-id="${product.Id}">Add to Cart</button>
    </li>
  `;
}

// Ejecutar funciones
document.querySelectorAll(".addToCart").forEach((button) => {
  button.addEventListener("click", addToCartHandler);
});

// Cargar productos al cargar la página
loadProducts();
