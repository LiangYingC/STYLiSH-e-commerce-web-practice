
////////// All Use Variable //////////
const apiHost = 'https://api.appworks-school.tw'
const apiVersion = '1.0'
const apiRootURL = `${apiHost}/api/${apiVersion}`

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

    if (response.status === 'connected') {  // Logged into your webpage and Facebook.
        const accessToken = response.authResponse.accessToken
        localStorage.setItem('FB_accessToken', JSON.stringify(accessToken))
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



////////// Cart Area //////////
function cartRender() {
    const cartListArea = document.querySelector('.cart-list')
    const cartData = JSON.parse(localStorage.getItem('cart'))
    const cartMainTitle = document.querySelector('.main-title')
    const cartQuantity = document.querySelector('.cart__qty')
    if (cartData !== null) {
        cartListRender(cartData, cartListArea, cartMainTitle, cartQuantity)
        recipientRender(cartData)
    } else {
        cartListArea.innerText = '目前購物車是空的，\n把握時間搶購優惠品！'
        cartListArea.classList.add('cart-list--empty')
        cartQuantity.textContent = '0'
        cartMainTitle.textContent = '購物車（0）'
    }
    setConfirmBuyBtn(cartData)
}
cartRender()

// Cart list render
function cartListRender(cartData, cartListArea, cartMainTitle, cartQuantity) {
    cartMainTitle = document.querySelector('.main-title')
    cartQuantity = document.querySelector('.cart__qty')
    cartData = JSON.parse(localStorage.getItem('cart'))
    cartListArea.innerHTML = ''
    if (cartData === null || cartData.order.list.length === 0) {
        cartListArea.innerText = '目前購物車是空的，\n把握時間搶購優惠品！'
        cartListArea.classList.add('cart-list--empty')
        cartQuantity.textContent = '0'
        cartMainTitle.textContent = '購物車（0）'
    } else {
        cartListData = cartData.order.list
        cartListArea.classList.remove('cart-list--empty')
        cartQuantity.textContent = cartListData.length
        cartMainTitle.textContent = `購物車（${cartListData.length}）`

        for (let i = 0; i < cartListData.length; i++) {
            const productItemDiv = document.createElement('div')
            const productItemTopLeftDiv = document.createElement('div')
            const productItemDownRightDiv = document.createElement('div')
            const productItemImageDiv = document.createElement('div')
            const productItemDetailDiv = document.createElement('div')
            const productItemQtyDiv = document.createElement('div')
            const productItemPriceDiv = document.createElement('div')
            const productItemSubtotalDiv = document.createElement('div')
            const productItemRemoveDiv = document.createElement('div')
            const productItemImageDivImg = document.createElement('img')
            const productItemRemoveDivImg = document.createElement('img')

            productItemDiv.classList.add('product-item')
            productItemTopLeftDiv.classList.add('product-item__top-left')
            productItemDownRightDiv.classList.add('product-item__down-right')
            productItemImageDiv.classList.add('product-item__image')
            productItemDetailDiv.classList.add('product-item__detail')
            productItemQtyDiv.classList.add('product-item__qyt')
            productItemPriceDiv.classList.add('product-item__price')
            productItemSubtotalDiv.classList.add('product-item__subtotal')
            productItemRemoveDiv.classList.add('product-item__remove')

            cartListArea.appendChild(productItemDiv)
            productItemDiv.append(productItemTopLeftDiv, productItemDownRightDiv)
            productItemTopLeftDiv.append(productItemImageDiv, productItemDetailDiv)
            productItemDownRightDiv.append(productItemQtyDiv, productItemPriceDiv, productItemSubtotalDiv, productItemRemoveDiv)
            productItemImageDiv.append(productItemImageDivImg)
            productItemRemoveDiv.append(productItemRemoveDivImg)

            // Product main and remove img
            productItemImageDivImg.setAttribute('src', `${cartListData[i].main_image}`)
            productItemImageDivImg.setAttribute('alt', `${cartListData[i].name}`)
            productItemRemoveDivImg.setAttribute('src', `./images/cart-remove.png`)
            productItemRemoveDivImg.setAttribute('alt', `${cartListData[i].name} remove`)

            // Product detail
            productItemDetailDiv.innerHTML = `
                <div class="product-item__title">${cartListData[i].name}</div>
                <div class="product-item__id">${cartListData[i].id}</div>
                <div class="product-item__color">顏色｜${cartListData[i].color.name}</div>
                <div class="product-item__size">尺寸｜${cartListData[i].size}</div>
            `

            // Product quantity
            productItemQtyDiv.innerHTML = `
                <div class="row-title__qty--mobile">數量</div>
                <select name="product-item__qyt" class="product-item__qyt-select"></select>
            `
            const productItemQtySelectArea = document.querySelector(`.product-item:nth-child(${i + 1}) .product-item__qyt-select`)
            for (let n = 0; n < cartListData[i].total_stock; n++) {
                const option = document.createElement('option')
                option.setAttribute('value', `${n + 1}`)
                option.textContent = n + 1
                if (Number(option.textContent) === cartListData[i].qty) {
                    option.setAttribute('selected', 'selected')
                }
                productItemQtySelectArea.appendChild(option)
            }

            // Product price
            productItemPriceDiv.innerHTML = `
                <div class="row-title__price--mobile">單價</div>
                <p></p>
            `
            const productSinglePrice = document.querySelector(`.product-item:nth-child(${i + 1}) .product-item__price p`)
            productSinglePrice.textContent = `NT.${cartListData[i].price}`

            // Product subtotal
            productItemSubtotalDiv.innerHTML = `
                <div class="row-title__subtotal--mobile">小計</div>
                <p></p>
            `
            const productSubtotalPrice = document.querySelector(`.product-item:nth-child(${i + 1}) .product-item__subtotal p`)
            productSubtotalPrice.textContent = `NT.${cartListData[i].price * cartListData[i].qty}`
        }
        // User delete cart parduct item set up
        setDelete(cartData, cartListData, cartListArea)
        // User select new option set up
        setSelectQtyOption(cartData, cartListData)
        // Calculate total price
        calculateTotalPrice(cartData, cartListData)
    }
}

// Recipient Render
function recipientRender(cartData) {
    const userName = document.querySelector('.order-info-item #name')
    const userCellphone = document.querySelector('.order-info-item #cellphone')
    const userEmail = document.querySelector('.order-info-item #email')
    const userAddress = document.querySelector('.order-info-item #address')
    const deliverTimeRadioArr = document.getElementsByName('deliver-time')
    let cartRecipientData = {}

    if (typeof (cartData.order.recipient) !== 'undefined') {
        cartRecipientData = cartData.order.recipient
        userName.value = cartRecipientData.name
        userCellphone.value = cartRecipientData.phone
        userEmail.value = cartRecipientData.email
        userAddress.value = cartRecipientData.address
        for (let i = 0; i < deliverTimeRadioArr.length; i++) {
            if (cartRecipientData.time === deliverTimeRadioArr[i].value) {
                deliverTimeRadioArr[i].setAttribute('checked', 'checked')
            }
        }
    }

    // Set up confirm buy btn
    setConfirmBuyBtn(cartData, cartRecipientData, userName, userCellphone, userEmail, userAddress, deliverTimeRadioArr)
}

// Cart list delete feature function
function setDelete(cartData, cartListData, cartListArea) {
    const productItemRemoveAllBtn = document.querySelectorAll('.product-item__remove')
    for (let i = 0; i < cartListData.length; i++) {
        productItemRemoveAllBtn[i].addEventListener('click', () => {
            // delete cart item, then reset all data, then render cart list again
            if (confirm(`確認要取消溝買「 ${cartListData[i].name} 」嗎？`) === true) {
                cartListData.splice(i, 1)
                cartData.order.list = cartListData
                localStorage.setItem('cart', JSON.stringify(cartData))
                cartListRender(cartListData, cartListArea)
                calculateTotalPrice(cartData, cartListData)
            }
        })
    }
}

// Cart list select qty option function
function setSelectQtyOption(cartData, cartListData) {
    const productItemQtyAllSelect = document.querySelectorAll('.product-item__qyt-select')
    const productItemSubtotalAll = document.querySelectorAll('.product-item__subtotal p')
    let currentOptionIndex
    for (let i = 0; i < productItemQtyAllSelect.length; i++) {
        productItemQtyAllSelect[i].addEventListener('change', () => {
            currentOptionIndex = productItemQtyAllSelect[i].selectedIndex // find which index is user chose now
            cartListData[i].qty = currentOptionIndex + 1
            productItemSubtotalAll[i].textContent = `NT.${cartListData[i].price * cartListData[i].qty}`
            cartData.order.list = cartListData
            localStorage.setItem('cart', JSON.stringify(cartData))
            calculateTotalPrice(cartData, cartListData)
        })
    }
}

// Cart list total price function
function calculateTotalPrice(cartData, cartListData) {
    const totalProductPriceRender = document.querySelector('.total-price__product-price span')
    const freightPriceRender = document.querySelector('.total-price__freight span')
    const totalPriceRender = document.querySelector('.total-price__result-price span')
    let totalProductPrice = 0
    let freightPrice = 60
    if (cartListData !== null) {
        cartListData.forEach(cartProductItem => {
            totalProductPrice += cartProductItem.qty * cartProductItem.price
        })
    }
    totalProductPriceRender.textContent = totalProductPrice
    freightPriceRender.textContent = freightPrice
    totalPriceRender.textContent = totalProductPrice + freightPrice
    cartData.order.freight = freightPrice
    cartData.order.subtotal = totalProductPrice
    cartData.order.total = totalProductPrice + freightPrice
    localStorage.setItem('cart', JSON.stringify(cartData))
}

function setConfirmBuyBtn(cartData, cartRecipientData, userName, userCellphone, userEmail, userAddress, deliverTimeRadioArr) {
    let isConfirmBuyBtnClick = false
    const confirmBuyBtn = document.querySelector('.btn-confirm-to-pay')
    const allEmptyRemider = document.querySelectorAll(`.cart__order-info .order-info-item .empty-remider`)

    confirmBuyBtn.addEventListener('click', () => {
        cartData = JSON.parse(localStorage.getItem('cart')) // Because delect will renew localStorage data, so need to renew data
        if (cartData === null) {
            alert('購物車是空的喔，趕緊逛逛商場')
            isConfirmBuyBtnClick = false
        } else {
            if (isConfirmBuyBtnClick === false) {
                isConfirmBuyBtnClick = true
                // 1. User first time to filled recipient
                // 2. User maybe change data, so update data (make data = view)
                cartRecipientData.name = userName.value
                cartRecipientData.phone = userCellphone.value
                cartRecipientData.email = userEmail.value
                cartRecipientData.address = userAddress.value
                cartData.order.recipient = cartRecipientData
                localStorage.setItem('cart', JSON.stringify(cartData))

                for (let i = 0; i < deliverTimeRadioArr.length; i++) {
                    if (deliverTimeRadioArr[i].checked === true) {
                        cartRecipientData.time = deliverTimeRadioArr[i].value
                        cartData.order.recipient = cartRecipientData
                        localStorage.setItem('cart', JSON.stringify(cartData))
                    }
                }

                setTimeout(() => {
                    // Reset reminder word
                    for (let i = 0; i < allEmptyRemider.length; i++) {
                        allEmptyRemider[i].classList.remove('reminder--active')
                    }
                    // Confirm order info 
                    if (typeof (cartData.order.list.length) === 'undefined' || cartData.order.list.length === 0) { // cart is null or cart list undefinded or cart list is empty
                        alert('購物車是空的喔，趕緊逛逛商場')
                        isConfirmBuyBtnClick = false
                    } else if (typeof (cartRecipientData) === undefined) {  // cart recipent undefinded
                        alert('收件人資料尚未填寫')
                        for (let i = 0; i < allEmptyRemider.length; i++) {
                            allEmptyRemider[i].classList.add('reminder--active')
                        }
                        isConfirmBuyBtnClick = false
                    } else {
                        const userOderInfo = [cartRecipientData.name, cartRecipientData.phone, cartRecipientData.email, cartRecipientData.address, cartRecipientData.time]
                        let isOderInfoCompleted = true
                        userOderInfo.forEach(userOderItem => {
                            if (typeof (userOderItem) === 'undefined' || userOderItem === '') {
                                isOderInfoCompleted = false
                            }
                        })
                        if (isOderInfoCompleted === false) {
                            alert('收件人資料尚未填寫齊全')
                            for (let i = 0; i < userOderInfo.length; i++) {
                                if (userOderInfo[i] === '' || typeof (userOderInfo[i]) === 'undefined') {
                                    document.querySelector(`.cart__order-info .order-info-item:nth-child(${i + 2}) .empty-remider`).classList.add('reminder--active')
                                }
                            }
                            isOderInfoCompleted = true
                            isConfirmBuyBtnClick = false
                        } else {
                            getPrime(cartData, isConfirmBuyBtnClick)
                            isConfirmBuyBtnClick = false
                        }
                    }
                }, 1)
            }
        }

    })
}



////////// TapPay //////////

function setUpTapPay() {
    // TapPay render
    let tapPayfields = {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    }

    // TapPay set style
    TPDirect.card.setup({
        fields: tapPayfields,
        styles: {
            // Style all elements
            'input': {
                'color': '#666',
                'font-size': '16px'
            },
            // Styling ccv field
            'input.cvc': {
                //'font-size': '16px'
            },
            // Styling expiration-date field
            'input.expiration-date': {
                //'font-size': '16px'
            },
            // Styling card-number field
            'input.card-number': {
                //'font-size': '16px'
            },
            // style focus state
            ':focus': {
                'color': '#333'
            },
            // style valid state
            '.valid': {
                //'color': 'green'
            },
            // style invalid state
            '.invalid': {
                //'color': '#e00000'
            }
        }
    })

    // Listen for TapPay Field
    // update.status.number === 0 欄位已填好，並且沒有問題
    // update.status.number === 1 欄位還沒有填寫
    // update.status.number === 2 欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor
    // update.status.number === 3 使用者正在輸入中
    TPDirect.card.onUpdate(function (update) {
        if (update.status.number === 2 || update.status.expiry === 2 || update.status.cvc === 2) {
            // If card info not complete, will show empty remider words
            document.querySelector('#tappay-container .empty-remider').classList.add('reminder--active')
        } else {
            document.querySelector('#tappay-container .empty-remider').classList.remove('reminder--active')
        }
    })
}
setUpTapPay()

// Call TPDirect.card.getPrime 
function getPrime(cartData) {
    // Get TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // Get prime fail 
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊填寫有誤或空白')
        return
    }

    // Get prime 

    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('付款過程發生錯誤，請再試一次或聯絡客服哦')
            return
        } else {
            // Adjust cart data format for checkout API 
            let prime = result.card.prime
            cartData.prime = prime
            cartData.order.list.forEach(cartItem => {
                delete cartItem.main_image
                delete cartItem.total_stock
            })

            const cssLoader = document.querySelector('#css-loader')
            cssLoader.classList.add('css-loader--active')

            const FB_accessToken = JSON.parse(localStorage.getItem('FB_accessToken'))
            // Send cart data to checkout API
            fetch('https://api.appworks-school.tw/api/1.0/order/checkout', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${FB_accessToken}`
                },
                body: JSON.stringify(cartData)
            }).then(res => res.json())
                .then(json => {
                    const orderNumber = json.data.number

                    // Deal with profile page order data
                    const profileOrder = JSON.parse(localStorage.getItem('pastOrder'))
                    let today = new Date();
                    let currentDateTime = `${today.getFullYear()} - ${today.getMonth() + 1} - ${today.getDate()} (${today.getHours()}:${today.getMinutes()})`

                    if (profileOrder === null) {
                        let profileOrder = [
                            {
                                order_number: orderNumber,
                                order_time: currentDateTime,
                                order_total: cartData.order.total,
                            }
                        ]
                        localStorage.setItem('pastOrder', JSON.stringify(profileOrder))
                    } else {
                        let profileNewOrder = {
                            order_number: orderNumber,
                            order_time: currentDateTime,
                            order_total: cartData.order.total,
                        }
                        profileOrder.push(profileNewOrder)
                        localStorage.setItem('pastOrder', JSON.stringify(profileOrder))
                    }

                    // Deal with  cart data for thank page and lottery compaign
                    cartData.order_number = orderNumber
                    cartData.prime = ''
                    cartData.order.subtotal = ''
                    cartData.order.list = []
                    localStorage.setItem('cart', JSON.stringify(cartData))

                    window.location.href = `./thank.html`
                    cssLoader.classList.remove('css-loader--active')
                    return
                })
        }
    })
}


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
    window.location.href = `./? catalog = ${searchKeyWord}`
    changeCatalogPage()
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