
////////// All Use Variable //////////
const apiHost = 'https://api.appworks-school.tw'
const apiVersion = '1.0'
const apiRootURL = `${apiHost}/api/${apiVersion}`
const userPathIndex = './index.html'
let productUrlParameter = location.search

// For product search feature
const searchBar = document.querySelector('.search-bar')
const searchIcon = document.querySelector('.search-bar__icon')
const searchInput = document.querySelector('.search-bar__input')
const searchBarClose = document.querySelector('.search-bar__close')
const logoImage = document.querySelector('.logo')
let searchIconFirstClick = false



////////// Facebook Login Feature //////////
window.fbAsyncInit = function () {
    FB.init({
        appId: '2536122549958346',
        cookie: true,  // Enable cookies to allow the server to access the session.
        xfbml: true,  // Parse social plugins on this webpage.
        version: 'v5.0'
    })

    // Called after the JS SDK has been initialized.
    FB.getLoginStatus(response => {
        statusChangeCallback(response) // Returns the login status.
    })
}

// Called when a person is finished with the Login Button.
function checkLoginState() {
    FB.getLoginStatus(response => {  // See the onlogin handler
        statusChangeCallback(response)
    })
}

// Called with the results from FB.getLoginStatus().
function statusChangeCallback(response) {   // The current login status of the person.
    const memberPictureLinkArr = document.querySelectorAll('.member__button a')
    console.log(memberPictureLinkArr)
    if (response.status === 'connected') {  // Logged into your webpage and Facebook.
        getDataAPI()
        memberPictureLinkArr.forEach((memberPictureLink) => {
            memberPictureLink.setAttribute('href', './profile.html')
        })
    } else {
        memberPictureLinkArr.forEach((memberPictureLink) => {
            memberPictureLink.setAttribute('href', './login.html')
        })
    }
}

// Testing Graph API after login.  See statusChangeCallback() for when this call is made.
function getDataAPI() {
    FB.api('/me?fields=name,id,email,picture', response => {
        console.log(response)
        setUserPicture(response)
    })
}

// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) return
    js = d.createElement(s); js.id = id
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

function setUserPicture(response) {
    const memberPictureArr = document.querySelectorAll('.member__button a img')
    memberPictureArr.forEach((memberPicture) => {
        memberPicture.setAttribute('src', `${response.picture.data.url}`)
    })
}



////////// Product Detail Area //////////
function productDetailAjax(src, callback) {
    fetch(src).then(res => {
        return res.json()
    }).then(json => {
        callback(json)
    })
}

function productDetailRender(json) {
    const productMainImage = document.querySelector('.product-detail-top__main-image img')
    const productTitle = document.querySelector('.product-detail-top__content-top h2')
    const productID = document.querySelector('.product-detail-top__content-top p:nth-child(2)')
    const productPrice = document.querySelector('.product-detail-top__content-top p:nth-child(3)')
    const productColorArea = document.querySelector('.product-item__color ul')
    const productSizeArea = document.querySelector('.product-item__size ul')
    const productTexture = document.querySelector('.product-item__texture p:nth-child(1)')
    const productDescription = document.querySelector('.product-item__texture p:nth-child(2)')
    const productMadePlace = document.querySelector('.product-item__origin p:nth-child(1)')
    const productProcessPlace = document.querySelector('.product-item__origin p:nth-child(2)')
    const productStory = document.querySelector('.product-item__content-item p')
    const productImageArea = document.querySelector('.product-item__image')

    const productData = json.data
    productMainImage.setAttribute('src', `${productData.main_image}`)
    productMainImage.setAttribute('alt', `${productData.title}`)
    productTitle.textContent = `${productData.title}`
    productID.textContent = `${productData.id}`
    productPrice.textContent = `TWD.${productData.price}`
    productTexture.textContent = `材質：${productData.texture}`
    productDescription.innerText = `${productData.description}`
    productMadePlace.textContent = `素材產地 / ${productData.place}`
    productProcessPlace.textContent = `加工產地 / ${productData.place}`
    productStory.textContent = `${productData.story}`

    // Add product color
    for (let i = 0; i < productData.colors.length; i++) {
        const productColorLi = document.createElement('li')
        productColorArea.appendChild(productColorLi)
        productColorLi.classList.add(`color${i}`)
        const productColor = document.querySelector(`.color${i}`)
        productColor.style.backgroundColor = `#${productData.colors[i].code}`
    }
    // Add product size
    for (let i = 0; i < productData.sizes.length; i++) {
        const productSizeLi = document.createElement('li')
        productSizeLi.textContent = `${productData.sizes[i]}`
        productSizeArea.appendChild(productSizeLi)
    }
    // Add product images
    for (let i = 0; i < 2; i++) {
        const productImageImg = document.createElement('img')
        productImageImg.classList.add(`image${i}`)
        productImageArea.appendChild(productImageImg)
        const productImage = document.querySelector(`.image${i}`)
        productImage.setAttribute('src', `${productData.images[i]}`)
        productImage.setAttribute('alt', `${productData.title}`)
    }

    // Add cart product list from localStorage and show qty of header cart UI
    const cartProductList = []
    const cartQuantity = document.querySelector('.cart__qty')
    addLocalStorageToCartProduct(cartProductList, cartQuantity)

    handleProductStockAndVariants(productData, cartProductList, cartQuantity)
}

