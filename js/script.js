/*==========================================================================================================================================================================*/
/* Проверка устройства, на котором открыта страница */
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


function isIE() {
    ua = navigator.userAgent;
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
}
if (isIE()) {
    document.querySelector("body").classList.add("ie");
}
if (isMobile.any()) {
    document.querySelector("body").classList.add("_touch");
}


function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector("body").classList.add("_webp");
    } else {
        document.querySelector("body").classList.add("_no-webp");
    }
});



/*==========================================================================================================================================================================*/
/* Menu Burger */
let iconMenu = document.querySelector(".header__menu-icon");
if (iconMenu != null) {
    let delay = 500;
    let body = document.querySelector("body");
    let menuBody = document.querySelector(".header__menu");
    iconMenu.addEventListener("click", function (e) {
        if (!body.classList.contains("_wait")) {
            body_lock(delay);
            iconMenu.classList.toggle("_active");
            menuBody.classList.toggle("_active");
        }
    });
};


function menu_close() {
    let iconMenu = document.querySelector(".menu-header__icon");
    let menuBody = document.querySelector(".header__menu");
    iconMenu.classList.remove("_active");
    menuBody.classList.remove("_active");
}


function body_lock(delay) {
    let body = document.querySelector("body");
    if (body.classList.contains("_lock")) {
        body_lock_remove(delay);
    } else {
        body_lock_add(delay);
    }
}
let unlock = true;


function body_lock_remove(delay) {
    let body = document.querySelector("body");
    if (unlock) {
        let lock_padding = document.querySelectorAll("._lp");
        setTimeout(() => {
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = "0px";
            }
            body.style.paddingRight = "0px";
            body.classList.remove("_lock");
        }, delay);
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, delay);
    }
}


function body_lock_add(delay) {
    let body = document.querySelector("body");
    if (unlock) {
        let lock_padding = document.querySelectorAll("._lp");
        for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        }
        body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        body.classList.add("_lock");
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, delay);
    }
}



/*==========================================================================================================================================================================*/
/* Скрытие header при скролле и показ при обратном скролле */
let header = document.querySelector(".header");
let scrollTop = 0;
window.addEventListener("scroll", function (e) {
	let scrolling = this.scrollY;
	if (scrolling > 150 && scrolling > scrollTop) {
		header.classList.add("_hidden");
	} else {
		header.classList.remove("_hidden");
	}
	scrollTop = scrolling;
});



/*==========================================================================================================================================================================*/
/* 3D Carousel (JQuery) */
if (!document.body.classList.contains("_touch")) {
	$(function () {
		let carousel = $(".carousel")
		carousel.Cloud9Carousel({
			yPos: 62,
			yRadius: 88,
			buttonLeft: $("._carousel-button-prev"),
			buttonRight: $("._carousel-button-next"),
			autoPlay: false,
			bringToFront: true,
			speed: 1,
			itemClass: "carousel__item",
			onLoaded: function () {
				carousel.css("visibility", "visible")
				carousel.css("display", "none")
				carousel.fadeIn(1500)
			}
		})
	})
}


document.addEventListener("keydown", function (e) {
	switch (e.key) {
		case "ArrowLeft":
			document.querySelector("._carousel-button-prev").click();
			break;
		case "ArrowRight":
			document.querySelector("._carousel-button-next").click();
	}
});



/*==========================================================================================================================================================================*/
/* Dynamic Adaptive */
(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll("[data-da]");
	let daElementsArray = [];
	let daMatchMedia = [];
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute("data-da");
			if (daMove != "") {
				const daArray = daMove.split(",");
				const daPlace = daArray[1] ? daArray[1].trim() : "last";
				const daBreakpoint = daArray[2] ? daArray[2].trim() : "767";
				const daType = daArray[3] === "min" ? daArray[3].trim() : "max";
				const daDestination = document.querySelector("." + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute("data-da-index", number);
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector("." + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;
			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}


	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;
			if (daMatchMedia[index].matches) {
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === "first") {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === "last") {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
	}
	dynamicAdapt();


	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute("data-da-index");
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace["parent"];
		const indexPlace = originalPlace["index"];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}


	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}


	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				if (childrenElement.getAttribute("data-da") == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}


	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			}
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}
}());



