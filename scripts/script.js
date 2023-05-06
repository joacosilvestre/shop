let products = [];
let cart = [];

const nav__menu = document.querySelector('.navBar__menu');
const btn__nav = document.querySelector('.btn__nav');

const navLogo = document.querySelector('.navBar__logo');

const btnNavProductos = document.querySelector('#btnNavProductos');
const btnNavSeleccionArgentina = document.querySelector('#btnNavSeleccionArgentina');
const btnNavLigaProfesional = document.querySelector('#btnNavLigaProfesional');
const btnNavPrimeraNacional = document.querySelector('#btnNavPrimeraNacional');
const btnNavTodosProductos = document.querySelector('#btnNavTodosProductos');

const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
searchInput.value = '';
const productNotFoundedAlert = document.querySelector('#productNotFoundedAlert');

const mainInformation = document.querySelector('#mainInformation');

const productsInformationTitle = document.querySelector('.productsInformation__title');
const productsInformationResults = document.querySelector('.productsInformation__results');

const productsInformation = document.querySelector('#productsInformation');
const productsContainer = document.querySelector('.productsContainer');
const templateContainerProducts = document.getElementById("template-containerProducts").content;
const fragmentProduct = document.createDocumentFragment();

const cartView = document.querySelector('.cart');
const cartList = document.getElementById('cart__items');
const templateCartProducts = document.getElementById("template-CartProducts").content;
const fragmentCart = document.createDocumentFragment();
const cartResumeTotal = document.querySelector('.cart__sideContainer__resume__total');
const btnFinishBuy = document.querySelector('.cart__sideContainer__resume__btnFinishBuy');
const productAddToast = document.querySelector('.productAddToast');
const cartProductsCounter = document.querySelector('.navBar__menu__btnCartMenu-counter');
const cartProductsCounterResponsive = document.querySelector('.navBar__btnCartResponsive-counter');


const btnFooterLigaProfesional = document.querySelector('#btnFooterLigaProfesional');
const btnFooterPrimeraNacional = document.querySelector('#btnFooterPrimeraNacional');
const btnFooterTodosProductos = document.querySelector('#btnFooterTodosProductos');
const btnFooterSeleccionArgentina = document.querySelector('#btnFooterSeleccionArgentina');




document.addEventListener('DOMContentLoaded', () => {
        fetchData();
        checkCartLocalStorage();
        addEventShowCart();
});


const checkCartLocalStorage = () => {
        const cartStorage = localStorage.getItem('cart');
        if (cartStorage) {
                cart = JSON.parse(cartStorage);
                updateCartProductView()
                let units = arrayLength(cart);
                cartProductsCounter.textContent = units;
                cartProductsCounterResponsive.textContent = units;
        }
};


const fetchData = async () => {
        try {
                const res = await fetch(`./assets/products.json`);
                const data = await res.json();
                products = data; //almaceno los datos del archivo en un array
                loadRandomProductsToContainer(products);
        } catch (error) {
                console.log(error)
        }
}



const loadRandomProductsToContainer = (data) => {
        let randomProducts = [];
        let randomNumbers = [];
        let i = 0;
        while (i < 12) {
                num = Math.floor(Math.random() * data.length);
                if (!randomNumbers.includes(num)) {
                        randomNumbers.push(num);
                        i++;
                        continue;
                }
        }
        randomNumbers.forEach(id => {
                randomProducts.push(data[id]);
        });
        loadContainerProducts(randomProducts);
}

const loadContainerProducts = (data) => {
        productsContainer.innerHTML = '';
        data.forEach(product => {
                templateContainerProducts.querySelectorAll('img')[0].setAttribute('src', `./assets/images/${product.imgFrontUrl}`);
                templateContainerProducts.querySelectorAll('img')[0].setAttribute('alt', `${product.name}`);
                templateContainerProducts.querySelectorAll('img')[1].setAttribute('src', `./assets/images/${product.imgBackUrl}`);
                templateContainerProducts.querySelectorAll('img')[1].setAttribute('alt', `${product.name}`);
                templateContainerProducts.querySelector('h3').textContent = `${product.name} ${product.year}`;
                templateContainerProducts.querySelector('p').textContent = `$${product.price}`;
                templateContainerProducts.querySelector('.productsContainer__item__button').dataset.id = product.id;

                const clone = templateContainerProducts.cloneNode(true);
                fragmentProduct.appendChild(clone);
        });
        productsContainer.appendChild(fragmentProduct);
}



