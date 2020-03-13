
////////// All Use Variable //////////
const apiHost = 'https://api.appworks-school.tw'
const apiVersion = '1.0'
const apiRootURL = `${apiHost}/api/${apiVersion}`
const userPathProductDetail = './product.html'
let indexUrlParameter = location.search

const bannerBgArea = document.querySelector('.banner__bg')
const productArea = document.querySelector('#product .wrap')

// For logo and Menu Click Event
const logoBtn = document.querySelector('#header .logo')
const logoImage = document.querySelector('.logo')
const womenBtn = document.querySelectorAll('.menu__women')
const menBtn = document.querySelectorAll('.menu__men')
const accessoriesBtn = document.querySelectorAll('.menu__accessories')
let productApiCatalog = 'all'

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


////////// Banner Area //////////
function bannerAjax(src, callback) {
    fetch(src).then(res => {
        return res.json()
    }).then(json => {
        callback(json)
    })
}

function bannerRender(json) {
    const bannerData = json.data
    const bannerDotArea = document.querySelector('.banner__dot')
    const bannerDotUl = document.createElement('ul')
    bannerDotArea.appendChild(bannerDotUl)

    // Add all banner item 
    bannerData.forEach(function (banner) {
        const bannerBgDiv = document.createElement('div')
        bannerBgArea.appendChild(bannerBgDiv)
        bannerBgDiv.classList.add('banner__bg__item', `banner__bg__item${banner.id}`)

        document.querySelector(`.banner__bg__item${banner.id}`).innerHTML = `
        <a href="./product.html?id=${banner.product_id}">
            <div class="banner__bg__img"></div>       
            <div class="banner__bg__words">
                <p class="banner__bg__words__big"></p>
                <p class="banner__bg__words__small"></p>
            </div>
        </a>
        `
        // Banner word
        const periodPositon = banner.story.indexOf('。')
        const wordsLength = banner.story.length
        const bannerWordsBig = document.querySelector(`.banner__bg__item${banner.id} .banner__bg__words__big`)
        const bannerWordsSmall = document.querySelector(`.banner__bg__item${banner.id} .banner__bg__words__small`)
        bannerWordsBig.innerText = banner.story.slice(0, periodPositon + 1)
        bannerWordsSmall.innerText = banner.story.slice(periodPositon + 2, wordsLength)

        // Banner image
        const bannerImg = document.querySelector(`.banner__bg__item${banner.id} .banner__bg__img`)
        bannerImg.style.backgroundImage = `url(${apiHost}/${banner.picture})`

        // Banner dot 
        const bannerDotLi = document.createElement('li')
        bannerDotUl.appendChild(bannerDotLi)
    })

    bannerSlideEffect(bannerData)
}


function bannerSlideEffect(bannerData) {
    // Insert firstbanner after lastbanner ; lastbanner before firstbanner
    let firstBanner = document.querySelector('.banner__bg .banner__bg__item:nth-child(1)')
    let lastBanner = document.querySelector(`.banner__bg__item:nth-child(${bannerData.length})`)
    bannerBgArea.appendChild(firstBanner.cloneNode(true))
    bannerBgArea.insertBefore(lastBanner.cloneNode(true), firstBanner)
    const bannerBgItemArr = document.querySelectorAll('.banner__bg__item')

    // Make bannerBgArea move to left to show .banner__bg__item1 
    let bannerWidth = document.body.offsetWidth
    bannerBgArea.style.left = `-${bannerWidth}px`
    // When viewpoint changing : stop silde -> reset moving distance -> start to slide
    window.onresize = function () {
        bannerWidth = document.body.offsetWidth
        bannerBgArea.style.left = `-${bannerWidth}px`
    }

    // Auto banner slide effect
    let index = 1
    let interval = 3500
    let timeId
    function autoBannerSilde() {
        clearInterval(timeId) // clear to avoid to much timeId setInterval
        timeId = setInterval(function () {
            index++
            for (let i = 0; i < bannerBgItemArr.length; i++) {
                bannerBgItemArr[i].classList.remove('banner__bg__img--visible')
            }
            bannerBgArea.style.transition = 'left 0.45s ease-in-out'
            bannerBgArea.style.left = `-${index * bannerWidth}px`
            bannerBgItemArr[index].classList.add('banner__bg__img--visible')

            // If lastbanner then back to firstbanner
            // Use setTimeout to create time different to make banner slide to firstBanner.cloneNode(true) before jump to firstBanner
            setTimeout(function () {
                if (index === bannerData.length + 1) {
                    index = 1
                    bannerBgArea.style.transition = '' // Jump directly to firstBanner without slipping  
                    bannerBgArea.style.left = `-${index * bannerWidth}px`
                }
                bannerDotColorChange(index) // Change banner dot color
            }, 400) // setTimeout duration = transition duration

        }, interval)
    }
    autoBannerSilde()

    // Banner dot color 
    const allDot = document.querySelectorAll('.banner__dot ul li')
    allDot[0].classList.add('banner__dot--active')

    function bannerDotColorChange(index) {
        for (i = 0; i < allDot.length; i++) {
            allDot[i].classList.remove('banner__dot--active')
        }
        allDot[index - 1].classList.add('banner__dot--active')
    }

    // Banner dot click event
    for (let i = 0; i < allDot.length; i++) {
        allDot[i].addEventListener('click', () => {
            for (let n = 0; n < allDot.length; n++) { // clear dot active color
                allDot[n].classList.remove('banner__dot--active')
            }
            for (let m = 0; m < bannerBgItemArr.length; m++) { // clear img active fadein
                bannerBgItemArr[m].classList.remove('banner__bg__img--visible')
            }
            allDot[i].classList.add('banner__dot--active')

            index = i + 1
            bannerBgArea.style.transition = ''
            bannerBgArea.style.left = `-${index * bannerWidth}px`
            bannerBgItemArr[index].classList.add('banner__bg__img--visible')
            autoBannerSilde()
        })
    }

    // Mouse over will stop sliding for more 3s
    bannerBgArea.onmouseover = () => {
        clearInterval(timeId)
        setTimeout(() =>
            autoBannerSilde()
            , 3000)
    }
}

