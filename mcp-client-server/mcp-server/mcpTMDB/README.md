# Servidor MCP para TMDB (The Movie Database)

Un servidor MCP (Model Context Protocol) para interactuar con la API de The Movie Database, que proporciona acceso a información completa sobre películas, series de TV y personas del mundo del entretenimiento.

## 🚀 Características

### Herramientas Disponibles:

1. **`search_movies`** - Busca películas por título
   - Parámetros: `query` (obligatorio), `page` (opcional)
   - Ejemplo: Buscar "Inception", "Spider-Man", etc.

2. **`search_tv_shows`** - Busca series de TV por título
   - Parámetros: `query` (obligatorio), `page` (opcional)
   - Ejemplo: Buscar "Breaking Bad", "Game of Thrones", etc.

3. **`get_movie_details`** - Información detallada de una película
   - Parámetros: `movie_id` (obligatorio)
   - Incluye: presupuesto, recaudación, duración, géneros, productoras

4. **`get_tv_details`** - Información detallada de una serie
   - Parámetros: `tv_id` (obligatorio)
   - Incluye: temporadas, episodios, cadenas, estado de emisión

5. **`get_person_details`** - Información de una persona (actor, director, etc.)
   - Parámetros: `person_id` (obligatorio)
   - Incluye: biografía, filmografía, datos personales

6. **`search_people`** - Busca personas por nombre
   - Parámetros: `query` (obligatorio), `page` (opcional)
   - Ejemplo: Buscar "Leonardo DiCaprio", "Christopher Nolan"

7. **`get_trending`** - Contenido trending
   - Parámetros: `media_type` (movie/tv/person/all), `time_window` (day/week)
   - Muestra lo más popular del momento

8. **`get_popular_movies`** - Películas más populares
   - Parámetros: `page` (opcional)
   - Lista las películas más populares actuales

9. **`get_popular_tv_shows`** - Series más populares
   - Parámetros: `page` (opcional)
   - Lista las series más populares actuales

10. **`get_movie_credits`** - Reparto y equipo de una película
    - Parámetros: `movie_id` (obligatorio)
    - Muestra actores y equipo técnico

11. **`get_tv_credits`** - Reparto y equipo de una serie
    - Parámetros: `tv_id` (obligatorio)
    - Muestra actores y equipo técnico

12. **`discover_movies`** - Descubre películas con filtros
    - Parámetros: `sort_by`, `year`, `genre`, `with_cast`, `page` (todos opcionales)
    - Permite búsquedas avanzadas con múltiples filtros

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` con tu API key de TMDB:
```bash
TMDB_API_KEY=tu_api_key_aqui
```

3. Ejecutar el servidor:
```bash
npm start
```

## 🔧 Tecnologías Utilizadas

- **Node.js** con ES Modules
- **@modelcontextprotocol/sdk** para el protocolo MCP
- **undici** para requests HTTP (cliente nativo de Node.js, sin dependencias deprecadas)
- **dotenv** para variables de entorno

## 🔧 Configuración

### Obtener API Key de TMDB:
1. Registrarse en [TMDB](https://www.themoviedb.org/)
2. Ir a Configuración → API → Crear nueva API key
3. Copiar la API key a tu archivo `.env`

## 🧪 Testing

```bash
# Prueba básica
npm test

# Pruebas prácticas
npm run test-practical
```

## 📝 Ejemplos de Uso

### Buscar películas:
```json
{
  "tool": "search_movies",
  "arguments": {
    "query": "Avengers",
    "page": 1
  }
}
```

### Obtener detalles de película:
```json
{
  "tool": "get_movie_details",
  "arguments": {
    "movie_id": "299536"
  }
}
```

### Buscar contenido trending:
```json
{
  "tool": "get_trending",
  "arguments": {
    "media_type": "movie",
    "time_window": "week"
  }
}
```

### Descubrir películas por filtros:
```json
{
  "tool": "discover_movies",
  "arguments": {
    "year": 2023,
    "sort_by": "vote_average.desc"
  }
}
```

## 🌟 Características Especiales

- **Multiidioma**: Todas las respuestas en español
- **Imágenes**: URLs completas para posters y backdrops
- **Formato Rico**: Respuestas con emojis y formato markdown
- **Paginación**: Soporte para navegar entre páginas de resultados
- **Filtros Avanzados**: Búsquedas por año, género, actor, etc.
- **Cache Automático**: La API de TMDB incluye cache automático

## 🔗 APIs Utilizadas

- TMDB API v3
- Endpoints principales: search, movie, tv, person, trending, popular, discover
- Todas las imágenes servidas desde el CDN oficial de TMDB

## 📄 Licencia

MIT
