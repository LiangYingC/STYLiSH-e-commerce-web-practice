
////////// All Use Variable //////////
const apiHost = 'https://api.appworks-school.tw'
const apiVersion = '1.0'
const apiRootURL = `${apiHost}/api/${apiVersion}`
const userPathProductDetail = './product.html'
let indexUrlParameter = location.search

// For product search feature
const searchBar = document.querySelector('.search-bar')
const searchIcon = document.querySelector('.search-bar__icon')
const searchInput = document.querySelector('.search-bar__input')
const searchBarClose = document.querySelector('.search-bar__close')
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
        setUserPicture(response)
        profileRender(response)
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


////////// Profile Render //////////
function profileRender(response) {
    const profileImage = document.querySelector('.user-info__img img')
    const profileName = document.querySelector('.user-info__name p')
    const profileEmail = document.querySelector('.user-info__email p')

    const profileData = {
        id: response.id,
        name: response.name,
        email: response.email,
        picture: response.picture.data.url
    }

    profileImage.setAttribute('src', `${profileData.picture}`)
    profileName.textContent = `${profileData.name}`
    profileEmail.textContent = `${profileData.email}`

    const pastOrderArea = document.querySelector('.order-wrap')
    const pastOrderData = JSON.parse(localStorage.getItem('pastOrder'))
    console.log(pastOrderData)
    if (pastOrderData !== null) {
        pastOrderArea.classList.remove('order-wrap--active')
        pastOrderRender(pastOrderData, pastOrderArea)
    } else {
        pastOrderArea.innerHTML = '目前尚無訂單，趕緊買衣去～'
        pastOrderArea.classList.add('order-wrap--active')
    }
}

function pastOrderRender(pastOrderData, pastOrderArea) {
    pastOrderData.forEach(pastOrder => {
        const pastOrderDiv = document.createElement('div')
        const pastOrderNumDiv = document.createElement('div')
        const pastOrderTimeDiv = document.createElement('div')
        const pastOrderPriceDiv = document.createElement('div')
        const pastOrderBtnDiv = document.createElement('div')

        pastOrderDiv.classList.add('past-order', `ID_${pastOrder.order_number}`)
        pastOrderNumDiv.classList.add('past-order__number')
        pastOrderTimeDiv.classList.add('past-order__time')
        pastOrderPriceDiv.classList.add('past-order__price')
        pastOrderBtnDiv.classList.add('past-order__btn')

        pastOrderNumDiv.textContent = pastOrder.order_number
        pastOrderTimeDiv.textContent = pastOrder.order_time
        pastOrderPriceDiv.textContent = `NT.${pastOrder.order_total}`
        pastOrderBtnDiv.textContent = '查看更多'

        pastOrderArea.appendChild(pastOrderDiv)
        pastOrderDiv.append(pastOrderNumDiv, pastOrderTimeDiv, pastOrderPriceDiv, pastOrderBtnDiv)
    })
}

function addLocalStorageToCartProduct() {
    const cartProductList = []
    const cartQuantity = document.querySelector('.cart__qty')
    const localStorageCart = JSON.parse(localStorage.getItem('cart'))
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
addLocalStorageToCartProduct()



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