productsContainer.addEventListener("click", (e) => {
        addCart(e);
});

const addCart = e => {
        if (e.target.classList.contains('fa-cart-plus')) { //click en el icono
                setCart(e.target.parentElement.parentElement);
        } else {
                if (e.target.classList.contains('productsContainer__item__button')) {
                        setCart(e.target.parentElement);
                }
        }
        e.stopPropagation();
}


const setCart = (object) => {
        const product = {
                id: object.querySelector('button').dataset.id,
                name: object.querySelector('h3').textContent,
                price: object.querySelector('p').textContent,
                img: object.querySelector('img').getAttribute('src'),
                units: 1
        }
        if (cart[product.id]) {
                product.units = cart[product.id].units + 1;
        }
        cart[product.id] = {
                ...product
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
        cartProductsCounter.textContent = arrayLength(cart);
        cartProductsCounterResponsive.textContent = arrayLength(cart);
        if (!productAddToast.classList.contains('show')) {
                productAddToast.classList.toggle('show');
                setTimeout(() => {
                        productAddToast.classList.toggle('show');
                }, 1500)
        }



}



function updateCartProductView() {
        let totalPrice = 0;
        cartList.innerHTML = '';
        cart.forEach(product => {
                if (product) { //si no es null
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__main__name").textContent = product.name;
                        templateCartProducts.querySelector("img").setAttribute("src", `${product.img}`);
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__number").textContent = product.units;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__price").textContent = `$${Number(product.price.slice(1)) * product.units}`;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__main__btnDelete").dataset.id = product.id;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__btn__add").dataset.id = product.id;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__btn__rest").dataset.id = product.id;

                        totalPrice += Number(product.price.slice(1)) * product.units;
                        const clone = templateCartProducts.cloneNode(true);
                        fragmentCart.appendChild(clone);
                }
        });
        cartList.appendChild(fragmentCart);
        if (totalPrice == 0) {
                cartResumeTotal.textContent = 'Carrito vacio';
        } else {
                if (!btnFinishBuy.classList.contains('show'))
                        btnFinishBuy.classList.toggle('show');
                cartResumeTotal.textContent = `Total a pagar: $${totalPrice}`;
        }
        if (arrayLength(cart) == 0) {
                if (btnFinishBuy.classList.contains('show'))
                        btnFinishBuy.classList.toggle('show');
        }

}


cartList.addEventListener('click', (e) => {
        cartProductsModify(e);
});

const cartProductsModify = (e) => {
        //Aumentar unidades
        if (e.target.classList.contains('fa-plus')) { //click en icono
                plusProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__description__units__btn__add')) {
                        plusProductCart(e.target.dataset.id);
                }
        }

        if (e.target.classList.contains('fa-minus')) { //click en icono
                minusProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__description__units__btn__rest')) {
                        minusProductCart(e.target.dataset.id);
                }
        }


        if (e.target.classList.contains('fa-trash')) { //click en icono
                deleteProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__main__btnDelete')) {
                        deleteProductCart(e.target.dataset.id);
                }
        }
        cartProductsCounter.textContent = arrayLength(cart);
        cartProductsCounterResponsive.textContent = arrayLength(cart);
        e.stopPropagation();
};

const plusProductCart = (id) => {
        const product = cart[id];
        product.units++;
        cart[id] = {
                ...product
        };
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
};

