let catalogData = [];
const product_container = document.querySelector('#product_container');
const input_name = document.querySelector('#name');
const button_input_name = document.querySelector('#btn_product_name');
const select_brand = document.querySelector('#brand');
const select_type = document.querySelector('#type');
const select_best_rate = document.querySelector('#best_rate');

document.addEventListener("DOMContentLoaded", async function () {
  await callApi();
  initializeListeners();
});

async function callApi() {
  const makeUpURL = 'http://makeup-api.herokuapp.com/api/v1/products.json';
  catalogData = await fetch(makeUpURL).then(data => data.json());
  setBrands(catalogData);
  setTypes(catalogData);
  buildCatalog(catalogData);
}

function buildCatalog(catalog) {
  clearCatalog();

  const catalogContent = catalog.map(product => {
    const row = `
    <div class="product_card">
        <div class="card_content">
            <img src=${product?.image_link} class="img_card" onerror="this.onerror=null; this.src='./assets/404.jpg'">
            <div class="product_info">
                <h4>${product['name']}</h4>
                  <span class="info_label brand">${product['brand']}</span>
                  <span class="info_label price">${convertCurrency(product['price'])}</span>
            </div> 
        </div>
    </div>
`
    return row;
  })

  product_container.innerHTML = catalogContent.join("");
}

function convertCurrency(price) {
  if (price) {
    return `R$ ${(price * 5.50).toFixed(2)}`
  }
}

function clearCatalog() {
  product_container.innerHTML = "";
}

function initializeListeners() {
  button_input_name.addEventListener("click", () => {
    const product_name = input_name.value.trim();
    if (product_name) {
      const product = catalogData.filter(product => product.name === product_name);
      if (product.length) {
        buildCatalog(product);
      } else {
        alert('Produto não encontrado :(');
        buildCatalog(catalogData);
      }
    }
  })

  select_type.addEventListener('change', () => {
    const type = select_type.value
    const products = type === "all" ? catalogData: catalogData.filter(product => product.product_type === type);
    buildCatalog(products);
  })

  select_brand.addEventListener('change', () => {
    const brand = select_brand.value
    const products = brand === "all" ? catalogData: catalogData.filter(product => product.brand === brand);
    buildCatalog(products);
  })

  select_best_rate.addEventListener('change', () => {
    const type_of_search = select_best_rate.value
    const products = type_of_search === "best_rated" ? catalogData : type_of_search === "lower_prices" ? 
    sortLower('price',catalogData) : sortHigher('price', catalogData)
    buildCatalog(products);
  })

}

function setBrands(catalogData) {
  const brands = [];
  catalogData.forEach(product => {
    if (brands.indexOf(product.brand) < 0 && product.brand) {
        brands.push(product.brand);
    }
  });
  buildSelectOption(select_brand, brands);
}

function setTypes(catalogData) {
  const types = [];
  catalogData.forEach(product => {
    if (types.indexOf(product.product_type) < 0 && product.product_type) {
        types.push(product.product_type);
    }
  });
  buildSelectOption(select_type, types);
}

function buildSelectOption(select_field, options) {
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.innerHTML = option;
    select_field.appendChild(opt);
  })
}

function sortHigher(param, list) {
    return list.sort(function(a, b) {
        const x = b[param]; const y = a[param];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function sortLower(param, list) {
    return list.sort(function(a, b) {
        const x = a[param]; const y = b[param];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}