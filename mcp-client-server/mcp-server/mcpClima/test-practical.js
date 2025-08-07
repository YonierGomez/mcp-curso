#!/usr/bin/env node

import { spawn } from 'child_process';

const API_KEY = "e189791e25217c29bec584e9471f82b8";

console.log("🧪 Prueba práctica del MCP Server Clima Colombia\n");

const serverProcess = spawn('node', ['index.js'], {
  env: { ...process.env, OPENWEATHER_API_KEY: API_KEY },
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverReady = false;

// Esperar a que el servidor esté listo
serverProcess.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes("MCP Server Clima Colombia iniciado correctamente")) {
    serverReady = true;
    console.log("✅ Servidor iniciado, enviando pruebas...\n");
    
    // Prueba 1: Obtener clima actual de Bogotá
    testGetWeather();
  }
});

function testGetWeather() {
  console.log("🌤️ Prueba 1: Obtener clima actual de Bogotá");
  
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "get_weather",
      arguments: {
        city: "bogota"
      }
    }
  };
  
  serverProcess.stdin.write(JSON.stringify(request) + '\n');
}

let responseCount = 0;

serverProcess.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      
      if (response.result && response.result.content) {
        responseCount++;
        console.log(`✅ Respuesta ${responseCount} recibida:`);
        console.log(response.result.content[0].text.substring(0, 200) + "...\n");
        
        if (responseCount === 1) {
          // Prueba 2: Obtener pronóstico
          testGetForecast();
        } else if (responseCount === 2) {
          // Prueba 3: Comparar múltiples ciudades
          testMultipleCities();
        } else if (responseCount === 3) {
          console.log("🎉 ¡Todas las pruebas completadas exitosamente!");
          serverProcess.kill();
          process.exit(0);
        }
      }
    } catch (e) {
      // Ignorar líneas que no son JSON válido
    }
  });
});

function testGetForecast() {
  console.log("🔮 Prueba 2: Obtener pronóstico de Medellín");
  
  const request = {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "get_forecast",
      arguments: {
        city: "medellin"
      }
    }
  };
  
  serverProcess.stdin.write(JSON.stringify(request) + '\n');
}

function testMultipleCities() {
  console.log("🌍 Prueba 3: Comparar clima de múltiples ciudades");
  
  const request = {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "get_multiple_cities_weather",
      arguments: {
        cities: ["bogota", "cali", "cartagena"]
      }
    }
  };
  
  serverProcess.stdin.write(JSON.stringify(request) + '\n');
}

// Timeout de seguridad
setTimeout(() => {
  console.log("⚠️ Timeout - terminando pruebas");
  serverProcess.kill();
  process.exit(1);
}, 30000);