/*==========================================================================================================================================================================*/
/* Sorting */
let productsParent = document.querySelector(".products__body");
document.querySelector("#sort-popular").onclick = function () {
	sortDescending("data-review");
};
document.querySelector("#sort-ascending").onclick = function () {
	sortAscending("data-price");
};
document.querySelector("#sort-descending").onclick = function () {
	sortDescending("data-price");
};
document.querySelector("#sort-discount").onclick = function () {
	sortDescending("data-discount");
};


function sortDescending(sortType) {
	for (let i = 0; i < productsParent.children.length; i++) {
		for (let j = i; j < productsParent.children.length; j++) {
			if (parseInt(productsParent.children[i].getAttribute(sortType)) < parseInt(productsParent.children[j].getAttribute(sortType))) {
				replaceNode = productsParent.replaceChild(productsParent.children[j], productsParent.children[i]);
				insertAfter(replaceNode, productsParent.children[i]);
			}
		}
		
	}
}


function sortAscending(sortType) {
	for (let i = 0; i < productsParent.children.length; i++) {
		for (let j = i; j < productsParent.children.length; j++) {
			if (parseInt(productsParent.children[i].getAttribute(sortType)) > parseInt(productsParent.children[j].getAttribute(sortType))) {
				replaceNode = productsParent.replaceChild(productsParent.children[j], productsParent.children[i]);
				insertAfter(replaceNode, productsParent.children[i]);
			}
		}
		
	}
}


function insertAfter(elem, refElem) {
	return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}



/*==========================================================================================================================================================================*/
/* Popup */
const popupLinks = document.querySelectorAll("._popup-link");					
const body = document.querySelector("body");												
const lockPadding = document.querySelectorAll(".lock-padding");				
unlock = true;														
const timeout = 800;															


if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute("href").replace("#", "");
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}


const popupCloseIcon = document.querySelectorAll("._popup ._icon-close");
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener("click", function (e) {
			if (this.classList.contains("product-cart__icon")) {
				e.preventDefault();
			} else {
				popupClose(el.closest("._popup"));
				e.preventDefault();
			}
		});
	}
}


function popupOpen(curentPopup) {											
	if (curentPopup && unlock) {							
		const popupActive = document.querySelector(".popup._open");
		if (popupActive) {														
			popupClose(popupActive, false);										
		} else {													
			bodyLock();
		}
		curentPopup.classList.add("_open");									
		curentPopup.addEventListener("click", function (e) {				
			if (!e.target.closest("._popup-body")) {						
				popupClose(e.target.closest("._popup"));				
			}
		});
	}
}


function popupClose(popupActive, doUnlock = true) {							
	if (unlock) {														
		popupActive.classList.remove("_open");								
		if (doUnlock) {															
			bodyUnLock();													
		}
	}
}


function bodyLock() {															
	const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
	if (lockPadding.length > 0) {												
		for (let index = 0; index < lockPadding.length; index++) {			
			const el = lockPadding[index];									
			el.style.paddingRight = lockPaddingValue;					
		}
	}
	body.style.paddingRight = lockPaddingValue;									
	body.classList.add("_lock");												
	unlock = false;															
	setTimeout(function () {												
		unlock = true;														
	}, timeout);																
}
	
	
function bodyUnLock() {														
	setTimeout(function () {													
		if (lockPadding.length > 0) {										
			for (let index = 0; index < lockPadding.length; index++) {		
				const el = lockPadding[index];									
				el.style.paddingRight = "0px";								
			}
		}
		body.style.paddingRight = "0px";									
		body.classList.remove("_lock");										
	}, timeout);															
	unlock = false;														
	setTimeout(function () {												
		unlock = true;															
	}, timeout);															
}



/*==========================================================================================================================================================================*/
/* Product Slider */
const product = document.querySelector(".product-popup");
if (product) {
	const imageSliderItems = product.querySelectorAll(".images-product__item");
	const imagePagination = product.querySelector(".product-popup__pagination");
	if (imageSliderItems.length > 1) {
		imageSliderItems.forEach((item, index) => {
			item.setAttribute("data-index", index);
			imagePagination.innerHTML += `<li class = "image-pagination__item ${index == 0 ? 'image-pagination__item _active' : ''}" data-index="${index}"></li>`;
			item.addEventListener("mouseenter", (e) => {
				product.querySelectorAll(".image-pagination__item").forEach(element => {
					element.classList.remove("_active");
				});
				product.querySelector(`.image-pagination__item[data-index="${e.currentTarget.dataset.index}"]`).classList.add("_active");
			});
			item.addEventListener("mouseleave", (e) => {
				product.querySelectorAll(".image-pagination__item").forEach(element => {
					element.classList.remove("_active")
				});
				product.querySelector(`.image-pagination__item[data-index="0"]`).classList.add("_active");
			});
		});
	}
}



