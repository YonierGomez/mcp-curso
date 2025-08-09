# 🇨🇴 MCP Server de Gestión de Ciudades Colombianas

## ✅ ¿Qué API Key Necesitas?

### 🔑 OBLIGATORIA: OpenWeatherMap API

Para que el servidor funcione completamente con información del clima, necesitas una API key de OpenWeatherMap:

#### Pasos para obtener tu API Key:

1. **Regístrate en OpenWeatherMap**
   - Ve a: https://openweathermap.org/api
   - Crea una cuenta gratuita

2. **Obtén tu API Key**
   - Una vez registrado, ve a tu perfil → "My API keys"
   - Copia la API key que aparece
   - La clave gratuita permite 1,000 llamadas por día

3. **Configura la API Key**
   
   **Opción A: Variable de entorno**
   ```bash
   export OPENWEATHER_API_KEY="tu_api_key_aqui"
   ```
   
   **Opción B: Archivo .env**
   ```bash
   # Crea un archivo .env en la carpeta del proyecto
   OPENWEATHER_API_KEY=tu_api_key_aqui
   ```
   
   **Opción C: Claude Desktop**
   ```json
   {
     "mcpServers": {
       "ciudades-colombia": {
         "command": "node",
         "args": ["/ruta/completa/index.js"],
         "env": {
           "OPENWEATHER_API_KEY": "tu_api_key_aqui"
         }
       }
     }
   }
   ```

### ⚡ OPCIONALES: APIs Futuras

Estas APIs están preparadas para funcionalidades futuras, pero **NO** son necesarias actualmente:

- **Google Places API**: Para búsqueda avanzada de lugares
- **Foursquare API**: Para recomendaciones de restaurantes

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
cd mcp-client-server/mcp-server/mcpCiudadesColombia
npm install

# 2. Configurar API key
cp .env.example .env
# Editar .env y agregar tu OPENWEATHER_API_KEY

# 3. Probar el servidor
npm test
npm run test:cities

# 4. Ejecutar el servidor
npm start
```

## 📱 Configuración para Claude Desktop

1. **Ubicar el archivo de configuración**:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Agregar la configuración**:
   ```json
   {
     "mcpServers": {
       "ciudades-colombia": {
         "command": "node",
         "args": ["/ruta/completa/a/tu/proyecto/mcp-client-server/mcp-server/mcpCiudadesColombia/index.js"],
         "env": {
           "OPENWEATHER_API_KEY": "tu_api_key_de_openweathermap"
         }
       }
     }
   }
   ```

3. **Reiniciar Claude Desktop**

## 🧪 Verificar que Funciona

Una vez configurado, puedes probar estos comandos en Claude:

### Ejemplos de Uso:

```
"Necesito un plan de ruta para Medellín, Colombia"
```

```
"Dame información completa sobre Cartagena"
```

```
"Compara el clima entre Bogotá, Medellín y Cali"
```

```
"Planifica un viaje de 7 días por Medellín, Cartagena y Santa Marta"
```

## ❓ Solución de Problemas

### Error: "API Key no configurada"
- ✅ Verificar que la API key está en el archivo .env o en las variables de entorno
- ✅ Verificar que no hay espacios extra en la API key

### Error: "Ciudad no encontrada"
- ✅ Usar nombres en minúsculas: "medellin", "bogota", "cartagena"
- ✅ Usar guiones bajos para espacios: "santa_marta"

### Error de conexión
- ✅ Verificar conexión a internet
- ✅ La API key de OpenWeatherMap puede tardar hasta 10 minutos en activarse

## 🎯 Ciudades Disponibles

1. **bogota** - Capital, Región Andina
2. **medellin** - Ciudad de la Eterna Primavera
3. **cali** - Capital mundial de la salsa
4. **barranquilla** - Puerta de Oro
5. **cartagena** - Ciudad Heroica
6. **bucaramanga** - Ciudad Bonita
7. **pereira** - Perla del Otún
8. **santa_marta** - Distrito Turístico
9. **manizales** - Ciudad de las Puertas Abiertas
10. **pasto** - Ciudad Sorpresa

## 🔗 Enlaces Útiles

- **OpenWeatherMap API**: https://openweathermap.org/api
- **Documentación MCP**: https://modelcontextprotocol.io/
- **Repositorio del proyecto**: https://github.com/YonierGomez/mcp-curso

---

**¡Disfruta explorando Colombia con IA! 🇨🇴✈️**
