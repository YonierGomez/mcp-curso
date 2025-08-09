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
import { request, Agent } from 'undici';
import fetch from 'node-fetch';

// Variables de entorno para APIs
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "e189791e25217c29bec584e9471f82b8";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Configurar agente con IPv4 preferido
const agent = new Agent({
  connect: {
    family: 4,
    timeout: 10000
  }
});

// Datos completos de las 10 principales ciudades de Colombia
const COLOMBIA_CITIES = {
  "bogota": {
    lat: 4.7110,
    lon: -74.0721,
    name: "Bogotá",
    region: "Andina",
    department: "Cundinamarca",
    altitude: 2640,
    population: 7500000,
    founded: 1538,
    description: "Capital de Colombia, centro político, económico y cultural del país",
    attractions: [
      "Museo del Oro",
      "Cerro de Monserrate",
      "La Candelaria",
      "Museo Botero",
      "Biblioteca Luis Ángel Arango",
      "Parque Simón Bolívar",
      "Zona Rosa",
      "Teatro Colón"
    ],
    gastronomy: [
      "Ajiaco santafereño",
      "Tamales bogotanos",
      "Changua",
      "Fritanga",
      "Chocolate con queso"
    ],
    events: [
      "Festival Iberoamericano de Teatro (marzo-abril)",
      "Rock al Parque (octubre)",
      "Festival de Jazz (septiembre)",
      "Feria del Libro (abril-mayo)"
    ]
  },
  "medellin": {
    lat: 6.2442,
    lon: -75.5812,
    name: "Medellín",
    region: "Andina",
    department: "Antioquia",
    altitude: 1495,
    population: 2500000,
    founded: 1616,
    description: "Ciudad de la Eterna Primavera, conocida por su innovación urbana y cultura paisa",
    attractions: [
      "Comuna 13 Graffiti Tour",
      "Parque Arví",
      "Museo de Antioquia",
      "Jardín Botánico",
      "Pueblito Paisa",
      "Guatapé (El Peñón)",
      "Metrocable",
      "Biblioteca España"
    ],
    gastronomy: [
      "Bandeja paisa",
      "Arepa con queso",
      "Sancocho antioqueño",
      "Buñuelos",
      "Natilla"
    ],
    events: [
      "Feria de las Flores (agosto)",
      "Alumbrados Navideños (diciembre-enero)",
      "Festival de Poesía (julio)",
      "Colombiamoda (julio)"
    ]
  },
  "cali": {
    lat: 3.4516,
    lon: -76.5320,
    name: "Cali",
    region: "Pacífica",
    department: "Valle del Cauca",
    altitude: 1018,
    population: 2200000,
    founded: 1536,
    description: "Capital mundial de la salsa, famosa por su música y vida nocturna",
    attractions: [
      "Cerro de las Tres Cruces",
      "Zoológico de Cali",
      "Teatro Municipal",
      "Museo La Tertulia",
      "Boulevard del Río",
      "Barrio San Antonio",
      "Cristo Rey",
      "Gato de Tejada"
    ],
    gastronomy: [
      "Sancocho de gallina",
      "Empanadas vallecaucanas",
      "Aborrajados",
      "Cholado",
      "Champús"
    ],
    events: [
      "Feria de Cali (diciembre-enero)",
      "Festival Mundial de Salsa (septiembre)",
      "Festival de Música del Pacífico Petronio Álvarez (agosto)",
      "Salsódromo (diciembre)"
    ]
  },
  "barranquilla": {
    lat: 10.9639,
    lon: -74.7964,
    name: "Barranquilla",
    region: "Caribe",
    department: "Atlántico",
    altitude: 18,
    population: 1300000,
    founded: 1629,
    description: "Puerta de Oro de Colombia, famosa por su Carnaval y cultura caribeña",
    attractions: [
      "Carnaval de Barranquilla",
      "Malecón del Río",
      "Casa del Carnaval",
      "Museo del Caribe",
      "Gran Malecón",
      "Estadio Metropolitano",
      "Teatro Amira de la Rosa",
      "Bocas de Ceniza"
    ],
    gastronomy: [
      "Arepa de huevo",
      "Sancocho de bocachico",
      "Patacón con todo",
      "Carimañolas",
      "Raspao"
    ],
    events: [
      "Carnaval de Barranquilla (febrero-marzo)",
      "Festival de Orquestas (octubre)",
      "Pre-Carnavales (enero)",
      "Festival Barranquijazz (septiembre)"
    ]
  },
  "cartagena": {
    lat: 10.3910,
    lon: -75.4794,
    name: "Cartagena",
    region: "Caribe",
    department: "Bolívar",
    altitude: 2,
    population: 1000000,
    founded: 1533,
    description: "Ciudad Heroica, Patrimonio de la Humanidad por su centro histórico colonial",
    attractions: [
      "Ciudad Amurallada",
      "Castillo San Felipe",
      "Islas Rosario",
      "Torre del Reloj",
      "Plaza Santo Domingo",
      "Convento La Popa",
      "Getsemaní",
      "Playa Bocagrande"
    ],
    gastronomy: [
      "Arepa de huevo",
      "Ceviche de camarón",
      "Mote de queso",
      "Pescado frito",
      "Cocadas"
    ],
    events: [
      "Festival Internacional de Música (enero)",
      "Hay Festival (enero)",
      "Festival de Cine de Cartagena (marzo)",
      "Fiestas de Independencia (noviembre)"
    ]
  },
  "bucaramanga": {
    lat: 7.1253,
    lon: -73.1198,
    name: "Bucaramanga",
    region: "Andina",
    department: "Santander",
    altitude: 959,
    population: 1200000,
    founded: 1622,
    description: "Ciudad Bonita, conocida por su clima agradable y parques",
    attractions: [
      "Parque Santander",
      "Panachi",
      "Cerro del Santísimo",
      "Parque Nacional del Chicamocha",
      "Casa de Bolívar",
      "Catedral de la Sagrada Familia",
      "Jardín Botánico Eloy Valenzuela",
      "Mesa de los Santos"
    ],
    gastronomy: [
      "Hormigas culonas",
      "Cabrito santandereano",
      "Arepa santandereana",
      "Mute santandereano",
      "Obleas"
    ],
    events: [
      "Feria Bonita (septiembre)",
      "Festival Nacional de la Guabina y el Tiple (agosto)",
      "Festival de Piano (agosto)",
      "Día de las Cometas (agosto)"
    ]
  },
  "pereira": {
    lat: 4.8133,
    lon: -75.6961,
    name: "Pereira",
    region: "Andina",
    department: "Risaralda",
    altitude: 1411,
    population: 750000,
    founded: 1863,
    description: "Perla del Otún, puerta de entrada al Eje Cafetero",
    attractions: [
      "Parque Nacional Natural Los Nevados",
      "Termales de Santa Rosa",
      "Zoológico Matecaña",
      "Viaducto César Gaviria Trujillo",
      "Catedral Nuestra Señora de la Pobreza",
      "Parque Consotá",
      "Bolívar Desnudo",
      "Jardín Botánico UTP"
    ],
    gastronomy: [
      "Sancocho de gallina",
      "Patacones",
      "Arepa de chócolo",
      "Frijoles con garra",
      "Café especial"
    ],
    events: [
      "Fiestas de la Cosecha (agosto)",
      "Festival Internacional de Teatro (octubre)",
      "Semana de la Raza (octubre)",
      "Festival de la Canción (octubre)"
    ]
  },
  "santa_marta": {
    lat: 11.2408,
    lon: -74.1990,
    name: "Santa Marta",
    region: "Caribe",
    department: "Magdalena",
    altitude: 2,
    population: 500000,
    founded: 1525,
    description: "Distrito Turístico, Cultural e Histórico, puerta de entrada a la Sierra Nevada",
    attractions: [
      "Parque Nacional Tayrona",
      "Ciudad Perdida (Teyuna)",
      "Quinta de San Pedro Alejandrino",
      "Centro Histórico",
      "Rodadero",
      "Minca",
      "Taganga",
      "Museo del Oro Tairona"
    ],
    gastronomy: [
      "Pescado frito",
      "Arepa de huevo",
      "Patacón con camarón",
      "Cayeye",
      "Lulada"
    ],
    events: [
      "Festival de la Leyenda Vallenata (abril)",
      "Festival de Teatro del Caribe (noviembre)",
      "Semana Santa (marzo-abril)",
      "Festival del Mar (julio)"
    ]
  },
  "manizales": {
    lat: 5.0703,
    lon: -75.5138,
    name: "Manizales",
    region: "Andina",
    department: "Caldas",
    altitude: 2153,
    population: 400000,
    founded: 1849,
    description: "Ciudad de las Puertas Abiertas, famosa por su arquitectura y café",
    attractions: [
      "Catedral Basílica de Manizales",
      "Torre de Kueka",
      "Cable Aéreo",
      "Recinto del Pensamiento",
      "Nevado del Ruiz",
      "Hacienda Cafetera",
      "Teatro Los Fundadores",
      "Ecoparque Alcázares Arenillo"
    ],
    gastronomy: [
      "Sancocho de gallina",
      "Café de especialidad",
      "Arepa de chócolo",
      "Mazamorra de maíz",
      "Natilla"
    ],
    events: [
      "Feria de Manizales (enero)",
      "Festival Internacional de Teatro (octubre)",
      "Manizales Grita Rock (octubre)",
      "Festival de Jazz (septiembre)"
    ]
  },
  "pasto": {
    lat: 1.2136,
    lon: -77.2811,
    name: "Pasto",
    region: "Andina",
    department: "Nariño",
    altitude: 2527,
    population: 450000,
    founded: 1537,
    description: "Ciudad Sorpresa de Colombia, famosa por su Carnaval de Negros y Blancos",
    attractions: [
      "Carnaval de Negros y Blancos",
      "Volcán Galeras",
      "Laguna de la Cocha",
      "Centro Histórico",
      "Museo del Oro",
      "Santuario de Las Lajas",
      "Catedral de Pasto",
      "Parque Nariño"
    ],
    gastronomy: [
      "Cuy asado",
      "Hornado pastuso",
      "Empanadas de añejo",
      "Champús",
      "Helados de paila"
    ],
    events: [
      "Carnaval de Negros y Blancos (enero)",
      "Festival de Teatro Universitario (octubre)",
      "Semana Santa (marzo-abril)",
      "Festival Folclórico de la Frontera (agosto)"
    ]
  }
};