bannerAjax(
    `${apiRootURL}/marketing/campaigns`,
    function (response) { bannerRender(response) }
)



////////// Product Area //////////
function productAjax(src, callback) {
    fetch(src).then(res => {
        return res.json()
    }).then(json => {
        callback(json)
    })
}

function productRender(json) {
    console.log(json)
    const productItemData = json.data
    let productItemPage = json.next_paging
    if (productItemData.length === 0) {
        productArea.innerText = `很抱歉，您搜尋產品目前沒有貨源，歡迎繼續參觀哦！`
        productArea.classList.add('product--searchfail')
    }

    productItemData.forEach(productItem => {
        // Add product items; Not use innerHTML cause product search user can input (avoild XSS)
        const productItemDiv = document.createElement('div')
        productArea.appendChild(productItemDiv)
        productItemDiv.classList.add('product-item')
        productItemDiv.setAttribute('id', `ID_${productItem.id}`)
        const productItemArea = document.querySelector(`#ID_${productItem.id}`)

        const productionItemA = document.createElement('a')
        productionItemA.setAttribute('href', `${userPathProductDetail}?id=${productItem.id}`)
        productItemArea.appendChild(productionItemA)
        const productItemLinkArea = document.querySelector(`#ID_${productItem.id} a`)

        const productItemImageDiv = document.createElement('div')
        const productItemImageDivImg = document.createElement('img')
        productItemImageDiv.classList.add('product-item__img')
        productItemImageDivImg.setAttribute('src', `${productItem.main_image}`)
        productItemImageDivImg.setAttribute('alt', `${productItem.title}`)


        const productItemColorDiv = document.createElement('div')
        const productItemColorDivUl = document.createElement('ul')
        productItemColorDiv.classList.add('product-item__color')

        const productItemTitleDiv = document.createElement('div')
        const productItemTitleDivP = document.createElement('p')
        productItemTitleDiv.classList.add('product-item__title')
        productItemTitleDivP.innerText = `${productItem.title}`

        const productItemPriceDiv = document.createElement('div')
        const productItemPriceDivP = document.createElement('p')
        productItemPriceDiv.classList.add('product-item__price')
        productItemPriceDivP.innerText = `TWD.${productItem.price}`

        productItemLinkArea.append(productItemImageDiv, productItemColorDiv, productItemTitleDiv, productItemPriceDiv)
        productItemImageDiv.appendChild(productItemImageDivImg)
        productItemColorDiv.appendChild(productItemColorDivUl)
        productItemTitleDiv.appendChild(productItemTitleDivP)
        productItemPriceDiv.appendChild(productItemPriceDivP)

        // Add product color 
        for (let i = 0; i < productItem.colors.length; i++) {
            const productColorUl = document.querySelector(`#ID_${productItem.id} ul`)
            const productColorLi = document.createElement('li')
            productColorUl.appendChild(productColorLi)
            productColorLi.classList.add(`color_${i}`)
            const productColor = productItem.colors[i].code
            document.querySelector(`#ID_${productItem.id}  .color_${i}`).style.backgroundColor = '#' + productColor
        }
    })

    // Set Like Btn
    setUpLikeBtn()

    // Add cart product list from localStorage and show qty of header cart UI
    const cartProductList = []
    const cartQuantity = document.querySelector('.cart__qty')
    addLocalStorageToCartProduct(cartProductList, cartQuantity)

    productScroll(productItemPage)
}

function setUpLikeBtn() {

}

function addLocalStorageToCartProduct(cartProductList, cartQuantity) {
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

// Use URL to judge which API should call 
function changeCatalogPage() {
    const firstCatalogWordPosition = indexUrlParameter.indexOf('=') + 1
    const indexUrlParameterLength = indexUrlParameter.length
    const catalogWord = indexUrlParameter.slice(firstCatalogWordPosition, indexUrlParameterLength)
    if (indexUrlParameterLength === 0) {
        productAjax(
            `${apiRootURL}/products/all`,
            function (response) { productRender(response) }
        )
    } else if (catalogWord === 'women' || catalogWord === 'men' || catalogWord === 'accessories') {
        productApiCatalog = `${catalogWord}`
        productAjax(
            `${apiRootURL}/products/${catalogWord}`,
            function (response) { productRender(response) }
        )
    } else {
        productApiCatalog = 'search'
        productAjax(
            `${apiRootURL}/products/search?keyword=${catalogWord}`,
            function (response) { productRender(response) }
        )
    }
}
changeCatalogPage()

// Product Infinite scroll pagination
function productScroll(productItemPage) {
    if (typeof (productItemPage) !== 'undefined') {
        let isScrollLoad = false
        const trigerHeight = 200
        document.addEventListener('scroll', () => {
            const productBottomToTopHeight = document.querySelector('#product').getBoundingClientRect().bottom
            if ((productBottomToTopHeight - window.innerHeight) < trigerHeight && isScrollLoad === false) {
                // triger if height of prodct area from widow bottom is 200px and never load
                productAjax(
                    `${apiRootURL}/products/${productApiCatalog}?paging=${productItemPage}`,
                    function (response) { productRender(response) }
                )
                isScrollLoad = true
            }
        })
    }
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
    window.location.href = `./?catalog=${searchKeyWord}`
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





















/**********  Note ***********

********************************************/
