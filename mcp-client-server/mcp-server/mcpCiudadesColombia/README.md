# MCP Server de Gestión de Ciudades Colombianas 🇨🇴

Un servidor MCP (Model Context Protocol) completo para gestionar información turística, clima, eventos y recomendaciones de las 10 principales ciudades de Colombia.

## 🌟 Características

### 🛠️ Herramientas (Tools)
- **`get_city_info`**: Información completa de una ciudad (datos generales, atracciones, gastronomía, eventos)
- **`get_weather`**: Clima actual detallado con recomendaciones de vestimenta
- **`get_attractions`**: Lista de atracciones turísticas por categorías
- **`plan_route`**: Planificación inteligente de rutas entre múltiples ciudades
- **`compare_cities`**: Comparación detallada entre ciudades por diferentes criterios
- **`get_regional_info`**: Información completa sobre regiones de Colombia

### 📚 Recursos (Resources)
- **`colombia://cities/complete`**: Base de datos completa de ciudades
- **`colombia://regions`**: Información regional detallada
- **`colombia://travel-guide`**: Guía completa de viaje
- **`colombia://gastronomy`**: Gastronomía por regiones

### 💬 Prompts
- **`travel_itinerary`**: Generación de itinerarios detallados
- **`cultural_experience`**: Recomendaciones de experiencias culturales auténticas
- **`weather_travel_advice`**: Consejos de viaje basados en clima

## 🏙️ Ciudades Incluidas

1. **Bogotá** - Capital, Región Andina
2. **Medellín** - Ciudad de la Eterna Primavera, Región Andina
3. **Cali** - Capital mundial de la salsa, Región Pacífica
4. **Barranquilla** - Puerta de Oro, Región Caribe
5. **Cartagena** - Ciudad Heroica, Región Caribe
6. **Bucaramanga** - Ciudad Bonita, Región Andina
7. **Pereira** - Perla del Otún, Región Andina
8. **Santa Marta** - Distrito Turístico, Región Caribe
9. **Manizales** - Ciudad de las Puertas Abiertas, Región Andina
10. **Pasto** - Ciudad Sorpresa, Región Andina

## 🔧 Instalación

```bash
cd mcp-client-server/mcp-server/mcpCiudadesColombia
npm install
```

## 🚀 Uso

### Configuración de Variables de Entorno

Crea un archivo `.env` con las siguientes API keys:

```bash
# OBLIGATORIA para funcionalidad de clima
OPENWEATHER_API_KEY=tu_api_key_aqui

# OPCIONALES para funcionalidades avanzadas (futuras versiones)
GOOGLE_PLACES_API_KEY=tu_google_api_key
FOURSQUARE_API_KEY=tu_foursquare_api_key
```

### Inicio del Servidor

```bash
npm start
```

## 🔑 API Keys Necesarias

### OpenWeatherMap API (OBLIGATORIA)
- **Obtener en**: https://openweathermap.org/api
- **Plan gratuito**: 1,000 llamadas/día
- **Uso**: Información del clima actual para todas las ciudades

### Google Places API (OPCIONAL - Futuras funcionalidades)
- **Obtener en**: https://developers.google.com/maps/documentation/places/web-service
- **Uso futuro**: Búsqueda avanzada de lugares y reseñas

### Foursquare API (OPCIONAL - Futuras funcionalidades)
- **Obtener en**: https://developer.foursquare.com/
- **Uso futuro**: Recomendaciones de restaurantes y lugares

## 📋 Ejemplos de Uso

### Obtener información completa de una ciudad
```javascript
// Tool: get_city_info
{
  "city": "medellin",
  "include_weather": true
}
```

### Planificar una ruta de viaje
```javascript
// Tool: plan_route
{
  "cities": ["bogota", "medellin", "cartagena"],
  "duration": 10,
  "interests": ["cultura", "gastronomia", "historia"]
}
```

### Comparar ciudades
```javascript
// Tool: compare_cities
{
  "cities": ["medellin", "cali", "barranquilla"],
  "criteria": ["clima", "atracciones", "gastronomia"]
}
```

### Generar itinerario con prompt
```javascript
// Prompt: travel_itinerary
{
  "cities": "Medellín, Cartagena, Bogotá",
  "days": "8",
  "budget": "medio"
}
```

## 🌡️ Información del Clima

El servidor proporciona:
- ✅ Temperatura actual y sensación térmica
- ✅ Condiciones meteorológicas
- ✅ Humedad y presión atmosférica
- ✅ Información del viento
- ✅ Horarios de amanecer y atardecer
- ✅ Recomendaciones de vestimenta según clima y altitud

## 🎯 Características Destacadas

### Información Detallada por Ciudad
- 📍 Datos geográficos (coordenadas, altitud, población)
- 🏛️ Historia y fundación
- 🎨 Principales atracciones turísticas
- 🍽️ Gastronomía típica regional
- 🎉 Eventos y festivales importantes
- 🌤️ Información climática en tiempo real

### Planificación Inteligente
- 🗺️ Rutas optimizadas entre ciudades
- ⏱️ Distribución de tiempo por destino
- 🎒 Recomendaciones de empaque por región
- 💰 Estimación de presupuestos
- 🚌 Información de transporte

### Análisis Regional
- 🌎 Agrupación por regiones geográficas
- 📊 Comparativas detalladas
- 🏔️ Consideraciones de altitud y clima
- 🎭 Características culturales regionales

## 🔧 Arquitectura Técnica

- **Framework**: Model Context Protocol (MCP) SDK
- **Runtime**: Node.js 20+
- **API Climate**: OpenWeatherMap
- **Transport**: Undici con fallback a curl
- **Datos**: Base de datos local optimizada

## 📝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature
3. Añade nuevas ciudades o funcionalidades
4. Envía un Pull Request

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, crear un issue en el repositorio de GitHub.

---

**¡Descubre Colombia con la información más completa y actualizada! 🇨🇴✈️**