class CiudadesColombiaServer {
  constructor() {
    this.server = new Server(
      {
        name: "ciudades-colombia-server",
        version: "2.0.0",
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

  // Helper function para hacer requests HTTP
  async makeApiRequest(url) {
    try {
      const { statusCode, body } = await request(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'MCP-CiudadesColombia/2.0',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip'
        },
        dispatcher: agent,
        timeout: 15000
      });

      if (statusCode >= 200 && statusCode < 300) {
        const data = await body.json();
        return data;
      } else {
        const errorText = await body.text();
        throw new Error(`HTTP ${statusCode}: ${errorText}`);
      }
    } catch (error) {
      console.error(`🔍 Error en makeApiRequest: ${error.message}`);
      throw new Error(`Fallo en la petición: ${error.message}`);
    }
  }

  setupHandlers() {
    // Lista de herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_city_info",
            description: "Obtiene información completa de una ciudad colombiana incluyendo datos generales, atracciones, gastronomía y eventos",
            inputSchema: {
              type: "object",
              properties: {
                city: {
                  type: "string",
                  description: "Nombre de la ciudad colombiana",
                  enum: Object.keys(COLOMBIA_CITIES)
                },
                include_weather: {
                  type: "boolean",
                  description: "Incluir información del clima actual",
                  default: true
                }
              },
              required: ["city"]
            }
          },
          {
            name: "get_weather",
            description: "Obtiene el clima actual de una ciudad de Colombia",
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
            name: "get_attractions",
            description: "Lista las principales atracciones turísticas de una ciudad",
            inputSchema: {
              type: "object",
              properties: {
                city: {
                  type: "string",
                  description: "Nombre de la ciudad colombiana",
                  enum: Object.keys(COLOMBIA_CITIES)
                },
                category: {
                  type: "string",
                  description: "Categoría específica de atracciones",
                  enum: ["all", "museums", "parks", "historical", "cultural", "natural"]
                }
              },
              required: ["city"]
            }
          },
          {
            name: "plan_route",
            description: "Planifica una ruta de viaje entre múltiples ciudades colombianas con recomendaciones específicas",
            inputSchema: {
              type: "object",
              properties: {
                cities: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: Object.keys(COLOMBIA_CITIES)
                  },
                  description: "Lista de ciudades a visitar en orden de preferencia"
                },
                duration: {
                  type: "number",
                  description: "Duración del viaje en días",
                  default: 7
                },
                interests: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["cultura", "naturaleza", "gastronomia", "historia", "aventura", "playa", "ciudad"]
                  },
                  description: "Intereses del viajero"
                }
              },
              required: ["cities"]
            }
          },
          {
            name: "compare_cities",
            description: "Compara múltiples ciudades colombianas en diferentes aspectos",
            inputSchema: {
              type: "object",
              properties: {
                cities: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: Object.keys(COLOMBIA_CITIES)
                  },
                  description: "Lista de ciudades a comparar"
                },
                criteria: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["clima", "atracciones", "gastronomia", "eventos", "costo", "seguridad", "transporte"]
                  },
                  description: "Criterios de comparación"
                }
              },
              required: ["cities"]
            }
          },
          {
            name: "get_regional_info",
            description: "Obtiene información sobre una región específica de Colombia",
            inputSchema: {
              type: "object",
              properties: {
                region: {
                  type: "string",
                  description: "Región de Colombia",
                  enum: ["Andina", "Caribe", "Pacífica", "Amazónica", "Orinoquía"]
                }
              },
              required: ["region"]
            }
          }
        ]
      };
    });

    // Ejecución de herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case "get_city_info":
            return await this.getCityInfo(
              request.params.arguments.city,
              request.params.arguments.include_weather
            );
          case "get_weather":
            return await this.getWeather(request.params.arguments.city);
          case "get_attractions":
            return await this.getAttractions(
              request.params.arguments.city,
              request.params.arguments.category
            );
          case "plan_route":
            return await this.planRoute(
              request.params.arguments.cities,
              request.params.arguments.duration,
              request.params.arguments.interests
            );
          case "compare_cities":
            return await this.compareCities(
              request.params.arguments.cities,
              request.params.arguments.criteria
            );
          case "get_regional_info":
            return await this.getRegionalInfo(request.params.arguments.region);
          default:
            throw new Error(`Herramienta desconocida: ${request.params.name}`);
        }
      } catch (error) {
        console.error(`❌ Error en herramienta ${request.params.name}:`, error.message);
        throw error;
      }
    });

    // Lista de recursos disponibles
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "colombia://cities/complete",
            name: "Información Completa de Ciudades Colombianas",
            description: "Base de datos completa con información detallada de las 10 principales ciudades de Colombia",
            mimeType: "application/json"
          },
          {
            uri: "colombia://regions",
            name: "Regiones de Colombia",
            description: "Información sobre las regiones geográficas y culturales de Colombia",
            mimeType: "application/json"
          },
          {
            uri: "colombia://travel-guide",
            name: "Guía de Viaje Colombia",
            description: "Guía completa para planificar viajes por Colombia",
            mimeType: "text/markdown"
          },
          {
            uri: "colombia://gastronomy",
            name: "Gastronomía Colombiana por Regiones",
            description: "Platos típicos y especialidades culinarias por región",
            mimeType: "application/json"
          }
        ]
      };
    });

    // Lectura de recursos
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      switch (request.params.uri) {
        case "colombia://cities/complete":
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
                mimeType: "application/json",
                text: JSON.stringify({
                  "Andina": {
                    cities: ["Bogotá", "Medellín", "Bucaramanga", "Manizales", "Pereira", "Pasto"],
                    characteristics: "Región montañosa con clima templado y frío",
                    economy: "Centro económico e industrial del país"
                  },
                  "Caribe": {
                    cities: ["Barranquilla", "Cartagena", "Santa Marta"],
                    characteristics: "Región costera con clima tropical cálido",
                    economy: "Turismo, puertos y industria"
                  },
                  "Pacífica": {
                    cities: ["Cali"],
                    characteristics: "Región costera del Pacífico con alta biodiversidad",
                    economy: "Industria azucarera y puerto de Buenaventura"
                  }
                }, null, 2)
              }
            ]
          };
        case "colombia://travel-guide":
          return {
            contents: [
              {
                uri: request.params.uri,
                mimeType: "text/markdown",
                text: `# Guía de Viaje por Colombia 🇨🇴

## Mejores Épocas para Viajar

### Temporada Seca (Diciembre - Marzo, Julio - Agosto)
- Ideal para turismo en general
- Menos lluvia en la mayoría del país
- Temporada alta: precios más elevados

### Temporada de Lluvias (Abril - Junio, Septiembre - Noviembre)
- Paisajes más verdes
- Menos turistas, mejores precios
- Ideal para observación de flora y fauna

## Documentos Necesarios
- Pasaporte vigente (para extranjeros)
- Cédula de ciudadanía (para colombianos)
- Certificado de vacuna contra fiebre amarilla (algunas regiones)

## Consejos de Seguridad
- Mantener copias de documentos importantes
- No mostrar objetos de valor
- Usar transporte oficial y recomendado
- Informarse sobre la situación local actual

## Transporte
- **Avión**: Conexiones entre principales ciudades
- **Bus**: Red extensa y económica
- **Metro**: Solo en Medellín
- **Taxi/Uber**: Disponible en ciudades principales

## Moneda y Pagos
- Peso Colombiano (COP)
- Tarjetas de crédito ampliamente aceptadas
- Efectivo recomendado para compras pequeñas
`
              }
            ]
          };
        case "colombia://gastronomy":
          const gastronomy = {};
          Object.entries(COLOMBIA_CITIES).forEach(([key, city]) => {
            if (!gastronomy[city.region]) {
              gastronomy[city.region] = {};
            }
            gastronomy[city.region][city.name] = city.gastronomy;
          });
          return {
            contents: [
              {
                uri: request.params.uri,
                mimeType: "application/json",
                text: JSON.stringify(gastronomy, null, 2)
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
            name: "travel_itinerary",
            description: "Genera un itinerario de viaje detallado para ciudades colombianas",
            arguments: [
              {
                name: "cities",
                description: "Ciudades a visitar (separadas por comas)",
                required: true
              },
              {
                name: "days",
                description: "Número de días del viaje",
                required: true
              },
              {
                name: "budget",
                description: "Presupuesto aproximado (bajo, medio, alto)",
                required: false
              }
            ]
          },
          {
            name: "cultural_experience",
            description: "Recomienda experiencias culturales auténticas en una ciudad",
            arguments: [
              {
                name: "city",
                description: "Ciudad colombiana",
                required: true
              },
              {
                name: "interests",
                description: "Intereses culturales específicos",
                required: false
              }
            ]
          },
          {
            name: "weather_travel_advice",
            description: "Consejos de viaje basados en el clima actual",
            arguments: [
              {
                name: "cities",
                description: "Ciudades a consultar",
                required: true
              },
              {
                name: "season",
                description: "Época del año del viaje",
                required: false
              }
            ]
          }
        ]
      };
    });

    // Obtención de prompts
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      switch (request.params.name) {
        case "travel_itinerary":
          const cities = request.params.arguments?.cities;
          const days = request.params.arguments?.days;
          const budget = request.params.arguments?.budget || "medio";
          
          if (!cities || !days) {
            throw new Error("Debe proporcionar ciudades y número de días.");
          }
          
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Crea un itinerario detallado de ${days} días para visitar las siguientes ciudades de Colombia: ${cities}. Considera un presupuesto ${budget}. Incluye recomendaciones de alojamiento, restaurantes, atracciones principales, transporte entre ciudades, y actividades día a día. También incluye consejos sobre qué empacar según el clima de cada destino.`
                }
              }
            ]
          };

        case "cultural_experience":
          const city = request.params.arguments?.city;
          const interests = request.params.arguments?.interests || "cultura general";
          
          if (!city) {
            throw new Error("Debe especificar una ciudad.");
          }
          
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Recomienda experiencias culturales auténticas en ${city}, Colombia, enfocándose en ${interests}. Incluye festivales locales, tradiciones, sitios históricos, museos, gastronomía típica, artesanías locales, y oportunidades de interacción con la comunidad local. Proporciona también información sobre horarios, costos aproximados y consejos para una experiencia más enriquecedora.`
                }
              }
            ]
          };

        case "weather_travel_advice":
          const weatherCities = request.params.arguments?.cities;
          const season = request.params.arguments?.season || "actual";
          
          if (!weatherCities) {
            throw new Error("Debe especificar las ciudades.");
          }
          
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Proporciona consejos detallados de viaje basados en el clima ${season} para las siguientes ciudades de Colombia: ${weatherCities}. Incluye recomendaciones sobre qué ropa llevar, mejores actividades según el clima, precauciones especiales, y la mejor época para visitar cada destino. También menciona cómo el clima puede afectar el transporte y las actividades al aire libre.`
                }
              }
            ]
          };

        default:
          throw new Error(`Prompt no encontrado: ${request.params.name}`);
      }
    });
  }

  // Implementación de métodos de herramientas
  async getCityInfo(cityKey, includeWeather = true) {
    const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
    if (!city) {
      throw new Error(`Ciudad no encontrada: ${cityKey}`);
    }

    let weatherInfo = "";
    if (includeWeather && OPENWEATHER_API_KEY) {
      try {
        const weatherData = await this.getWeatherData(cityKey);
        weatherInfo = `\n🌤️ **Clima Actual:**