/*==========================================================================================================================================================================*/
/* Slide Toggle */
let _slideUp = (target, duration = 500) => {
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.height = target.offsetHeight + "px";
	target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = "none";
		target.style.removeProperty("height");
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
		target.classList.remove("_slide");
	}, duration);
}


let _slideDown = (target, duration = 500) => {
	target.style.removeProperty("display");
	let display = window.getComputedStyle(target).display;
	if (display === "none")
		display = "block";
	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.height = height + "px";
	target.style.removeProperty("padding-top");
	target.style.removeProperty("padding-bottom");
	target.style.removeProperty("margin-top");
	target.style.removeProperty("margin-bottom");
	window.setTimeout(() => {
		target.style.removeProperty("height");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
		target.classList.remove("_slide");
	}, duration);
}


let _slideToggle = (target, duration = 500) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        if (window.getComputedStyle(target).display === "none") {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }
}



/*==========================================================================================================================================================================*/
/* Count Offer */
let countDate = new Date("April 30, 2022 00:00:00").getTime();
function countOffer() {
    let now = new Date().getTime();
    let gap = countDate - now;
    let secondsCount = 1000;
    let minuteCount = secondsCount * 60;
    let hoursCount = minuteCount * 60;
    let daysCount = hoursCount * 24;
    let days = Math.floor(gap / daysCount);
    let hours = Math.floor((gap % (daysCount)) / (hoursCount));
    let minutes = Math.floor((gap % (hoursCount)) / (minuteCount));
    let seconds = Math.floor((gap % (minuteCount)) / (secondsCount));
	hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    document.getElementById("day").innerText = days;
    document.getElementById("hour").innerText = hours;
    document.getElementById("minute").innerText = minutes;
    document.getElementById("second").innerText = seconds;
}
setInterval(function () {
    countOffer();
}, 1000);



/*==========================================================================================================================================================================*/
/* Обработка "кликов" в документе */
document.addEventListener("click", documentActions);
function documentActions(e) {
	const targetElement = e.target;
	if (targetElement.classList.contains("products__button")) {
		const productId = targetElement.closest(".products__cart").dataset.id;
		addToCart(targetElement, productId);
	}
	if (targetElement.classList.contains("cart-header__icon") || targetElement.closest(".cart-header__icon")) {
		if (document.querySelector(".cart-list").children.length > 0) {
			document.querySelector(".cart-header").classList.toggle("_active");
		}
		e.preventDefault();
	} else if (!targetElement.closest(".cart-header") && !targetElement.classList.contains("products__button")) {
		document.querySelector(".cart-header").classList.remove("_active");
	}
	if (targetElement.classList.contains("cart-list__delete")) {
		const productId = targetElement.closest(".cart-list__item").dataset.cartId;
		updateCart(targetElement, productId, false);
		e.preventDefault();
	}
	if (targetElement.closest(".cart-header__order")) {
		document.querySelector(".cart-popup").classList.add("_open");
		orderListProcessing();
	}
	if (targetElement.closest(".cart-list__title") || targetElement.closest(".cart-list__image") || targetElement.closest(".product-cart__title") ||
		targetElement.closest(".product-cart__image")) {
		document.querySelector(".product-popup").classList.add("_open");
	}
	if (targetElement.classList.contains(".product-cart__icon")) {
		e.preventDefault();
	}
	if (targetElement.classList.contains("_icon-close") && (targetElement.closest(".cart-popup"))) {
		let productsCarts = document.querySelectorAll(".cart-popup__products");
		for (let i = 0; i < productsCarts.length; i++) {
			const productCart = productsCarts[i];
			setTimeout(function () {
				productCart.remove();
			}, 500);
		}
	}
}



