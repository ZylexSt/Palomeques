// Obtener clima con OpenWeather
function getWeather() {
    const apiKey = 'afdc6ca9e1dbfd2b455f47f7ef990892'; // Reemplaza con tu clave de OpenWeather
    const weatherInfo = document.getElementById('weather-info');

    // Verificar si la ubicación ya está guardada en LocalStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        const { lat, lon } = JSON.parse(savedLocation);
        fetchWeather(lat, lon, apiKey, weatherInfo);
    } else if (navigator.geolocation) {
        // Obtener la ubicación del usuario y guardarla en LocalStorage
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Guardar la ubicación en LocalStorage
            localStorage.setItem('userLocation', JSON.stringify({ lat, lon }));

            // Obtener y mostrar el clima
            fetchWeather(lat, lon, apiKey, weatherInfo);
        }, error => {
            console.error('Error al obtener la ubicación:', error);
            weatherInfo.innerHTML = '<p>No se pudo obtener la ubicación.</p>';
        });
    } else {
        weatherInfo.innerHTML = '<p>Geolocalización no soportada en este navegador.</p>';
    }
}

// Función para obtener y mostrar el clima
function fetchWeather(lat, lon, apiKey, weatherInfo) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos del clima.');
            }
            return response.json();
        })
        .then(data => {
            let cityName = data.name; // Nombre de la ciudad
            const countryName = data.sys.country; // Código del país
            const temperature = data.main.temp; // Temperatura actual
            const description = data.weather[0].description; // Descripción del clima

            // Corregir el nombre si es necesario
            if (cityName === "Manuel F. Martínez") {
                cityName = "Ciudad Juárez";
            }

            // Mostrar la ciudad, país y clima en el widget
            weatherInfo.innerHTML = `
                <p><strong>${cityName}, ${countryName}</strong></p>
                <p>Temperatura: ${temperature}°C</p>
                <p>Clima: ${description}</p>
            `;
        })
        .catch(err => {
            console.error('Error al obtener el clima:', err);
            weatherInfo.innerHTML = '<p>Error al cargar el clima.</p>';
        });
}

// Inicializar el clima al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
});