function addLocalStorageToCartProduct(cartProductList, cartQuantity) {
    const localStorageCart = JSON.parse(localStorage.getItem('cart'))
    console.log(localStorageCart)
    if (localStorageCart !== null) {
        let localStorageCartList = localStorageCart.order.list
        if (typeof (localStorageCartList) !== undefined && localStorageCartList.length !== 0) {
            localStorageCartList.forEach(productItem => {
                cartProductList.push(productItem)
                cartQuantity.textContent = cartProductList.length
            })
        } else {
            cartQuantity.textContent = '0'
        }
    } else {
        cartQuantity.textContent = '0'
    }
}

function handleProductStockAndVariants(productData, cartProductList, cartQuantity) {
    const productColorArr = document.querySelectorAll('.product-item__color ul li')
    const productSizeArr = document.querySelectorAll('.product-item__size ul li')
    const productQuantity = document.querySelector('.product-item__quantity__count p')
    const productOpeAdd = document.querySelector('.operator-add')
    const productOpeMinus = document.querySelector('.operator-minus')
    const addToCartBtn = document.querySelector('.btn-add-to-cart')

    // Color and Size UI by default
    productColorArr[0].classList.add('product-item__color--active')
    productSizeArr[0].classList.add('product-item__size--active')

    // UserBuyCount and Stock UI and add to cart by default
    let userBuyCount
    let currentStock
    let isAddtoCart = false
    const stockOverWord = document.querySelector('.product-item__stock-over')

    // Set current color data
    let productColorCurrentCode = productData.colors[0].code
    let productColorCurrentName = productData.colors[0].name

    // Set currentSize data
    let productSizeCurrentDom = productSizeArr[0]
    let productSizeCurrentSize = productSizeCurrentDom.textContent

    findStock()
    resetUserCountAndStock()

    function findStock() {
        productData.variants.forEach(productVariant => {
            if (productVariant.color_code === productColorCurrentCode && productVariant.size === productSizeCurrentSize) {
                currentStock = productVariant.stock
            }
        })
    }

    function resetUserCountAndStock() {
        if (currentStock === 0) {
            userBuyCount = 0
            productQuantity.textContent = userBuyCount
            stockOverWord.classList.add('product-item__stock-over--active')
        } else {
            userBuyCount = 1
            productQuantity.textContent = userBuyCount
            currentStock = currentStock - 1
            stockOverWord.classList.remove('product-item__stock-over--active')
        }
    }

    // User click + or -, operate user buy count and stock
    productOpeAdd.addEventListener('click', () => {
        if (currentStock > 0) {
            userBuyCount++
            currentStock--
            productQuantity.textContent = userBuyCount
        } else {
            stockOverWord.classList.add('product-item__stock-over--active')
        }
    })

    productOpeMinus.addEventListener('click', () => {
        if (userBuyCount !== 0) {
            userBuyCount--
            currentStock++
            productQuantity.textContent = userBuyCount
            stockOverWord.classList.remove('product-item__stock-over--active')
        }
    })

    // User choose new color
    for (let i = 0; i < productColorArr.length; i++) {
        productColorArr[i].addEventListener('click', () => {
            for (let n = 0; n < productColorArr.length; n++) {
                productColorArr[n].classList.remove('product-item__color--active')
            }
            productColorArr[i].classList.add('product-item__color--active')
            if (productColorArr[i].classList.contains('product-item__color--active') === true) {
                productColorCurrentCode = productData.colors[i].code
                productColorCurrentName = productData.colors[i].name
                findStock()
            }
            resetUserCountAndStock()
        })
    }

    // User choose new size
    productSizeArr.forEach(productSize => {
        productSize.addEventListener('click', () => {
            for (let i = 0; i < productSizeArr.length; i++) {
                productSizeArr[i].classList.remove('product-item__size--active')
            }
            productSize.classList.add('product-item__size--active')
            if (productSize.classList.contains('product-item__size--active') === true) {
                productSizeCurrentDom = productSize
                productSizeCurrentSize = productSizeCurrentDom.textContent
                findStock()
            }
            resetUserCountAndStock()
        })
    })

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        addToCart(productData, cartProductList, productColorCurrentCode, productColorCurrentName, productSizeCurrentSize, userBuyCount, cartQuantity, isAddtoCart, currentStock)
    })
}

