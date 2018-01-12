const OWM_API_KEY = '282fbd093c4164283cf5b10e1b03a041';

const provider = new firebase.auth.GoogleAuthProvider();
const loginButton = document.querySelector('.login-button')
const logoutButton = document.querySelector('.logout-button')
const weatherButton = document.querySelector('.weather-button')
const tempEl = document.querySelector('.temp_now')
const tempMaxEl = document.querySelector('.temp_max')
const tempMinEl = document.querySelector('.temp_min')
const userTimeEl = document.querySelector('.user-time')

let temp
let temp_max
let temp_min
let user_time

printClock()
userTime();
refreshWeather()



// login
loginButton.addEventListener('click', async e => {
  const result = await firebase.auth().signInWithPopup(provider).then(function(result) {
      let token = result.credential.accessToken; // 토큰 값을 가지고 온다.
      // console.log(token)
      let user = result.user; // 구글 계정 정보.
      // console.log(user)
    })
    // loginButton.classList.add('hidden')
    // logoutButton.classList.remove('hidden')
  weatherAdd()

  // 날씨 버튼 시간
  weatherButton.addEventListener('mouseover', e => {
    weatherButton.textContent = user_time;
  })
  weatherButton.addEventListener('mouseout', e => {
    weatherButton.textContent = '날씨 갱신';
  })

  // 날씨 버튼 클릭
  weatherButton.addEventListener('click', e => {
    weatherAdd()
  })



  // 초기 위치 추가.
  async function weatherAdd() {
    loginButton.classList.add('hidden')
    logoutButton.classList.remove('hidden')
    const uid = firebase.auth().currentUser.uid;
    await firebase.database().ref(`/users/${uid}/weather`).set({
      temp: temp,
      temp_max: temp_max,
      temp_min: temp_min
    });
  }
  // 위치 update
  // async function weatherUpdate() {
  //   const uid = firebase.auth().currentUser.uid;
  //   await firebase.database().ref(`/users/${uid}/weather`).update({
  //     temp: temp,
  //     temp_max: temp_max,
  //     temp_min: temp_min
  //   })
  // }

  // 로그아웃
  logoutButton.addEventListener('click', async e => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    })

    loginButton.classList.remove('hidden')
    logoutButton.classList.add('hidden')
    refreshWeather();
  })

})


// 그리기
async function refreshWeather() {
  navigator.geolocation.getCurrentPosition(async function(position) {
    let lat = Math.round(position.coords.latitude * 100) / 100
    let lon = Math.round(position.coords.longitude * 100) / 100

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&APPID=${OWM_API_KEY}`) // 기본값이 get
    const userWeather = await res.json()
    console.log(userWeather)

    temp = userWeather.main.temp
    tempEl.textContent = userWeather.main.temp
    temp_max = userWeather.main.temp_max
    tempMaxEl.textContent = userWeather.main.temp_max
    temp_min = userWeather.main.temp_min
    tempMinEl.textContent = userWeather.main.temp_min

    const userTemp = userWeather.main.temp;
    const userWeatherEmoji = document.querySelector('.weather-emoji');
    if (userTemp <= -15) {
      userWeatherEmoji.textContent = '☠️';
    } else if (userTemp > -15 && userTemp <= 13) {
      userWeatherEmoji.textContent = '😱';
    } else if (userTemp > -13 && userTemp <= -10) {
      userWeatherEmoji.textContent = '🤬';
    } else if (userTemp > -10 && userTemp <= -6) {
      userWeatherEmoji.textContent = '😡';
    } else if (userTemp > -6 && userTemp <= -3) {
      userWeatherEmoji.textContent = '🤢';
    } else {
      userWeatherEmoji.textContent = '😌';
    }
  });

}

firebase.auth().onAuthStateChanged(function(user) { //onAuthStateChanged를 사용해서 사용자의 정보를 가지고 올 수 있다.
  if (user) { //로그인 상태 유지시.
    tempEl.textContent = temp
    tempMaxEl.textContent = temp_max
    tempMinEl.textContent = temp_min
  }
});

// 실시간 사용자 시간
function userTime() {
  let time = new Date();
  user_time = time.toLocaleString()
}


// 실시간 시간
function printClock() {
  var clock = document.getElementById("clock"); // 출력할 장소 선택
  var currentDate = new Date(); // 현재시간
  var calendar = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() // 현재 날짜
  var amPm = 'AM'; // 초기값 AM
  var currentHours = addZeros(currentDate.getHours(), 2);
  var currentMinute = addZeros(currentDate.getMinutes(), 2);
  var currentSeconds = addZeros(currentDate.getSeconds(), 2);

  if (currentHours >= 12) { // 시간이 12보다 클 때 PM으로 세팅, 12를 빼줌
    amPm = 'PM';
    currentHours = addZeros(currentHours - 12, 2);
  }

  if (currentSeconds >= 50) { // 50초 이상일 때 색을 변환해 준다.
    currentSeconds = '<span style="color:#de1951;">' + currentSeconds + '</span>'
  }
  clock.innerHTML = currentHours + ":" + currentMinute + ":" + currentSeconds + " <span style='font-size:30px;'>" + amPm + "</span>"; //날짜를 출력해 줌
  setTimeout("printClock()", 1000); // 1초마다 printClock() 함수 호출
}

function addZeros(num, digit) { // 자릿수 맞춰주기
  var zero = '';
  num = num.toString();
  if (num.length < digit) {
    for (i = 0; i < digit - num.length; i++) {
      zero += '0';
    }
  }
  return zero + num;
}