/*==========================================================================================================================================================================*/
/* Добавление товаров в корзину и ее редактирование */
function addToCart(productButton, productId) {
	if (!productButton.classList.contains("_blocking")) {
		productButton.classList.add("_blocking");
		const cart = document.querySelector(".cart-header__icon");
		const product = document.querySelector(`[data-id="${productId}"]`);
		const productImage = product.querySelector(".products__image");
		const productImageClone = productImage.cloneNode(true);
		const productImageCloneWidth = productImage.offsetWidth;
		const productImageCloneHeight = productImage.offsetHeight;
		const productImageCloneTop = productImage.getBoundingClientRect().top;
		const productImageCloneLeft = productImage.getBoundingClientRect().left;
		productImageClone.setAttribute("class", "_fly");
		productImageClone.style.cssText =
			`															
			left: ${productImageCloneLeft}px;
			top: ${productImageCloneTop}px;
			width: ${productImageCloneWidth}px;
			height: ${productImageCloneHeight}px;
		`;
		document.body.append(productImageClone);
		const cartCoordTop = cart.getBoundingClientRect().top;
		const cartCoordLeft = cart.getBoundingClientRect().left;
		productImageClone.style.cssText =
			`
			left: ${cartCoordLeft}px;
			top: ${cartCoordTop}px;
			width: 0px;
			height: 0px;
			opacity:0;
		`;
		productImageClone.addEventListener("transitionend", function () {
			if (productButton.classList.contains("_blocking")) {
				productImageClone.remove();
				updateCart(productButton, productId);
				productButton.classList.remove("_blocking");
			}
		});
	}
}


function addToProductCart(productButton, productId) {
	if (!productButton.classList.contains("_blocking")) {
		productButton.classList.add("_blocking");
		setTimeout(function () {
			updateCart(productButton, productId);
			productButton.classList.remove("_blocking");
		}, 700);
	}
}


// Функция формирования и обновления корзины товаров:
function updateCart(productButton, productId, productAdd = true) {
	let cart = document.querySelector(".cart-header");
	let cartIcon = cart.querySelector(".cart-header__icon");
	let cartQuantity = cartIcon.querySelector("span");
	let cartProduct = document.querySelector(`[data-cart-id="${productId}"]`);
	let cartList = document.querySelector(".cart-header__list");
	if (productAdd) {
		if (cartQuantity) {
			cartQuantity.innerHTML = ++cartQuantity.innerHTML;
		} else {
			cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
		}
		if (!cartProduct) {
			let product = document.querySelector(`[data-id="${productId}"]`);
			let cartProductImage = product.querySelector(".products__image").getAttribute("src");
			let cartProductTitle;
			let cartProductPrice;
			let cartProductContent;
			if (product.classList.contains("products__cart")) {
				cartProductTitle = product.querySelector(".info-products__title").innerHTML;
				cartProductPrice = product.querySelector(".info-products__price p").innerHTML;
			} else {
				cartProductTitle = product.querySelector(".info-products__title").innerHTML;
				cartProductPrice = product.querySelector(".info-products__price p").innerHTML;
			}
			if (product.classList.contains("_ru")) {
				cartProductContent =
				`												
				<a href="#popup-product" class="cart-list__image">
					<img src="${cartProductImage}">
				</a>
				<div class="cart-list__body">
					<div class="cart-list__title">${cartProductTitle}</div>
					<div class="cart-list__action">
						<div class="cart-list__quantity">Количество: <span>1</span></div>
						<a href="" class="cart-list__delete">Удалить</a>
					</div>
					<p class="cart-list__price">${cartProductPrice}</p>
				</div>
			`;
			} else {
				cartProductContent =
				`												
				<a href="#popup-product" class="cart-list__image">
					<img src="${cartProductImage}">
				</a>
				<div class="cart-list__body">
					<div class="cart-list__title">${cartProductTitle}</div>
					<div class="cart-list__action">
						<div class="cart-list__quantity">Quantity: <span>1</span></div>
						<a href="" class="cart-list__delete">Delete</a>
					</div>
					<p class="cart-list__price">${cartProductPrice}</p>
				</div>
			`;
			}
			cartList.insertAdjacentHTML("beforeend", `<li data-cart-id="${productId}" class="cart-list__item">${cartProductContent}</li>`);
		} else {
			const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span");
			cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
		}
		productButton.classList.remove("_blocking");
	} else {
		const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span");
		cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
		if (!parseInt(cartProductQuantity.innerHTML)) {
			cartProduct.remove();
		}
		const cartQuantityValue = --cartQuantity.innerHTML;
		if (cartQuantityValue) {
			cartQuantity.innerHTML = cartQuantityValue;
		} else {
			cartQuantity.remove();
			cart.classList.remove("_active");
		}
	}
}



