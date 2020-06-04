const CAR_PRODUCTS = "cartProductsId";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadProductCart();
});

function getProductsDb() {
  const url = "./js/dbProducts.json";

  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      console.log(err);
    });
}

async function loadProducts() {
  const products = await getProductsDb();

  let html = "";
  products.forEach(product => {
    html += `
         <div class="col-3 product-container">
         <div class="card product">
         <img 
         src="${product.image}"
         class="card-img-top"
         alt="${product.name}"
         />
         <div class="card-body">
         <h5 class="card-title">${product.name}</h5>
         <p class="card-text">${product.price} / Unidad </p>
         <button type="button" class="btn btn-primary btn-cart" onClick=(addProductCart(${product.id}))> Añadir al carrito</button>
         </div>
         </div>
         </div>
         `;
  });

  document.getElementsByClassName("products")[0].innerHTML = html;
}

function openCloseCart() {
  const containerCart = document.getElementsByClassName("cart-products")[0];
  containerCart.classList.forEach(item => {
    if (item === "hidden") {
      containerCart.classList.remove("hidden");
      containerCart.classList.add("active");
    }
    if (item === "active") {
      containerCart.classList.remove("active");
      containerCart.classList.add("hidden");
    }
  });
}

function addProductCart(idProduct) {
  let arrayProductsId = [];

  let localStorageItems = localStorage.getItem(CAR_PRODUCTS);

  if (localStorageItems === null) {
    arrayProductsId.push(idProduct);
    localStorage.setItem(CAR_PRODUCTS, arrayProductsId);
  } else {
    let productsId = localStorage.getItem(CAR_PRODUCTS);
    if (productsId.length > 0) {
      productsId += "," + idProduct;
    } else {
      productsId = productId;
    }
    localStorage.setItem(CAR_PRODUCTS, productsId);
  }
  loadProductCart();
}

async function loadProductCart() {
  const products = await getProductsDb();

  // Convertimos el resultado del localStorage en un array
  const localStorageItems = localStorage.getItem(CAR_PRODUCTS);

  let html = "";
  if (!localStorageItems) {
    html = `
        <div class="cart-product empty">
            <p>Carrito vacio.</p>
        </div>
      `;
  } else {
    const idProductsSplit = localStorageItems.split(",");

    // Eliminamos los IDs duplicaos
    const idProductsCart = Array.from(new Set(idProductsSplit));

    idProductsCart.forEach(id => {
      products.forEach(product => {
        if (id == product.id) {
          const quantity = countDuplicatesId(id, idProductsSplit);
          const totalPrice = product.price * quantity;

          html += `
            <div class="cart-product">
                <img src="${product.image}" alt="${product.name}" />
                <div class="cart-product-info">
                    <span class="quantity">${quantity}</span>
                    <p>${product.name}</p>
                    <p>${totalPrice.toFixed(2)}</p>
                    <p class="change-quantity">
                        <button onClick="decreaseQuantity(${
                          product.id
                        })">-</button>
                        <button onClick="increaseQuantity(${
                          product.id
                        })">+</button>
                    </p>
                    <p class="cart-product-delete">
                        <button onClick="deleteProductCart(${
                          product.id
                        })">Eliminar</button>
                    </p>
                </div>
            </div>
        `;
        }
      });
    });
  }

  document.getElementsByClassName("cart-products")[0].innerHTML = html;
}

function deleteProductCart(idProduct) {
  const idProductsCart = localStorage.getItem(CAR_PRODUCTS);
  const arrayIdProductsCart = idProductsCart.split(",");
  const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);

  if (resultIdDelete) {
    let count = 0;
    let idsString = "";

    resultIdDelete.forEach(id => {
      count++;
      if (count < resultIdDelete.length) {
        idsString += id + ",";
      } else {
        idsString += id;
      }
    });
    localStorage.setItem(CAR_PRODUCTS, idString);
  }
}

function countDuplicatesId(value, arraysIds) {
  let count = 0;
  arraysIds.forEach(id => {
    if (value == id) {
      count++;
    }
  });
  return count;
}

function deleteAllIds(id, arrayIds) {
  return arrayIds.filter(itemId => {
    return item != id;
  });
}
