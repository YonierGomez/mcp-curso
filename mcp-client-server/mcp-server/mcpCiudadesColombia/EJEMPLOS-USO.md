# 🧪 Ejemplos Prácticos de Uso del MCP Server Ciudades Colombia

Este archivo contiene ejemplos reales de cómo usar el MCP Server con casos de uso comunes.

## 📋 Caso 1: Planificación de Viaje a Medellín

**Usuario pregunta:** "Necesito un plan de ruta para Medellín Colombia"

**El servidor responderá con:**
- Información completa de Medellín
- Clima actual
- Principales atracciones
- Gastronomía típica
- Eventos actuales
- Recomendaciones específicas

**Herramientas utilizadas:**
- `get_city_info` con `include_weather: true`
- `get_attractions` para sitios turísticos
- Prompt `cultural_experience` para recomendaciones auténticas

## 📋 Caso 2: Ruta por Múltiples Ciudades

**Usuario pregunta:** "Planifica un viaje de 10 días por Medellín, Cartagena y Bogotá"

**El servidor responderá con:**
- Itinerario día a día optimizado
- Distribución de tiempo por ciudad
- Transporte entre ciudades
- Qué empacar según el clima de cada destino
- Presupuesto estimado
- Actividades recomendadas por intereses

**Herramientas utilizadas:**
- `plan_route` con múltiples ciudades
- `compare_cities` para entender diferencias
- Prompt `travel_itinerary` para itinerario detallado

## 📋 Caso 3: Comparación Regional

**Usuario pregunta:** "Compara las ciudades del Caribe colombiano"

**El servidor responderá con:**
- Comparación entre Barranquilla, Cartagena y Santa Marta
- Diferencias climáticas
- Atracciones únicas de cada ciudad
- Especialidades gastronómicas
- Eventos culturales por ciudad

**Herramientas utilizadas:**
- `get_regional_info` para región Caribe
- `compare_cities` con criterios específicos
- Recurso `colombia://regions` para información regional

## 📋 Caso 4: Experiencia Cultural Específica

**Usuario pregunta:** "¿Qué experiencias culturales auténticas puedo tener en Pasto?"

**El servidor responderá con:**
- Carnaval de Negros y Blancos (enero)
- Tradiciones locales únicas
- Gastronomía típica nariñense
- Sitios históricos y culturales
- Interacciones con comunidades locales
- Artesanías y productos locales

**Herramientas utilizadas:**
- `get_city_info` para información completa
- Prompt `cultural_experience` para recomendaciones auténticas
- Recurso `colombia://gastronomy` para especialidades culinarias

## 📋 Caso 5: Información del Clima para Viajes

**Usuario pregunta:** "¿Cómo está el clima en Bogotá, Medellín y Cali para viajar esta semana?"

**El servidor responderá con:**
- Clima actual en cada ciudad
- Recomendaciones de vestimenta por altitud
- Actividades ideales según el clima
- Precauciones especiales
- Mejor época para actividades al aire libre

**Herramientas utilizadas:**
- `get_weather` para cada ciudad
- `compare_cities` con criterio "clima"
- Prompt `weather_travel_advice` para consejos específicos

## 🎯 Comandos de Ejemplo para Probar

### Información Básica
```json
{
  "tool": "get_city_info",
  "arguments": {
    "city": "medellin",
    "include_weather": true
  }
}
```

### Planificación de Ruta
```json
{
  "tool": "plan_route",
  "arguments": {
    "cities": ["medellin", "cartagena", "bogota"],
    "duration": 8,
    "interests": ["cultura", "gastronomia", "historia"]
  }
}
```

### Comparación de Ciudades
```json
{
  "tool": "compare_cities",
  "arguments": {
    "cities": ["barranquilla", "cartagena", "santa_marta"],
    "criteria": ["clima", "atracciones", "gastronomia"]
  }
}
```

### Información Regional
```json
{
  "tool": "get_regional_info",
  "arguments": {
    "region": "Caribe"
  }
}
```

### Prompts Especializados
```json
{
  "prompt": "travel_itinerary",
  "arguments": {
    "cities": "Medellín, Cartagena",
    "days": "6",
    "budget": "medio"
  }
}
```

## 🔍 Recursos Disponibles

### Base de Datos Completa
```
URI: colombia://cities/complete
Contenido: Información detallada de todas las 10 ciudades
```

### Guía de Viaje
```
URI: colombia://travel-guide
Contenido: Guía completa con consejos de viaje
```

### Información Regional
```
URI: colombia://regions
Contenido: Datos de las regiones geográficas
```

### Gastronomía por Regiones
```
URI: colombia://gastronomy
Contenido: Platos típicos organizados por región
```

## 💡 Tips para Mejores Resultados

1. **Usa nombres en minúsculas**: "medellin", "bogota", "santa_marta"
2. **Especifica intereses**: cultura, naturaleza, gastronomía, historia
3. **Indica duración del viaje**: Para mejores recomendaciones de tiempo
4. **Combina herramientas**: Primero información general, luego detalles específicos
5. **Aprovecha los prompts**: Para respuestas más elaboradas y contextualizadas

## 🚀 Casos de Uso Avanzados

### Viaje de Negocios
"Necesito información práctica para un viaje de negocios de 3 días a Bogotá"

### Turismo de Aventura
"Planifica actividades de aventura en ciudades cercanas a parques naturales"

### Ruta Gastronómica
"Crea una ruta enfocada en la gastronomía típica de diferentes regiones"

### Viaje Familiar
"¿Qué ciudades son más apropiadas para viajar con niños?"

### Turismo Cultural
"Quiero conocer la historia y cultura de las ciudades coloniales"

---

**¡Explora Colombia de manera inteligente con este MCP Server! 🇨🇴**