/*==========================================================================================================================================================================*/
/* Сохранение корзины при перезагрузке страницы */
window.onbeforeunload = function (e) {
	let cartList = document.querySelector(".cart-header").innerHTML;
	localStorage.setItem("cartListCasio", JSON.stringify(cartList));
}


window.addEventListener("DOMContentLoaded", recoveryProductsList);


function recoveryProductsList() {
	let cartList = document.querySelector(".cart-header");
	let recoveryCartList = localStorage.getItem("cartListCasio");
	let recovery = JSON.parse(recoveryCartList);
	if (recovery !== null) {
		cartList.innerHTML = recovery;
	}
}



/*==========================================================================================================================================================================*/
/* Обработка и редактирование заказа */
function orderListProcessing() {
	let orderProductsItem = document.querySelectorAll(".cart-list__item");
	for (let index = 0; index < orderProductsItem.length; index++) {
		const orderProductItem = orderProductsItem[index];
		let orderProductsImage = orderProductItem.querySelectorAll(".cart-list__image img");
		let orderProductsTitle = orderProductItem.querySelectorAll(".cart-list__title");
		let orderProductsPrice = orderProductItem.querySelectorAll(".cart-list__price");
		let orderProductsQuantity = orderProductItem.querySelectorAll(".cart-list__quantity span");
		let orderProductColumnOne;
		let orderProductColumnTwo;
		let orderProductQuantity;
		let productPriceNumber = "";
		let orderProduct;
		for (let i = 0; i < orderProductsImage.length; i++) {
			let orderProductImage = orderProductsImage[i].getAttribute("src");
			for (let item = 0; item < orderProductsTitle.length; item++) {
				let orderProductTitle = orderProductsTitle[item].innerText;
				for (let index = 0; index < orderProductsQuantity.length; index++) {
					orderProductQuantity = Number(orderProductsQuantity[index].innerText);
					orderProductColumnOne =
					`
					<div class="product-cart__column">
						<div class="product-cart__image">
		 					<a href="#popup-product">
		 						<img src="${orderProductImage}" alt="${orderProductTitle}">
		 					</a>
		 				</div>
		 				<div class="product-cart__info">
		 					<div class="product-cart__title">
		 						<a href="#popup-product">"${orderProductTitle}"</a>
		 					</div>
		 					<div class="product-cart__quantity quantity">
		 						<div class="quantity__button quantity__button_minus _icon-angle-up"></div>
		 						<div class="quantity__input">
		 							<input autocomplete="off" type="text" name="form" value="${orderProductQuantity}" class="_input">
		 						</div>
		 						<div class="quantity__button quantity__button_plus _icon-angle-up"></div>
		 					</div>
						</div>
					</div>
                `;
				}
			}
		}
		for (let i = 0; i < orderProductsPrice.length; i++) {
			let productPriceValue = orderProductsPrice[i].innerText;
			for (let number in productPriceValue) {
				if (parseInt(productPriceValue[number]) || parseInt(productPriceValue[number]) === 0) {
					productPriceNumber += productPriceValue[number];
					if (document.querySelector(".cart-popup").classList.contains("_ru")) {
						orderProductColumnTwo = 
						`
						<div class="product-cart__column">
							<div class="product-cart__total-price product-total">
								<div class="product-total__text">
									<p>Всего:</p>
									<span class="product-total__value">${productPriceNumber * orderProductQuantity}</span>
									<span>$</span>
								</div>
								<div class="product-total__price">
									<span>${productPriceNumber}</span>
								</div>
							</div>
						</div>
					`;
					} else {
						orderProductColumnTwo = 
						`
						<div class="product-cart__column">
							<div class="product-cart__total-price product-total">
								<div class="product-total__text">
									<p>Only:</p>
									<span class="product-total__value">${productPriceNumber * orderProductQuantity}</span>
									<span>$</span>
								</div>
								<div class="product-total__price">
									<span>${productPriceNumber}</span>
								</div>
							</div>
						</div>
					`;
					}	
				}
			}
		}
		if (document.querySelector(".cart-popup").classList.contains("_ru")) {
			orderProduct = 
			`
			<div class="cart-popup__products product-cart">
				 <div class="product-cart__body">
					${orderProductColumnOne}
					${orderProductColumnTwo}
					 <div class="product-cart__icon">Удалить</div>
				 </div>
				 <div class="product-cart__restore restore-cart">
					 <div class="restore-cart__text">Товар удален из корзины</div>
					 <div class="restore-cart__button">Восстановить</div>
				 </div>
			</div>
		`;
		} else {
			orderProduct = 
			`
			<div class="cart-popup__products product-cart">
				 <div class="product-cart__body">
					${orderProductColumnOne}
					${orderProductColumnTwo}
					 <div class="product-cart__icon">Delete</div>
				 </div>
				 <div class="product-cart__restore restore-cart">
					 <div class="restore-cart__text">Product removed from cart</div>
					 <div class="restore-cart__button">Restore</div>
				 </div>
			</div>
		`;
		}
		let orderCart = document.querySelector(".cart-popup__content");
 		orderCart.insertAdjacentHTML("afterbegin", orderProduct);	
	}
	calculatePrice();
 	calculateTotalPrice();
	deleteCart();
}



