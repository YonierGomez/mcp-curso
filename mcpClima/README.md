# 🌤️ MCP Server Clima Colombia

Un servidor MCP (Model Context Protocol) para consultar información del clima de las principales ciudades de Colombia utilizando la API de OpenWeatherMap.

## 📋 Descripción

Este servidor MCP proporciona herramientas, recursos y prompts para obtener información meteorológica actualizada de las ciudades más importantes de Colombia. Está diseñado para integrarse perfectamente con aplicaciones que soporten el protocolo MCP.

## 🏙️ Ciudades Soportadas

El servidor incluye las siguientes ciudades principales de Colombia:

- **Bogotá** - Capital de Colombia
- **Medellín** - Valle de Aburrá
- **Cali** - Valle del Cauca
- **Barranquilla** - Costa Caribe
- **Cartagena** - Costa Caribe
- **Bucaramanga** - Santander
- **Pereira** - Eje Cafetero
- **Santa Marta** - Costa Caribe
- **Manizales** - Eje Cafetero
- **Pasto** - Nariño

## 🛠️ Características

### Tools (Herramientas)

1. **get_weather**
   - Obtiene el clima actual de una ciudad específica
   - Parámetros: `city` (string) - nombre de la ciudad
   - Retorna: Información detallada del clima actual

2. **get_forecast**
   - Obtiene el pronóstico del clima para 5 días
   - Parámetros: `city` (string) - nombre de la ciudad
   - Retorna: Pronóstico extendido con datos cada 3 horas

3. **get_multiple_cities_weather**
   - Compara el clima actual de múltiples ciudades
   - Parámetros: `cities` (array) - lista de ciudades
   - Retorna: Comparación del clima entre ciudades

### Resources (Recursos)

1. **colombia://cities**
   - Lista completa de ciudades disponibles con coordenadas
   - Formato: JSON

2. **colombia://regions**
   - Información sobre las regiones geográficas de Colombia
   - Formato: Texto plano

### Prompts (Plantillas)

1. **weather_report**
   - Genera un reporte detallado del clima
   - Argumentos: `city` (requerido)

2. **travel_weather_advice**
   - Proporciona consejos de viaje basados en el clima
   - Argumentos: `cities` (requerido)

## 🚀 Instalación

### Prerrequisitos

- Node.js 18.0.0 o superior
- npm o yarn
- API Key de OpenWeatherMap (gratuita)

### Pasos de instalación

