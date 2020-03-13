
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



////////// Thank page render //////////
function thankRender() {
    const cartQuantity = document.querySelector('.cart__qty')
    const orderNumberDom = document.querySelector('.order-number')
    const cartData = JSON.parse(localStorage.getItem('cart'))
    cartQuantity.textContent = 0

    if (cartData !== null) {
        const orderNumber = cartData.order_number
        orderNumberDom.textContent = orderNumber
        lotteryRender(cartData)
    }
}
thankRender()

function lotteryRender(cartData) {
    const lotteryTimesDom = document.querySelector('.lottery_times')
    const lotteryPointerDom = document.querySelector('.pointer')
    const totalPrice = cartData.order.total
    let lotteryTimes

    if (typeof (totalPrice) === 'undefined' || totalPrice === 0) {
        lotteryTimes = 0
    } else {
        if (totalPrice > 5000) {
            lotteryTimes = 3
        } else if (totalPrice > 3000) {
            lotteryTimes = 2
        } else {
            lotteryTimes = 1
        }
        lotteryPointerDom.innerHTML = `
        <p>點擊<br>抽獎</p>
        `
        setUpLottery(cartData, lotteryTimes, lotteryTimesDom, lotteryPointerDom)
    }
    lotteryTimesDom.textContent = lotteryTimes
}

// Lottey campaign
function setUpLottery(cartData, lotteryTimes, lotteryTimesDom, lotteryPointerDom) {
    const lotteryImageDom = document.querySelector('.lottery_image')
    const lotteryTurntable = document.querySelector('.lottery_image img')
    lotteryTurntable.style.transform = 'rotate(-33deg)'

    const awardAlert = document.querySelector('#award-alert')
    const awardAlertBtn = document.querySelector('.award-alert__button')
    const awardItem = ['彭彭歌', '看星座', '毛圍巾', '遮陽帽', '隨身包', '牛仔帽']
    const awardContenArea = document.querySelector('.award-alert__content')
    const awardAlertTitle = document.querySelector('.award-alert__title')
    const awardAlertDescriptionFisrt = document.querySelector('.award-alert__content p:nth-child(2)')
    const awardAlertDescriptionLast = document.querySelector('.award-alert__content p:nth-child(3)')

    let isRun = false
    const setCircleTimes = 4 // set every lottery run will turn 4 times in setInterval 
    let runCircleTimes = 0 // aleady run circle turn times
    let randomNum

    lotteryImageDom.addEventListener('click', () => {
        if (lotteryTimes > 0 && isRun === false) {
            randomNum = Math.floor(Math.random() * 6) + 1
            isRun = true
            lotteryRun(lotteryTurntable, runCircleTimes, setCircleTimes, randomNum)

            setTimeout(() => {
                runCircleTimes += setCircleTimes
                lotteryTimes--
                lotteryTimesDom.textContent = lotteryTimes
                isRun = false

                // Last turn
                if (lotteryTimes === 0) {
                    lotteryPointerDom.innerHTML = `
                    <p><a href="./">再買<br>再抽</a></p>
                    `
                    awardAlertBtn.textContent = '我知道囉'
                    cartData.order.total = 0
                    localStorage.setItem('cart', JSON.stringify(cartData))
                }

                // Award alert
                awardAlertTitle.innerHTML = `
                恭喜你抽中<span style=color:red> ${awardItem[randomNum - 1]} </span>
                `
                if (randomNum === 1) {
                    awardAlertDescriptionFisrt.textContent = '買衣服後就該聽首彭彭歌'
                    awardContenArea.style.width = '450px'
                    awardContenArea.style.height = '420px'

                    awardAlertDescriptionLast.innerHTML = '<iframe width="360" height="200" src="https://www.youtube.com/embed/R2V9sHAlLuQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                } else if (randomNum === 2) {
                    awardAlertDescriptionFisrt.textContent = '買衣服看星座知穿搭配色'
                    awardContenArea.style.width = '300px'
                    awardContenArea.style.height = '210px'
                    awardAlertDescriptionLast.innerHTML = '<a href="https://horoscope.dice4rich.com/" target=_blank><span style=color:blue>點擊</span>看幸運穿搭色</a>'

                } else {
                    awardAlertDescriptionFisrt.textContent = '兌換卷及兌換方式'
                    awardContenArea.style.width = '300px'
                    awardContenArea.style.height = '210px'
                    awardAlertDescriptionLast.innerHTML = '將在 10 分鐘內寄至您的會員信箱'
                }

                awardAlert.classList.add('award-alert--active')
                awardAlertBtn.addEventListener('click', () => {
                    awardAlert.classList.remove('award-alert--active')
                })
            }, 3200)
        }
    })
}

function lotteryRun(lotteryTurntable, runCircleTimes, setCircleTimes, randomNum) {
    let rotateTimer
    let rotateCurrentDeg = -33 + runCircleTimes * 360 // total accumulated angles
    const interval = 500

    // First run
    lotteryTurntable.style.transition = 'transform 1s ease-in 0s'
    rotateCurrentDeg += 360
    lotteryTurntable.style.transform = `rotate(${rotateCurrentDeg}deg)`

    // Intermediate run
    setTimeout(() => {
        clearInterval(rotateTimer)
        rotateTimer = setInterval(() => {
            rotateCurrentDeg += 360
            lotteryTurntable.style.transition = 'transform 0.5s linear 0s'
            lotteryTurntable.style.transform = `rotate(${rotateCurrentDeg}deg)`
        }, interval)
    }, 500)

    // Last run
    setTimeout(() => {
        clearInterval(rotateTimer)
        lotteryTurntable.style.transition = 'transform 1.2s ease-out 0s'
        lotteryTurntable.style.transform = `rotate(${rotateCurrentDeg + (60 * randomNum)}deg)`
    }, interval * setCircleTimes)
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