# 🌤️ MCP Server Clima Colombia

Servidor MCP (Model Context Protocol) para consultar el clima de ciudades principales de Colombia usando la API de OpenWeatherMap.

## 🚀 Características

- ✅ Clima actual de 10 ciudades principales de Colombia
- ✅ Pronóstico de 5 días
- ✅ Comparación entre múltiples ciudades
- ✅ Conexión optimizada con fallback automático
- ✅ Manejo robusto de errores
- ✅ Configuración IPv4 optimizada

## 🏙️ Ciudades Soportadas

- Bogotá
- Medellín  
- Cali
- Barranquilla
- Cartagena
- Bucaramanga
- Pereira
- Santa Marta
- Manizales
- Pasto

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd mcpClima

# Instalar dependencias
npm install

# Configurar API key (opcional - incluye una por defecto)
export OPENWEATHER_API_KEY=tu_api_key_aqui
```

## 🎯 Uso

### Como servidor MCP independiente
```bash
npm start
```

### Integración con Claude Desktop
Agregar al archivo `mcp.json`:

```json
{
  "servers": {
    "climaColombia": {
      "command": "node",
      "args": ["/ruta/al/mcpClima/index.js"],
      "env": {
        "OPENWEATHER_API_KEY": "tu_api_key"
      }
    }
  }
}
```

## 🛠️ Herramientas Disponibles

1. **get_weather** - Clima actual de una ciudad
2. **get_forecast** - Pronóstico de 5 días
3. **get_multiple_cities_weather** - Comparar múltiples ciudades

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
node test.js

# Prueba práctica completa
node test-practical.js
```

## 🔧 Configuración

- **API Key**: Configurable vía variable de entorno `OPENWEATHER_API_KEY`
- **Timeout**: 15 segundos para peticiones HTTP
- **Fallback**: curl automático si undici falla
- **Conectividad**: IPv4 preferido para mejor compatibilidad

## 📄 Licencia

MIT