- Temperatura: ${weatherData.main.temp}°C (Sensación: ${weatherData.main.feels_like}°C)
- Condición: ${weatherData.weather[0].description}
- Humedad: ${weatherData.main.humidity}%\n`;
      } catch (error) {
        weatherInfo = "\n🌤️ **Clima:** No disponible en este momento\n";
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `🏙️ **${city.name} - ${city.department}**

📍 **Información General:**
- **Región:** ${city.region}
- **Altitud:** ${city.altitude}m sobre el nivel del mar
- **Población:** ${city.population.toLocaleString()} habitantes
- **Fundada:** ${city.founded}
- **Descripción:** ${city.description}${weatherInfo}

🎯 **Principales Atracciones:**
${city.attractions.map(attraction => `• ${attraction}`).join('\n')}

🍽️ **Gastronomía Típica:**
${city.gastronomy.map(dish => `• ${dish}`).join('\n')}

🎉 **Eventos y Festivales:**
${city.events.map(event => `• ${event}`).join('\n')}

📍 **Coordenadas:** ${city.lat}, ${city.lon}

💡 **Recomendación:** ${this.getTravelRecommendation(city)}`
        }
      ]
    };
  }

  async getWeather(cityKey) {
    try {
      const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
      if (!city) {
        throw new Error(`Ciudad no encontrada: ${cityKey}`);
      }

      const data = await this.getWeatherData(cityKey);
      
      return {
        content: [
          {
            type: "text",
            text: `🌤️ **Clima actual en ${city.name}, Colombia:**

