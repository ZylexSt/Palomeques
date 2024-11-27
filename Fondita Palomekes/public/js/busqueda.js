// Inicializar el mapa y gestionar ubicación
function initMap() {
    const defaultLocation = { lat: 19.432608, lng: -99.133209 }; // Coordenadas iniciales (Ciudad de México)
    let userLocation = defaultLocation;

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: defaultLocation // Centrar inicialmente en la ubicación por defecto
    });

    const marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Ubicación predeterminada"
    });

    // Intentar obtener la ubicación desde LocalStorage o geolocalización
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        const { lat, lon } = JSON.parse(savedLocation);
        userLocation = { lat, lng: lon };

        // Actualizar el mapa y marcador con la ubicación guardada
        map.setCenter(userLocation);
        marker.setPosition(userLocation);
        marker.setTitle("Tú estás aquí");
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Guardar la ubicación en LocalStorage
            localStorage.setItem('userLocation', JSON.stringify({
                lat: userLocation.lat,
                lon: userLocation.lng
            }));

            // Actualizar el mapa y marcador con la ubicación del usuario
            map.setCenter(userLocation);
            marker.setPosition(userLocation);
            marker.setTitle("Tú estás aquí");
        }, error => {
            console.warn("No se pudo obtener la ubicación del usuario. Mostrando ubicación predeterminada.");
        });
    }

    // Configurar búsqueda manual
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const service = new google.maps.places.PlacesService(map);

    // Buscar lugares cercanos
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query.trim() !== '') {
            const request = {
                query,
                fields: ['name', 'geometry']
            };

            service.textSearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    marker.setPosition(results[0].geometry.location);
                    marker.setTitle(results[0].name);
                } else {
                    alert('No se encontraron resultados para la búsqueda.');
                }
            });
        }
    });
}

// Inicializar las funcionalidades al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});