const minusProductCart = (id) => {
        const product = cart[id];
        product.units--;
        if (product.units === 0) {
                delete cart[id];
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
};

const deleteProductCart = (id) => {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
}


searchInput.addEventListener('keyup', (e) => {


        if (searchInput.value == 0) {
                if (productNotFoundedAlert.classList.contains('show'))
                        productNotFoundedAlert.classList.toggle('show');
                productsContainer.innerHTML = '';
                productsInformationTitle.textContent = `Descubrí nuestros productos`;
                productsInformationResults.textContent = ``;
                loadRandomProductsToContainer(products);
                e.preventDefault(); //evita recarga de pagina
                scrollTo(0, productsInformation.offsetTop - 50);


        }
});

searchForm.addEventListener('submit', (e) => {
        searchProduct(searchInput);
        e.preventDefault(); //evita recarga de pagina
}, false);

const searchProduct = (searchInput) => {
        result = filterProducts(searchInput.value);

        if (result.length == 0) {
                if (!productNotFoundedAlert.classList.contains('show'))
                        productNotFoundedAlert.classList.toggle('show');
        } else {
                if (nav__menu.classList.contains('show')) {
                        nav__menu.classList.toggle('show');
                        btn__nav.classList.toggle('active');
                }
                if (productNotFoundedAlert.classList.contains('show'))
                        productNotFoundedAlert.classList.toggle('show');

                productsInformationTitle.textContent = `Busqueda: ${searchInput.value}`;
                productsInformationResults.textContent = `${ result.length} Resultados`
                scrollTo(0, productsInformation.offsetTop - 50);
                setTimeout(() => {
                        loadContainerProducts(resul);
                }, 400);
        }
}

const filterProducts = (parameter) => {
        resul = products.filter(product =>
                product.category.toLowerCase().includes(parameter.toLowerCase())
        )
        return resul;
}


navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        if (cartView.classList.contains('show'))
                cartView.classList.toggle('show')
        scrollTo(0, mainInformation.offsetTop - 50);
})

btnNavProductos.addEventListener('click', (e) => {
        e.preventDefault();
        productsContainer.innerHTML = '';
        productsInformationTitle.textContent = `Descubrí nuestros productos`;
        productsInformationResults.textContent = ``;
        loadRandomProductsToContainer(products);
        scrollTo(0, productsInformation.offsetTop - 50);
});
btnNavSeleccionArgentina.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Seleccion Argentina');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Categoria: Selección Argentina`;
        productsInformationResults.textContent = `${ filter.length} Resultados`;
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnNavLigaProfesional.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Liga Profesional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Categoria: Liga Profesional`;
        productsInformationResults.textContent = `${ filter.length} Resultados`
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});

btnNavPrimeraNacional.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Primera Nacional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Categoria: Primera Nacional`;
        productsInformationResults.textContent = `${ filter.length} Resultados`
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});

btnNavTodosProductos.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Todos los productos`;
        productsInformationResults.textContent = `${ products.length} Resultados`
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(products);
        }, 400)
});
btnFooterSeleccionArgentina.addEventListener("click", (e) => {
        e.preventDefault();
        let filter = filterProducts('Seleccion Argentina');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Categoria: Seleccion Argentina`;
        productsInformationResults.textContent = `${ filter.length} Resultados`
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterLigaProfesional.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Liga Profesional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Categoria: Liga Profesional`;
        productsInformationResults.textContent = `${ filter.length} Resultados`
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterPrimeraNacional.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Primera Nacional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Categoria: Primera Nacional`;
        productsInformationResults.textContent = `${ filter.length} Resultados`
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterTodosProductos.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent = `Todos los productos`;
        productsInformationResults.textContent = `${ products.length} Resultados`
        scrollTo(0, productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(products);
        }, 400)
});

const arrayLength = (array) => {
        let count = 0;
        array.forEach(product => {

                if (product)
                        count += product.units;
        });
        return count;
}

btn__nav.addEventListener('click', () => {
        nav__menu.classList.toggle('show');
        btn__nav.classList.toggle('active');
})


const addEventShowCart = () => {

        const btnCart = document.getElementById('btnCartView');
        btnCart.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });


        cartView.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart')) {
                        cartView.classList.toggle('show');
                }
        });


        const btnCloseCartView = document.querySelector('.cart__sideContainer__title');
        btnCloseCartView.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });


        const btnCartViewResponsive = document.querySelector('#btnCartViewResponsive');
        btnCartViewResponsive.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });
}

btnFinishBuy.addEventListener('click', () => {
        location.href = './form.html';
})