/*==========================================================================================================================================================================*/
/* Calculate Price */
function calculatePrice() {
	let quantityButtons = document.querySelectorAll(".quantity__button");
	if (quantityButtons.length > 0) {
		for (let index = 0; index < quantityButtons.length; index++) {
			let quantityButton = quantityButtons[index];
			if (parseInt(quantityButton.closest(".quantity").querySelector("._input").value) == 1) {
				quantityButton.closest(".quantity").querySelector(".quantity__button_minus").classList.add("_disabled");
			}
			quantityButton.addEventListener("click", function (e) {
				let value = parseInt(quantityButton.closest(".quantity").querySelector("._input").value);
				let productPrice = parseInt(quantityButton.closest(".product-cart__body").querySelector(".product-total__price").innerText);
				let productTotalPrice = quantityButton.closest(".product-cart__body").querySelector(".product-total__value");
				let valueNewPrice = "";
				if (this.parentElement.classList.contains("quantity")) {
					if (quantityButton.classList.contains("quantity__button_plus")) {
						value++;
						quantityButton.closest(".quantity").querySelector(".quantity__button_minus").classList.remove("_disabled");
						valueNewPrice = productPrice * value;
						productTotalPrice.textContent = valueNewPrice;
					} else {
						value--;
						valueNewPrice = productPrice * value;
						productTotalPrice.textContent = valueNewPrice;
						if (value == 1) {
							quantityButton.closest(".quantity").querySelector(".quantity__button_minus").classList.add("_disabled");
						}
						if (value < 1) {
							value = 1;
							productTotalPrice.textContent = productPrice;
						}
					}
					quantityButton.closest(".quantity").querySelector("input").value = value;
				};
				calculateTotalPrice();
			})
		};
	}
}

					
function calculateTotalPrice() {
	let productsPrice = document.querySelectorAll(".product-total__value");
	let totalPrice = document.querySelector(".order-cart__value");
	let totalPriceValue = 0;
	for (let index = 0; index < productsPrice.length; index++) {
		let productPrice = parseInt(productsPrice[index].textContent);
		totalPriceValue += productPrice;
	}
	totalPrice.textContent = totalPriceValue;
}



/*==========================================================================================================================================================================*/
/* Delete & Restore Product */
function deleteCart() {
	let deleteButtons = document.querySelectorAll(".product-cart__icon");
	let restoreButtons = document.querySelectorAll(".restore-cart__button");
	if (deleteButtons.length > 0) {
		for (let index = 0; index < deleteButtons.length; index++) {
			let deleteButton = deleteButtons[index];
			deleteButton.addEventListener("click", () => {
				deleteButton.closest(".product-cart__body").classList.add("_delete");
				setTimeout(() => {
					deleteButton.closest(".product-cart__body").style.display = "none";
					deleteButton.closest(".cart-popup__products").querySelector(".product-cart__restore").classList.add("_show");
				}, 400);
			});
		};
	}
	if (restoreButtons.length > 0) {
		for (let index = 0; index < restoreButtons.length; index++) {
			const restoreButton = restoreButtons[index];
			restoreButton.addEventListener("click", () => {
				restoreButton.closest(".product-cart__restore").classList.remove("_show");
				restoreButton.closest(".cart-popup__products").querySelector(".product-cart__body").classList.remove("_delete");
				restoreButton.closest(".cart-popup__products").querySelector(".product-cart__body").style.display = "flex";
			});
		};
	}
}
