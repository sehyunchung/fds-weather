const OWM_API_KEY = '282fbd093c4164283cf5b10e1b03a041';

const provider = new firebase.auth.GoogleAuthProvider();
const loginButton = document.querySelector('.login-button')
const weatherButton = document.querySelector('.weather-button')
const tempEl = document.querySelector('.temp')


// 날씨 버튼 클릭
weatherGet();
// login
loginButton.addEventListener('click', async e => {
    const result = await firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken; // 토큰 값을 가지고 온다.
      // console.log(token)
      var user = result.user; // 구글 계정 정보.
      // console.log(user)
    })
    loginButton.classList.add('hidden')
    weatherButton.classList.remove('hidden')
      // 날씨 버튼 클릭
    weatherButton.addEventListener('click', e => {

    })



    // 초기 위치 추가.
    async function weatherAdd() {
      const uid = firebase.auth().currentUser.uid;
      await firebase.database().ref(`/users/${uid}/weather`).push({
        lat: a,
        lon: b,
      })
    }
    // 위치 update
    async function weatherUpdate() {
      const uid = firebase.auth().currentUser.uid;
      await firebase.database().ref(`/users/${uid}/weather`).updata({
        lat: a,
        lon: b,
      })
    }
    // 그리기
    async function refresh() {
      const uid = firebase.auth().currentUser.uid;

    }


  })
  // 날씨 Get
async function weatherGet() {
  weatherButton.addEventListener('click', async e => {
    navigator.geolocation.getCurrentPosition(async function(position) {
      let lat = Math.round(position.coords.latitude * 100) / 100
      let lon = Math.round(position.coords.longitude * 100) / 100

      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${OWM_API_KEY}`) // 기본값이 get
      const userWeather = await res.json()
      console.log(userWeather)
      const userWeatherEl = document.createElement('div')
      userWeatherEl.textContent = Math.round(userWeather.main.temp)
      tempEl.appendChild(userWeatherEl)
    });
  })
}