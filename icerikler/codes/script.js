document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById('loader').style.display = 'none';
    }, 1000); // 1 saniye
});


const apiKey = '462847ef47505b21db194b5dc616aca0';
const cities = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"];

// Çerez yardımcı fonksiyonları
function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

// Çerez izni kontrolü
function checkCookieConsent() {
    return getCookie("cookieConsent") === "true";
}
function checkCookieConsent() {
    const consent = getCookie("cookieConsent");
    if (consent === "true") {
        return true;
    } else if (consent === "false") {
        return false;
    }
    return null; // No cookie consent information found
}


// Konum bilgisi al ve güncelle
function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setCookie("latitude", lat, 90);
            setCookie("longitude", lon, 90);
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`)
                .then(response => response.json())
                .then(data => {
                    updateWeather(data);
                    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`);
                })
                .then(response => response.json())
                .then(data => updateForecast(data))
                .catch(error => console.error('Error:', error));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Çerez izni kontrolü ve konum bilgisi
    if (checkCookieConsent()) {
        const lat = getCookie("latitude");
        const lon = getCookie("longitude");
        if (lat && lon) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`)
                .then(response => response.json())
                .then(data => {
                    updateWeather(data);
                    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`);
                })
                .then(response => response.json())
                .then(data => updateForecast(data))
                .catch(error => console.error('Error:', error));
        } else {
            getLocationAndWeather();
        }
    } else {
        getWeather('İstanbul');
    }

    if (!checkCookieConsent()) {
        document.getElementById('cookieConsent').style.display = 'block';
        document.getElementById('acceptCookies').addEventListener('click', () => {
            setCookie("cookieConsent", "true", 90);
            document.getElementById('cookieConsent').style.display = 'none';
            getLocationAndWeather();
        });
    }

    // Diğer event listener'lar ve fonksiyonlar burada olacak...

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('focus', () => {
        document.getElementById('cityList').style.display = 'block';
    });

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const cityList = document.getElementById('cityList');
        cityList.innerHTML = '';
        cities.filter(city => city.toLowerCase().includes(filter)).forEach(city => {
            const cityDiv = document.createElement('div');
            cityDiv.innerText = city;
            cityDiv.addEventListener('click', () => {
                searchInput.value = city;
                document.getElementById('cityList').style.display = 'none';
                getWeather(city);
            });
            cityList.appendChild(cityDiv);
        });
    });

    document.addEventListener('click', (e) => {
        if (!document.getElementById('searchInput').contains(e.target)) {
            document.getElementById('cityList').style.display = 'none';
        }
    });
});

function getWeather(city = 'İstanbul') {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`)
        .then(response => response.json())
        .then(data => updateWeather(data))
        .catch(error => console.error('Error:', error));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`)
        .then(response => response.json())
        .then(data => updateForecast(data))
        .catch(error => console.error('Error:', error));
}

function updateWeather(data) {
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('currentTemp').innerText = `${Math.round(data.main.temp)}°`;
    document.getElementById('weatherDescription').innerText = data.weather[0].description.toUpperCase();
    let icon = data.weather[0].icon;
    if (data.weather[0].main === 'Clear') {
        icon = 'icerikler/images/gunes.png'; // Local icon
    } else {
        icon = `http://openweathermap.org/img/wn/${icon}@2x.png`; // API icon
    }
    document.getElementById('weatherIcon').src = icon;
}

function updateForecast(data) {
    for (let i = 1; i <= 4; i++) {
        const dayData = data.list[i * 8];
        const dayName = new Date(dayData.dt_txt).toLocaleDateString('tr-TR', { weekday: 'long' });
        const temp = Math.round(dayData.main.temp);
        const wind = dayData.wind.speed;
        const humidity = dayData.main.humidity;

        const dayDiv = document.getElementById(`day${i}`);
        const tempSpan = document.getElementById(`temp${i}`);
        const windSpan = document.getElementById(`wind${i}`);
        const humiditySpan = document.getElementById(`humidity${i}`);
        const iconImg = document.getElementById(`icon${i}`);
        const weatherCol = document.querySelector(`.weather-col:nth-child(${i})`); // Select the weather-col div

        dayDiv.innerHTML = `<i class="bi bi-clock"></i> ${dayName}`;
        tempSpan.innerText = `${temp}°`;
        windSpan.innerText = `${wind} km/s`;
        humiditySpan.innerText = `${humidity}%`;
        iconImg.src = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`; // API icon

        // Add click event to the weather-col div
        weatherCol.addEventListener('click', () => {
            const hourlyData = data.list.slice((i - 1) * 8, i * 8);
            showModal(dayName, hourlyData);
        });
    }
}

const modal = document.getElementById('hourlyModal');
const span = document.querySelector('.modal .close');

function showModal(dayName, hourlyData) {
    document.getElementById('modalDayName').innerText = dayName;
    const hourlyContainer = document.getElementById('hourlyData');
    hourlyContainer.innerHTML = '';

    hourlyData.forEach(hour => {
        const entry = document.createElement('div');
        entry.className = 'hourly-entry';

        // Determine local icon path based on weather condition
        const weatherCondition = hour.weather[0].main;
        let iconPath = '';

        switch (weatherCondition) {
            case 'Clear':
                iconPath = 'icerikler/images/icons/sun.svg'; // Local sun icon
                break;
            case 'Clouds':
                iconPath = 'icerikler/images/icons/cloud.svg'; // Local cloud icon
                break;
            case 'Rain':
                iconPath = 'icerikler/images/icons/rain.svg'; // Local rain icon
                break;
            case 'Snow':
                iconPath = 'icerikler/images/icons/snow.svg'; // Local snow icon
                break;
            case 'Thunderstorm':
                iconPath = 'icerikler/images/icons/thunderstorm.svg'; // Local thunderstorm icon
                break;
            default:
                iconPath = 'icerikler/images/icons/sun.svg'; // Default local icon
                break;
        }

        entry.innerHTML = `
            <span>${new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <img src="${iconPath}" alt="weather icon" class="hourly-icon">
            <span>${Math.round(hour.main.temp)}°</span>
        `;
        hourlyContainer.appendChild(entry);
    });

    modal.style.display = 'block';
}

span.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Close modal when 'Esc' key is pressed
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');

    menuToggle.addEventListener('click', function () {
        sideMenu.classList.add('open');
    });

    menuClose.addEventListener('click', function () {
        sideMenu.classList.remove('open');
    });

    // Menü dışında bir yere tıklanınca kapatma
    document.addEventListener('click', function (event) {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            sideMenu.classList.remove('open');
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const scrollArrow = document.getElementById('scrollArrow');
    const bgRight = document.getElementById('bgRight');

    scrollArrow.addEventListener('click', function () {
        bgRight.scrollIntoView({ behavior: 'smooth' });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const rejectCookiesButton = document.getElementById('rejectCookies');
    rejectCookiesButton.addEventListener('click', () => {
        setCookie("cookieConsent", "false", 1); // Set cookie to expire in 1 hour
        document.getElementById('cookieConsent').style.display = 'none';
        // Optionally, you might want to perform other actions when cookies are rejected
    });
});
function checkCookieConsent() {
    const consent = getCookie("cookieConsent");
    if (consent === "true") {
        return true;
    } else if (consent === "false") {
        return false;
    }
    return null; // No cookie consent information found
}


function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