function addToCart(productData, cartProductList, productColorCurrentCode, productColorCurrentName, productSizeCurrentSize, userBuyCount, cartQuantity, isAddtoCart, currentStock) {
    // Check if product item is in cart or not, 「 is 」 will stop / 「 isn't 」 will keep run 
    cartProductList.forEach(productItem => {
        if (productItem.id === productData.id && productItem.color.code === productColorCurrentCode && productItem.size === productSizeCurrentSize) {
            alert('同款商品已在購物車，購買數量可至購物車調整哦')
            isAddtoCart = true
        }
    })

    let productItemAddToCart
    if (isAddtoCart === false && userBuyCount !== 0) {
        // Add product item to cart product list arr
        productItemAddToCart = {
            id: productData.id,
            name: productData.title,
            price: productData.price,
            color: {
                code: productColorCurrentCode,
                name: productColorCurrentName
            },
            size: productSizeCurrentSize,
            qty: userBuyCount,
            main_image: productData.main_image,
            total_stock: userBuyCount + currentStock
        }
        cartProductList.push(productItemAddToCart)

        let cart = JSON.parse(localStorage.getItem('cart'))
        if (cart === null) {
            cart = {
                order: {
                    freight: '',
                    payment: 'credit_card',
                    shipping: 'delivery',
                    subtotal: '',
                    total: '',
                    recipient: {
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                        time: ''
                    },
                    list: cartProductList
                }
            }
        } else {
            cart.order.list = cartProductList
        }


        // Add cart product list arr to localStorage
        localStorage.setItem('cart', JSON.stringify(cart))
        alert('成功加入購物車！')

        cartQuantity.textContent = cartProductList.length // cart qty number change  
    } else if (isAddtoCart === false && userBuyCount === 0) {
        alert('商品數量須大於 0 哦')
    }
}

productDetailAjax(
    `${apiRootURL}/products/details${productUrlParameter}`,
    function (response) { productDetailRender(response) }
)



////////// Product Search Feature //////////

// Search enter event
searchInput.addEventListener('keyup', event => {
    if (searchInput.value !== "") {
        if (event.keyCode === 13) {
            startSearch()
        }
    } else {
        searchInput.setAttribute('placeholder', '請輸入搜尋內容')
    }
})

// Search click event
searchIcon.addEventListener('click', () => {
    if (document.body.offsetWidth < 992 && searchIconFirstClick === false) {
        logoImage.classList.add('logo--hide')
        searchBar.classList.add('search-bar--active')
        searchInput.classList.add('search-bar__input--active')
        searchBarClose.classList.add('search-bar__close--active')
        searchIconFirstClick = true
    } else {
        if (searchInput.value !== "") {
            searchIconFirstClick = false
        } else {
            // if user no input don't get API and show remind words 
            searchInput.setAttribute('placeholder', '請輸入搜尋內容')
        }
    }
})

function startSearch() {
    let searchKeyWord = searchInput.value
    window.location.href = `./?catalog=${searchKeyWord}`
}

// Search Close Btn event
searchBarClose.addEventListener('click', () => {
    if (searchInput.value === '') {
        logoImage.classList.remove('logo--hide')
        searchBar.classList.remove('search-bar--active')
        searchInput.classList.remove('search-bar__input--active')
        searchBarClose.classList.remove('search-bar__close--active')
        searchIcon.classList.remove('search-bar__icon--inactive') //web
        searchIconFirstClick = false
    } else {
        searchInput.value = ''
        searchIcon.classList.remove('search-bar__icon--inactive') //web
        searchIconFirstClick = false
    }
})











/**************** Note ****************

A. User buy count and Stock logic
    1. Set userByCount and currentStock variable
    2. Find product current color and size (product id aleady be fixed when in product detail page)
    3. Use current color and size to find product stock
    4. Set userByCount and currentStock final value (need to set stock > 0 and = 0) ; Show userByCount to user
    5. Set operating event
    6. Set change color and size event

B. Add shopping cart btn click logic (Store at locolStorage)
    1. Set cartProductList array and add localStorage product list to it
    2. Use cartProductList,length to render the qty of list in cart at cart icon
    3. When user click add cart btn then Make sure product item is not in cart
    4. Make new product item object with id, title, color code, color name...(like checkout API cart list format)
        "list": [
            {
                "id": [Product ID],
                "name": [Product Name],
                "price": [Product Unit Price],
                "color": {
                "name": [Product Variant Color Name],
                "code": [Product Variant Color HexCode]
                },
                "size": [Product Variant Size],
                "qty": [Quantity]
            }
        ]
    5. Push new product item in to cartProductList and localstorage
    6. When user enter any page, run stap 1 & 2
***************************************/