// Inicializar Google Maps y Places
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 19.432608, lng: -99.133209 }, // Coordenadas iniciales (CDMX)
        zoom: 14,
    });

    const input = document.getElementById('address-input');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    const marker = new google.maps.Marker({
        map,
        draggable: true,
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert('No se pudo encontrar el lugar seleccionado.');
            return;
        }

        marker.setPosition(place.geometry.location);
        map.setCenter(place.geometry.location);
        map.setZoom(16);
    });

    marker.addListener('dragend', () => {
        const position = marker.getPosition();
        map.setCenter(position);
    });
}

// OpenPay: Configuración y Checkout
OpenPay.setId('MERCHANT_ID');
OpenPay.setApiKey('PUBLIC_API_KEY');
OpenPay.setSandboxMode(true);

document.getElementById('pay-now-btn').addEventListener('click', () => {
    const detalles = getQueryParams();
    const producto = detalles.producto;

    OpenPay.token.create({
        card_number: '4111111111111111',
        holder_name: 'Juan Pérez',
        expiration_year: '27',
        expiration_month: '12',
        cvv2: '123',
    }, token => {
        // Aquí enviamos el token al servidor (implementación del backend en Node.js)
        fetch('/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token_id: token.id,
                description: `Compra de ${producto}`,
                amount: 120,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Pago realizado con éxito.');
            } else {
                alert('Error al procesar el pago.');
            }
        })
        .catch(err => console.error('Error en el pago:', err));
    }, err => console.error('Error creando token:', err));
});

// Obtener parámetros de la URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        producto: params.get('producto') || 'Producto desconocido',
        descripcion: params.get('descripcion') || 'Descripción no disponible',
        proteinas: params.get('proteinas') || 'N/A',
        calorias: params.get('calorias') || 'N/A',
        grasas: params.get('grasas') || 'N/A',
        carbohidratos: params.get('carbohidratos') || 'N/A',
    };
}

// Cargar datos iniciales y mapa
document.addEventListener('DOMContentLoaded', () => {
    initMap();

    const detalles = getQueryParams();
    document.querySelector('.order-info').innerHTML = `
        <h3>Detalles del Pedido</h3>
        <p><strong>Desayuno:</strong> ${detalles.producto}</p>
        <p><strong>Descripción:</strong> ${detalles.descripcion}</p>
        <h4>Declaración Nutrimental</h4>
        <ul>
            <li><strong>Proteínas:</strong> ${detalles.proteinas}</li>
            <li><strong>Calorías:</strong> ${detalles.calorias}</li>
            <li><strong>Grasas:</strong> ${detalles.grasas}</li>
            <li><strong>Carbohidratos:</strong> ${detalles.carbohidratos}</li>
        </ul>
    `;
});
