#!/usr/bin/env node

import axios from 'axios';

const API_KEY = "e189791e25217c29bec584e9471f82b8";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function testAPI() {
  console.log("🌐 Probando conexión directa con OpenWeatherMap API...\n");
  
  try {
    // Probar con Bogotá
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: 4.7110,
        lon: -74.0721,
        appid: API_KEY,
        units: 'metric',
        lang: 'es'
      }
    });
    
    const data = response.data;
    
    console.log("✅ Conexión exitosa con la API de OpenWeatherMap");
    console.log(`📍 Ciudad: ${data.name}`);
    console.log(`🌡️ Temperatura: ${data.main.temp}°C`);
    console.log(`🌤️ Condición: ${data.weather[0].description}`);
    console.log(`💧 Humedad: ${data.main.humidity}%`);
    
    console.log("\n🎉 La API está respondiendo correctamente!");
    
  } catch (error) {
    console.log("❌ Error al conectar con la API:", error.message);
    if (error.response) {
      console.log("Código de estado:", error.response.status);
      console.log("Respuesta:", error.response.data);
    }
  }
}

testAPI();
