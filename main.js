const apiKey = "364f60f604aeaed43973534fe284967c"
const input = document.getElementById("cityInput")
const btn = document.getElementById("searchBtn")
const cards = document.getElementById("weatherCards")

// favori şehirleri localStorage'dan al
const getStoredCities = () => JSON.parse(localStorage.getItem("favorites")) || []

// yeni şehir favorilere eklenir
const storeCity = (city) => {
let cities = getStoredCities()
if (!cities.includes(city)) {
  cities.push(city)
  localStorage.setItem("favorites", JSON.stringify(cities))
  }
}

// favori şehirlerden silinir
const removeCity = (city) => {
let cities = getStoredCities()
  cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase())
  localStorage.setItem("favorites", JSON.stringify(cities))
}

// openWeather API'den şehir bilgilerini alır
const fetchWeather = async (city) => {
try {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`)
  if (!res.ok) throw new Error("Şehir bulunamadı")
  const data = await res.json()
  renderCard(data) // gelen veriyi kart olarak ekle
} catch (err) {
  alert(err.message)
  }
}

// şehir kartını oluşturur ve dom'a ekler
const renderCard = (data) => {
// aynı şehir zaten ekliyse tekrar eklenmesin
if (document.getElementById(data.name)) return
const card = document.createElement("div")
card.className = "card"
card.id = data.name

// kartın içeriği
card.innerHTML = `
  <button class="remove-btn">x</button>
  <h2>${data.name}</h2>
  <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Hava">
  <p><strong>${Math.round(data.main.temp)}°C</strong> - ${data.weather[0].description}</p>
  <p>🌡️ Nem: ${data.main.humidity}%</p>
  <p>💨 Rüzgar: ${data.wind.speed} km/h</p>
`

// kartın silme butonuna basıldığında çalışacak kod
card.querySelector(".remove-btn").addEventListener("click", () => {
  card.remove(); // dom'dan kaldır
  removeCity(data.name) // localStorage'dan da sil
})

// kartı sayfaya ekle
cards.appendChild(card);};

// sayfa yüklendiğinde favori şehirler otomatik getirilsin
const loadFavorites = () => {
  const cities = getStoredCities()
  cities.forEach(fetchWeather)
}

// ara butonuna tıklanınca şehir sorgulanır
btn.addEventListener("click", () => {
  const city = input.value.trim()
  if (!city) return
  fetchWeather(city)
  storeCity(city)
  input.value = ""
})

// enter tuşu ile de arama
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") btn.click()
})

// uygulama açıldığında favori şehirleri yükle
loadFavorites()