1. **Clonar o descargar el proyecto:**
   ```bash
   cd mcpClima
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Obtener API Key de OpenWeatherMap:**
   - Visita [OpenWeatherMap](https://openweathermap.org/api)
   - Crea una cuenta gratuita
   - Obtén tu API Key

4. **Configurar variables de entorno:**
   ```bash
   export OPENWEATHER_API_KEY=tu_api_key_aqui
   ```

## ⚙️ Configuración en mcp.json

Para integrar este servidor MCP en tu aplicación, agrega la siguiente configuración a tu archivo `mcp.json`:

### Configuración Básica

```json
{
  "mcpServers": {
    "clima-colombia": {
      "command": "node",
      "args": ["/home/ney/IA/mcpClima/index.js"],
      "env": {
        "OPENWEATHER_API_KEY": "tu_api_key_de_openweathermap"
      }
    }
  }
}
```

### Configuración Avanzada (con más opciones)

```json
{
  "mcpServers": {
    "clima-colombia": {
      "command": "node",
      "args": ["/home/ney/IA/mcpClima/index.js"],
      "env": {
        "OPENWEATHER_API_KEY": "tu_api_key_de_openweathermap",
        "NODE_ENV": "production"
      },
      "cwd": "/home/ney/IA/mcpClima"
    }
  }
}
```

### Ejemplo completo de mcp.json

```json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ]
    },
    "clima-colombia": {
      "command": "node",
      "args": ["/home/ney/IA/mcpClima/index.js"],
      "env": {
        "OPENWEATHER_API_KEY": "tu_api_key_aqui"
      }
    }
  }
}
```

## 🔧 Uso

### Herramientas disponibles

#### Consultar clima actual
```javascript
// Ejemplo de uso de la herramienta get_weather
{
  "name": "get_weather",
  "arguments": {
    "city": "bogota"
  }
}
```

#### Obtener pronóstico
```javascript
// Ejemplo de uso de la herramienta get_forecast
{
  "name": "get_forecast",
  "arguments": {
    "city": "medellin"
  }
}
```

#### Comparar múltiples ciudades
```javascript
// Ejemplo de uso de la herramienta get_multiple_cities_weather
{
  "name": "get_multiple_cities_weather",
  "arguments": {
    "cities": ["bogota", "medellin", "cali"]
  }
}
```

### Recursos disponibles

#### Listar ciudades
```
URI: colombia://cities
```

#### Información de regiones
```
URI: colombia://regions
```

### Prompts disponibles

#### Reporte del clima
```javascript
{
  "name": "weather_report",
  "arguments": {
    "city": "cartagena"
  }
}
```

#### Consejos de viaje
```javascript
{
  "name": "travel_weather_advice",
  "arguments": {
    "cities": "bogota,medellin,cartagena"
  }
}
```

## 🧪 Pruebas y Diagnóstico

### Ejecutar el servidor directamente
```bash
cd /home/ney/IA/mcpClima
export OPENWEATHER_API_KEY=tu_api_key
node index.js
```

### Usar MCP Inspector
```bash
npx @modelcontextprotocol/inspector node index.js
```

### Verificar configuración
Asegúrate de que:
- ✅ Node.js está instalado (versión 18+)
- ✅ Las dependencias están instaladas
- ✅ La API Key está configurada
- ✅ El servidor se ejecuta sin errores

## 📊 Datos Proporcionados

El servidor proporciona la siguiente información meteorológica:

### Clima Actual
- **Temperatura:** Actual, mínima, máxima y sensación térmica
- **Condiciones:** Descripción del clima (soleado, nublado, lluvia, etc.)
- **Humedad:** Porcentaje de humedad relativa
- **Presión:** Presión atmosférica en hPa
- **Viento:** Velocidad y dirección
- **Visibilidad:** Distancia de visibilidad
- **Nubosidad:** Porcentaje de cobertura de nubes
- **Sol:** Horas de amanecer y atardecer

### Pronóstico
- **5 días:** Pronóstico extendido
- **Intervalos de 3 horas:** Datos detallados cada 3 horas
- **Múltiples métricas:** Temperatura, humedad, condiciones

## 🔒 Seguridad

- **API Key:** Nunca expongas tu API Key en el código fuente
- **Variables de entorno:** Usa siempre variables de entorno para datos sensibles
- **Límites de API:** Respeta los límites de la API gratuita de OpenWeatherMap (1000 llamadas/día)

## 🐛 Solución de Problemas

### Error: "API Key no configurada"
```bash
export OPENWEATHER_API_KEY=tu_api_key_real
```

### Error: "Ciudad no encontrada"
Verifica que uses uno de estos nombres:
`bogota`, `medellin`, `cali`, `barranquilla`, `cartagena`, `bucaramanga`, `pereira`, `santa_marta`, `manizales`, `pasto`

### Error de conexión a la API
- Verifica tu conexión a internet
- Confirma que tu API Key es válida
- Revisa que no hayas excedido el límite de llamadas

## 📈 Mejoras Futuras

- [ ] Soporte para más ciudades colombianas
- [ ] Alertas meteorológicas
- [ ] Datos históricos del clima
- [ ] Mapas del clima
- [ ] Integración con otras APIs meteorológicas

## 📄 Licencia

MIT License - Consulta el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Verifica la configuración
3. Consulta los logs de error
4. Abre un issue en el repositorio
