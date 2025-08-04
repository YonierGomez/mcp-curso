#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  GetPromptRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Ciudades principales de Colombia con sus coordenadas
const COLOMBIA_CITIES = {
  "bogota": { lat: 4.7110, lon: -74.0721, name: "Bogotá" },
  "medellin": { lat: 6.2442, lon: -75.5812, name: "Medellín" },
  "cali": { lat: 3.4516, lon: -76.5320, name: "Cali" },
  "barranquilla": { lat: 10.9639, lon: -74.7964, name: "Barranquilla" },
  "cartagena": { lat: 10.3910, lon: -75.4794, name: "Cartagena" },
  "bucaramanga": { lat: 7.1253, lon: -73.1198, name: "Bucaramanga" },
  "pereira": { lat: 4.8133, lon: -75.6961, name: "Pereira" },
  "santa_marta": { lat: 11.2408, lon: -74.1990, name: "Santa Marta" },
  "manizales": { lat: 5.0703, lon: -75.5138, name: "Manizales" },
  "pasto": { lat: 1.2136, lon: -77.2811, name: "Pasto" }
};

class ClimaColombiaServer {
  constructor() {
    this.server = new Server(
      {
        name: "clima-colombia-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // Lista de herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_weather",
            description: "Obtiene el clima actual de una ciudad de Colombia",
            inputSchema: {
              type: "object",
              properties: {
                city: {
                  type: "string",
                  description: "Nombre de la ciudad colombiana (bogota, medellin, cali, barranquilla, cartagena, bucaramanga, pereira, santa_marta, manizales, pasto)",
                  enum: Object.keys(COLOMBIA_CITIES)
                }
              },
              required: ["city"]
            }
          },
          {
            name: "get_forecast",
            description: "Obtiene el pronóstico del clima para 5 días de una ciudad de Colombia",
            inputSchema: {
              type: "object",
              properties: {
                city: {
                  type: "string",
                  description: "Nombre de la ciudad colombiana",
                  enum: Object.keys(COLOMBIA_CITIES)
                }
              },
              required: ["city"]
            }
          },
          {
            name: "get_multiple_cities_weather",
            description: "Compara el clima actual de múltiples ciudades de Colombia",
            inputSchema: {
              type: "object",
              properties: {
                cities: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: Object.keys(COLOMBIA_CITIES)
                  },
                  description: "Lista de ciudades colombianas para comparar"
                }
              },
              required: ["cities"]
            }
          }
        ]
      };
    });

    // Ejecución de herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (!API_KEY) {
        throw new Error("API Key de OpenWeatherMap no configurada. Configure OPENWEATHER_API_KEY en las variables de entorno.");
      }

      switch (request.params.name) {
        case "get_weather":
          return await this.getCurrentWeather(request.params.arguments.city);
        case "get_forecast":
          return await this.getForecast(request.params.arguments.city);
        case "get_multiple_cities_weather":
          return await this.getMultipleCitiesWeather(request.params.arguments.cities);
        default:
          throw new Error(`Herramienta desconocida: ${request.params.name}`);
      }
    });

    // Lista de recursos disponibles
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "colombia://cities",
            name: "Ciudades de Colombia",
            description: "Lista de ciudades principales de Colombia disponibles para consulta del clima",
            mimeType: "application/json"
          },
          {
            uri: "colombia://regions",
            name: "Regiones de Colombia",
            description: "Información sobre las regiones geográficas de Colombia",
            mimeType: "text/plain"
          }
        ]
      };
    });

    // Lectura de recursos
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      switch (request.params.uri) {
        case "colombia://cities":
          return {
            contents: [
              {
                uri: request.params.uri,
                mimeType: "application/json",
                text: JSON.stringify(COLOMBIA_CITIES, null, 2)
              }
            ]
          };
        case "colombia://regions":
          return {
            contents: [
              {
                uri: request.params.uri,
                mimeType: "text/plain",
                text: `Regiones de Colombia disponibles:
- Región Andina: Bogotá, Medellín, Bucaramanga, Manizales, Pereira, Pasto
- Región Caribe: Barranquilla, Cartagena, Santa Marta
- Región Pacífica: Cali

Cada región tiene características climáticas particulares debido a su ubicación geográfica y altitud.`
              }
            ]
          };
        default:
          throw new Error(`Recurso no encontrado: ${request.params.uri}`);
      }
    });

    // Lista de prompts disponibles
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: "weather_report",
            description: "Genera un reporte detallado del clima para una ciudad de Colombia",
            arguments: [
              {
                name: "city",
                description: "Ciudad de Colombia",
                required: true
              }
            ]
          },
          {
            name: "travel_weather_advice",
            description: "Proporciona consejos de viaje basados en el clima de múltiples ciudades",
            arguments: [
              {
                name: "cities",
                description: "Lista de ciudades separadas por comas",
                required: true
              }
            ]
          }
        ]
      };
    });

    // Obtención de prompts
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      switch (request.params.name) {
        case "weather_report":
          const city = request.params.arguments?.city;
          if (!city || !COLOMBIA_CITIES[city.toLowerCase()]) {
            throw new Error("Ciudad no válida. Use una de las ciudades disponibles.");
          }
          
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Genera un reporte detallado del clima actual para ${COLOMBIA_CITIES[city.toLowerCase()].name}, Colombia. Incluye temperatura, humedad, condiciones actuales, y recomendaciones para actividades al aire libre.`
                }
              }
            ]
          };

        case "travel_weather_advice":
          const cities = request.params.arguments?.cities;
          if (!cities) {
            throw new Error("Debe proporcionar una lista de ciudades.");
          }
          
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Compara el clima actual de las siguientes ciudades de Colombia: ${cities}. Proporciona consejos de viaje y recomendaciones sobre qué empacar para cada destino.`
                }
              }
            ]
          };

        default:
          throw new Error(`Prompt no encontrado: ${request.params.name}`);
      }
    });
  }

  async getCurrentWeather(cityKey) {
    try {
      const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
      if (!city) {
        throw new Error(`Ciudad no encontrada: ${cityKey}`);
      }

      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'es'
        }
      });

      const data = response.data;
      
      return {
        content: [
          {
            type: "text",
            text: `🌤️ Clima actual en ${city.name}, Colombia:

📊 **Condiciones Generales:**
- Condición: ${data.weather[0].description}
- Temperatura: ${data.main.temp}°C (Sensación térmica: ${data.main.feels_like}°C)
- Temperatura mínima: ${data.main.temp_min}°C
- Temperatura máxima: ${data.main.temp_max}°C

💧 **Humedad y Presión:**
- Humedad: ${data.main.humidity}%
- Presión: ${data.main.pressure} hPa

🌬️ **Viento:**
- Velocidad: ${data.wind?.speed || 'N/A'} m/s
- Dirección: ${data.wind?.deg || 'N/A'}°

☁️ **Nubosidad:** ${data.clouds.all}%

🔍 **Visibilidad:** ${data.visibility ? (data.visibility / 1000).toFixed(1) + ' km' : 'N/A'}

🌅 **Sol:**
- Amanecer: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString('es-CO')}
- Atardecer: ${new Date(data.sys.sunset * 1000).toLocaleTimeString('es-CO')}

📍 **Coordenadas:** ${city.lat}, ${city.lon}
⏰ **Última actualización:** ${new Date(data.dt * 1000).toLocaleString('es-CO')}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Error al obtener el clima: ${error.message}`);
    }
  }

  async getForecast(cityKey) {
    try {
      const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
      if (!city) {
        throw new Error(`Ciudad no encontrada: ${cityKey}`);
      }

      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'es'
        }
      });

      const data = response.data;
      let forecast = `🔮 Pronóstico de 5 días para ${city.name}, Colombia:\n\n`;

      const dailyForecasts = {};
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('es-CO');
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
      });

      Object.entries(dailyForecasts).slice(0, 5).forEach(([date, forecasts]) => {
        const dayName = new Date(forecasts[0].dt * 1000).toLocaleDateString('es-CO', { weekday: 'long' });
        forecast += `📅 **${dayName}, ${date}:**\n`;
        
        forecasts.slice(0, 4).forEach(item => {
          const time = new Date(item.dt * 1000).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
          forecast += `   ${time}: ${item.weather[0].description}, ${item.main.temp}°C (💧${item.main.humidity}%)\n`;
        });
        forecast += '\n';
      });

      return {
        content: [
          {
            type: "text",
            text: forecast
          }
        ]
      };
    } catch (error) {
      throw new Error(`Error al obtener el pronóstico: ${error.message}`);
    }
  }

  async getMultipleCitiesWeather(cities) {
    try {
      const weatherPromises = cities.map(async (cityKey) => {
        const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
        if (!city) {
          return { city: cityKey, error: "Ciudad no encontrada" };
        }

        try {
          const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
              lat: city.lat,
              lon: city.lon,
              appid: API_KEY,
              units: 'metric',
              lang: 'es'
            }
          });

          return {
            city: city.name,
            data: response.data
          };
        } catch (error) {
          return { city: city.name, error: error.message };
        }
      });

      const results = await Promise.all(weatherPromises);
      
      let comparison = `🌍 Comparación del clima en Colombia:\n\n`;
      
      results.forEach(result => {
        if (result.error) {
          comparison += `❌ **${result.city}**: Error - ${result.error}\n\n`;
        } else {
          const data = result.data;
          comparison += `🏙️ **${result.city}:**\n`;
          comparison += `   🌡️ ${data.main.temp}°C (${data.weather[0].description})\n`;
          comparison += `   💧 Humedad: ${data.main.humidity}%\n`;
          comparison += `   🌬️ Viento: ${data.wind?.speed || 'N/A'} m/s\n\n`;
        }
      });

      return {
        content: [
          {
            type: "text",
            text: comparison
          }
        ]
      };
    } catch (error) {
      throw new Error(`Error al comparar ciudades: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("🌤️ MCP Server Clima Colombia iniciado correctamente");
  }
}

const server = new ClimaColombiaServer();
server.run().catch(console.error);
