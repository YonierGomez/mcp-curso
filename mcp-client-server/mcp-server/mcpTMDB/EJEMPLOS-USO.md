# 🎬 Ejemplos de Uso del Servidor MCP TMDB

## 🔍 Búsquedas Básicas

### Buscar Películas
```json
// Buscar "Spider-Man"
{
  "tool": "search_movies",
  "arguments": {
    "query": "Spider-Man",
    "page": 1
  }
}

// Buscar "The Matrix"
{
  "tool": "search_movies", 
  "arguments": {
    "query": "Matrix"
  }
}
```

### Buscar Series de TV
```json
// Buscar "Breaking Bad"
{
  "tool": "search_tv_shows",
  "arguments": {
    "query": "Breaking Bad"
  }
}

// Buscar "Game of Thrones"
{
  "tool": "search_tv_shows",
  "arguments": {
    "query": "Game of Thrones"
  }
}
```

### Buscar Personas
```json
// Buscar "Leonardo DiCaprio"
{
  "tool": "search_people",
  "arguments": {
    "query": "Leonardo DiCaprio"
  }
}

// Buscar "Christopher Nolan"
{
  "tool": "search_people",
  "arguments": {
    "query": "Christopher Nolan"
  }
}
```

## 📊 Información Detallada

### Detalles de Películas
```json
// Avengers: Endgame (ID: 299534)
{
  "tool": "get_movie_details",
  "arguments": {
    "movie_id": "299534"
  }
}

// Inception (ID: 27205)
{
  "tool": "get_movie_details",
  "arguments": {
    "movie_id": "27205"
  }
}

// The Dark Knight (ID: 155)
{
  "tool": "get_movie_details",
  "arguments": {
    "movie_id": "155"
  }
}
```

### Detalles de Series
```json
// Breaking Bad (ID: 1396)
{
  "tool": "get_tv_details",
  "arguments": {
    "tv_id": "1396"
  }
}

// Game of Thrones (ID: 1399)
{
  "tool": "get_tv_details",
  "arguments": {
    "tv_id": "1399"
  }
}
```

### Detalles de Personas
```json
// Leonardo DiCaprio (ID: 6193)
{
  "tool": "get_person_details",
  "arguments": {
    "person_id": "6193"
  }
}

// Robert Downey Jr. (ID: 3223)
{
  "tool": "get_person_details",
  "arguments": {
    "person_id": "3223"
  }
}
```

## 🔥 Contenido Trending y Popular

### Trending
```json
// Películas trending esta semana
{
  "tool": "get_trending",
  "arguments": {
    "media_type": "movie",
    "time_window": "week"
  }
}

// Series trending hoy
{
  "tool": "get_trending",
  "arguments": {
    "media_type": "tv",
    "time_window": "day"
  }
}

// Todo trending esta semana
{
  "tool": "get_trending",
  "arguments": {
    "media_type": "all",
    "time_window": "week"
  }
}

// Personas trending
{
  "tool": "get_trending",
  "arguments": {
    "media_type": "person",
    "time_window": "week"
  }
}
```

### Popular
```json
// Películas populares
{
  "tool": "get_popular_movies",
  "arguments": {
    "page": 1
  }
}

// Series populares
{
  "tool": "get_popular_tv_shows",
  "arguments": {
    "page": 1
  }
}
```

## 🎭 Créditos y Reparto

### Créditos de Películas
```json
// Reparto de Avengers: Endgame
{
  "tool": "get_movie_credits",
  "arguments": {
    "movie_id": "299534"
  }
}

// Reparto de Inception
{
  "tool": "get_movie_credits",
  "arguments": {
    "movie_id": "27205"
  }
}
```

### Créditos de Series
```json
// Reparto de Breaking Bad
{
  "tool": "get_tv_credits",
  "arguments": {
    "tv_id": "1396"
  }
}

// Reparto de The Office
{
  "tool": "get_tv_credits",
  "arguments": {
    "tv_id": "2316"
  }
}
```

## 🔍 Descubrimiento Avanzado

### Películas por Filtros
```json
// Mejores películas de 2023
{
  "tool": "discover_movies",
  "arguments": {
    "year": 2023,
    "sort_by": "vote_average.desc"
  }
}

// Películas de acción más populares
{
  "tool": "discover_movies",
  "arguments": {
    "genre": "28",
    "sort_by": "popularity.desc"
  }
}

// Películas con Leonardo DiCaprio, ordenadas por fecha
{
  "tool": "discover_movies",
  "arguments": {
    "with_cast": "6193",
    "sort_by": "release_date.desc"
  }
}

// Comedias de 2022
{
  "tool": "discover_movies",
  "arguments": {
    "year": 2022,
    "genre": "35",
    "sort_by": "vote_average.desc"
  }
}
```

## 🎯 Workflows Prácticos

### Workflow 1: Investigar una Película
```json
// 1. Buscar la película
{
  "tool": "search_movies",
  "arguments": {
    "query": "Interstellar"
  }
}

// 2. Obtener detalles (asumiendo ID: 157336)
{
  "tool": "get_movie_details",
  "arguments": {
    "movie_id": "157336"
  }
}

// 3. Obtener reparto
{
  "tool": "get_movie_credits",
  "arguments": {
    "movie_id": "157336"
  }
}
```

### Workflow 2: Descubrir por Actor
```json
// 1. Buscar al actor
{
  "tool": "search_people",
  "arguments": {
    "query": "Tom Hanks"
  }
}

// 2. Obtener información del actor (asumiendo ID: 31)
{
  "tool": "get_person_details",
  "arguments": {
    "person_id": "31"
  }
}

// 3. Descubrir películas con Tom Hanks
{
  "tool": "discover_movies",
  "arguments": {
    "with_cast": "31",
    "sort_by": "vote_average.desc"
  }
}
```

### Workflow 3: Explorar Géneros
```json
// 1. Descubrir películas de ciencia ficción
{
  "tool": "discover_movies",
  "arguments": {
    "genre": "878",
    "sort_by": "vote_average.desc"
  }
}

// 2. Ver trending de ciencia ficción
{
  "tool": "get_trending",
  "arguments": {
    "media_type": "movie",
    "time_window": "week"
  }
}
```

## 📝 IDs de Géneros Útiles

- **Acción**: 28
- **Aventura**: 12  
- **Animación**: 16
- **Comedia**: 35
- **Crimen**: 80
- **Documental**: 99
- **Drama**: 18
- **Familia**: 10751
- **Fantasía**: 14
- **Historia**: 36
- **Terror**: 27
- **Música**: 10402
- **Misterio**: 9648
- **Romance**: 10749
- **Ciencia Ficción**: 878
- **Thriller**: 53
- **Guerra**: 10752
- **Western**: 37

## 🌟 Consejos de Uso

1. **Siempre busca primero** antes de usar IDs específicos
2. **Usa filtros** para descubrir contenido específico
3. **Combina herramientas** para workflows completos
4. **Guarda IDs importantes** para consultas futuras
5. **Explora trending** para contenido actual
6. **Usa paginación** para ver más resultados