📊 **Condiciones Generales:**
- **Condición:** ${data.weather[0].description}
- **Temperatura:** ${data.main.temp}°C (Sensación térmica: ${data.main.feels_like}°C)
- **Mín/Máx:** ${data.main.temp_min}°C / ${data.main.temp_max}°C

💧 **Humedad y Presión:**
- **Humedad:** ${data.main.humidity}%
- **Presión:** ${data.main.pressure} hPa

🌬️ **Viento:**
- **Velocidad:** ${data.wind?.speed || 'N/A'} m/s
- **Dirección:** ${data.wind?.deg || 'N/A'}°

☁️ **Nubosidad:** ${data.clouds.all}%

🌅 **Sol:**
- **Amanecer:** ${new Date(data.sys.sunrise * 1000).toLocaleTimeString('es-CO')}
- **Atardecer:** ${new Date(data.sys.sunset * 1000).toLocaleTimeString('es-CO')}

⏰ **Última actualización:** ${new Date(data.dt * 1000).toLocaleString('es-CO')}

🧳 **Recomendación de vestimenta:** ${this.getClothingRecommendation(data.main.temp, city.altitude)}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Error al obtener el clima: ${error.message}`);
    }
  }

  async getWeatherData(cityKey) {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("API Key de OpenWeatherMap no configurada");
    }

    const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
    const url = `${WEATHER_BASE_URL}/weather?lat=${city.lat}&lon=${city.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
    return await this.makeApiRequest(url);
  }

  async getAttractions(cityKey, category = "all") {
    const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
    if (!city) {
      throw new Error(`Ciudad no encontrada: ${cityKey}`);
    }

    let filteredAttractions = city.attractions;
    
    // Filtrar por categoría si se especifica
    if (category && category !== "all") {
      // Aquí podrías implementar filtrado por categorías específicas
      // Por ahora, mostraremos todas las atracciones
    }

    return {
      content: [
        {
          type: "text",
          text: `🎯 **Principales atracciones en ${city.name}:**

${filteredAttractions.map((attraction, index) => 
  `${index + 1}. **${attraction}**`
).join('\n')}

📍 **Información adicional:**
- **Región:** ${city.region}
- **Mejor época para visitar:** ${this.getBestTimeToVisit(city)}
- **Tiempo recomendado:** ${this.getRecommendedStay(city)} días

💡 **Consejo local:** ${this.getLocalTip(city)}`
        }
      ]
    };
  }

  async planRoute(cities, duration = 7, interests = []) {
    if (!cities || cities.length === 0) {
      throw new Error("Debe proporcionar al menos una ciudad");
    }

    const validCities = cities.filter(cityKey => COLOMBIA_CITIES[cityKey.toLowerCase()]);
    if (validCities.length === 0) {
      throw new Error("No se encontraron ciudades válidas");
    }

    const daysPerCity = Math.max(1, Math.floor(duration / validCities.length));
    let route = `🗺️ **Plan de Ruta por Colombia (${duration} días)**\n\n`;
    
    let currentDay = 1;
    
    for (let i = 0; i < validCities.length; i++) {
      const cityKey = validCities[i];
      const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
      const cityDays = i === validCities.length - 1 ? 
        (duration - currentDay + 1) : daysPerCity;
      
      route += `## 📍 ${city.name} (Días ${currentDay}-${currentDay + cityDays - 1})\n\n`;
      route += `**Región:** ${city.region} | **Altitud:** ${city.altitude}m\n\n`;
      
      // Recomendaciones basadas en intereses
      const recommendations = this.getRecommendationsByInterests(city, interests);
      route += `**Actividades recomendadas:**\n${recommendations}\n\n`;
      
      // Gastronomía
      route += `**Gastronomía imperdible:**\n`;
      route += `${city.gastronomy.slice(0, 3).map(dish => `• ${dish}`).join('\n')}\n\n`;
      
      // Transporte al siguiente destino
      if (i < validCities.length - 1) {
        const nextCity = COLOMBIA_CITIES[validCities[i + 1].toLowerCase()];
        route += `🚌 **Transporte a ${nextCity.name}:** ${this.getTransportInfo(city, nextCity)}\n\n`;
      }
      
      currentDay += cityDays;
    }
    
    route += `\n💰 **Presupuesto estimado:** ${this.getEstimatedBudget(validCities, duration)}\n`;
    route += `🧳 **Qué empacar:** ${this.getPackingRecommendations(validCities)}`;

    return {
      content: [
        {
          type: "text",
          text: route
        }
      ]
    };
  }

  async compareCities(cities, criteria = []) {
    if (!cities || cities.length < 2) {
      throw new Error("Debe proporcionar al menos 2 ciudades para comparar");
    }

    const validCities = cities.filter(cityKey => COLOMBIA_CITIES[cityKey.toLowerCase()]);
    if (validCities.length < 2) {
      throw new Error("Se necesitan al menos 2 ciudades válidas");
    }

    let comparison = `📊 **Comparación de Ciudades Colombianas**\n\n`;
    
    // Información básica
    comparison += `| Ciudad | Región | Altitud | Población |\n`;
    comparison += `|--------|--------|---------|----------|\n`;
    validCities.forEach(cityKey => {
      const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
      comparison += `| ${city.name} | ${city.region} | ${city.altitude}m | ${city.population.toLocaleString()} |\n`;
    });
    
    comparison += `\n`;
    
    // Comparaciones específicas por criterio
    if (criteria.includes('clima') || criteria.length === 0) {
      comparison += `## 🌤️ Clima\n`;
      for (const cityKey of validCities) {
        const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
        comparison += `**${city.name}:** ${this.getClimateDescription(city)}\n`;
      }
      comparison += `\n`;
    }
    
    if (criteria.includes('atracciones') || criteria.length === 0) {
      comparison += `## 🎯 Principales Atracciones\n`;
      validCities.forEach(cityKey => {
        const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
        comparison += `**${city.name}:** ${city.attractions.slice(0, 3).join(', ')}\n`;
      });
      comparison += `\n`;
    }
    
    if (criteria.includes('gastronomia') || criteria.length === 0) {
      comparison += `## 🍽️ Gastronomía\n`;
      validCities.forEach(cityKey => {
        const city = COLOMBIA_CITIES[cityKey.toLowerCase()];
        comparison += `**${city.name}:** ${city.gastronomy.slice(0, 3).join(', ')}\n`;
      });
      comparison += `\n`;
    }
    
    comparison += `\n💡 **Recomendación:** ${this.getBestCityRecommendation(validCities)}`;

    return {
      content: [
        {
          type: "text",
          text: comparison
        }
      ]
    };
  }

  async getRegionalInfo(region) {
    const regionCities = Object.entries(COLOMBIA_CITIES)
      .filter(([key, city]) => city.region === region)
      .map(([key, city]) => city);

    if (regionCities.length === 0) {
      throw new Error(`Región no encontrada o sin ciudades: ${region}`);
    }

    let regionInfo = `🌎 **Región ${region} de Colombia**\n\n`;
    
    regionInfo += `**Ciudades principales:** ${regionCities.map(city => city.name).join(', ')}\n\n`;
    
    regionInfo += `**Características generales:**\n${this.getRegionalCharacteristics(region)}\n\n`;
    
    regionInfo += `**Ciudades por población:**\n`;
    regionCities
      .sort((a, b) => b.population - a.population)
      .forEach((city, index) => {
        regionInfo += `${index + 1}. ${city.name}: ${city.population.toLocaleString()} habitantes\n`;
      });
    
    regionInfo += `\n**Gastronomía regional:**\n`;
    const regionalDishes = [...new Set(regionCities.flatMap(city => city.gastronomy))];
    regionInfo += regionalDishes.slice(0, 8).map(dish => `• ${dish}`).join('\n');
    
    regionInfo += `\n\n**Eventos destacados:**\n`;
    const regionalEvents = [...new Set(regionCities.flatMap(city => city.events))];
    regionInfo += regionalEvents.slice(0, 6).map(event => `• ${event}`).join('\n');

    return {
      content: [
        {
          type: "text",
          text: regionInfo
        }
      ]
    };
  }

  // Métodos auxiliares
  getTravelRecommendation(city) {
    const recommendations = {
      "Bogotá": "Ideal para turismo cultural e histórico. Llevar ropa abrigada por el clima frío.",
      "Medellín": "Perfecta para el turismo urbano e innovación. Clima templado todo el año.",
      "Cali": "Destino perfecto para amantes de la salsa y la vida nocturna.",
      "Cartagena": "Imperdible para historia colonial y playas. Llevar ropa fresca.",
      "Barranquilla": "Visitarla durante el Carnaval para la experiencia completa.",
      "Santa Marta": "Base perfecta para explorar el Tayrona y la Sierra Nevada.",
      "Bucaramanga": "Excelente para ecoturismo y deportes extremos.",
      "Pereira": "Puerta de entrada al Eje Cafetero, ideal para turismo rural.",
      "Manizales": "Perfecta para los amantes del café y la arquitectura.",
      "Pasto": "Visitarla en enero para el famoso Carnaval de Negros y Blancos."
    };
    return recommendations[city.name] || "Una ciudad hermosa para descubrir.";
  }

  getClothingRecommendation(temp, altitude) {
    if (altitude > 2000 || temp < 15) {
      return "Ropa abrigada, chaqueta y pantalón largo. Puede hacer frío especialmente en las noches.";
    } else if (temp > 25) {
      return "Ropa fresca y ligera, protector solar y sombrero. Mantenerse hidratado.";
    } else {
      return "Ropa cómoda, una chaqueta ligera para las noches. Clima muy agradable.";
    }
  }

  getBestTimeToVisit(city) {
    if (city.region === "Caribe") {
      return "Diciembre a marzo (temporada seca)";
    } else if (city.region === "Andina") {
      return "Diciembre a febrero y julio a agosto";
    } else {
      return "Diciembre a marzo";
    }
  }

  getRecommendedStay(city) {
    const stayDays = {
      "Bogotá": 3,
      "Medellín": 3,
      "Cartagena": 4,
      "Cali": 2,
      "Santa Marta": 4,
      "Barranquilla": 2,
      "Bucaramanga": 2,
      "Pereira": 3,
      "Manizales": 2,
      "Pasto": 2
    };
    return stayDays[city.name] || 2;
  }

  getLocalTip(city) {
    const tips = {
      "Bogotá": "Usa el TransMilenio para moverte por la ciudad y visita La Candelaria caminando.",
      "Medellín": "Aprovecha el Metro y Metrocable para llegar a diferentes puntos de la ciudad.",
      "Cartagena": "Las mejores fotos son al atardecer desde las murallas.",
      "Cali": "No te pierdas una clase de salsa en el barrio San Antonio.",
      "Santa Marta": "Madruga para entrar al Tayrona y evitar multitudes.",
      "Barranquilla": "El mejor ambiente está en la Via 40 y la Zona Rosa.",
      "Bucaramanga": "Prueba las hormigas culonas, son una delicia local única.",
      "Pereira": "Aprovecha para visitar fincas cafeteras en los alrededores.",
      "Manizales": "Sube a la Torre de Kueka para las mejores vistas panorámicas.",
      "Pasto": "No te pierdas los helados de paila del centro histórico."
    };
    return tips[city.name] || "Pregunta a los locales por recomendaciones auténticas.";
  }

  getRecommendationsByInterests(city, interests) {
    let recommendations = "";
    
    if (interests.includes('cultura') || interests.length === 0) {
      recommendations += `• **Cultural:** ${city.attractions.filter(a => 
        a.includes('Museo') || a.includes('Teatro') || a.includes('Centro Histórico')
      ).slice(0, 2).join(', ') || city.attractions[0]}\n`;
    }
    
    if (interests.includes('naturaleza')) {
      recommendations += `• **Naturaleza:** ${city.attractions.filter(a => 
        a.includes('Parque') || a.includes('Cerro') || a.includes('Jardín')
      ).slice(0, 2).join(', ') || 'Espacios verdes de la ciudad'}\n`;
    }
    
    if (interests.includes('gastronomia') || interests.length === 0) {
      recommendations += `• **Gastronomía:** ${city.gastronomy.slice(0, 2).join(', ')}\n`;
    }
    
    return recommendations || `• ${city.attractions.slice(0, 3).join('\n• ')}`;
  }

  getTransportInfo(cityFrom, cityTo) {
    return `Bus intermunicipal (8-12 horas aprox.) o vuelo doméstico (1-2 horas)`;
  }

  getEstimatedBudget(cities, days) {
    const budgetPerDay = cities.length * 50; // USD aprox por día
    const total = budgetPerDay * days;
    return `$${total}-${total * 1.5} USD (incluyendo alojamiento, comida y transporte local)`;
  }

  getPackingRecommendations(cities) {
    const regions = [...new Set(cities.map(cityKey => 
      COLOMBIA_CITIES[cityKey.toLowerCase()].region
    ))];
    
    let packing = "Ropa cómoda para caminar, ";
    
    if (regions.includes('Caribe')) {
      packing += "ropa fresca y de playa, protector solar, ";
    }
    if (regions.includes('Andina')) {
      packing += "ropa abrigada para las noches, chaqueta impermeable, ";
    }
    
    packing += "zapatos cómodos, cámara, documentos en orden.";
    
    return packing;
  }

  getClimateDescription(city) {
    if (city.region === "Caribe") {
      return "Clima tropical cálido y húmedo, temperatura promedio 28-32°C";
    } else if (city.altitude > 2000) {
      return "Clima frío de montaña, temperatura promedio 10-18°C";
    } else if (city.altitude > 1000) {
      return "Clima templado de montaña, temperatura promedio 18-24°C";
    } else {
      return "Clima cálido, temperatura promedio 24-30°C";
    }
  }

  getBestCityRecommendation(cities) {
    if (cities.includes('cartagena')) {
      return "Cartagena es ideal para una primera visita por su historia y belleza colonial.";
    } else if (cities.includes('medellin')) {
      return "Medellín ofrece la mejor combinación de clima, cultura y modernidad.";
    } else {
      return "Todas son ciudades increíbles, elige según tus intereses específicos.";
    }
  }

  getRegionalCharacteristics(region) {
    const characteristics = {
      "Andina": "Región montañosa con clima templado y frío, centro económico e industrial del país, rica en cultura cafetera y tradiciones coloniales.",
      "Caribe": "Región costera con clima tropical cálido, rica en cultura afrocaribeña, música vallenata y tradiciones carnavalescas.",
      "Pacífica": "Región costera del Pacífico con alta biodiversidad, cultura afrocolombiana y tradiciones musicales únicas.",
      "Amazónica": "Región selvática con la mayor biodiversidad del país, hogar de comunidades indígenas.",
      "Orinoquía": "Región de llanos orientales, cultura llanera y ganadería."
    };
    return characteristics[region] || "Región con características únicas de Colombia.";
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("🇨🇴 MCP Server Ciudades Colombia iniciado correctamente");
  }
}

const server = new CiudadesColombiaServer();
server.run().catch(console.error);
