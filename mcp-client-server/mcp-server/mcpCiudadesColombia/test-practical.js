#!/usr/bin/env node

// Test práctico completo del MCP Server
import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🧪 Tests Prácticos del MCP Server Ciudades Colombia\n");

// Configuración de tests
const tests = [
  {
    name: "Lista de Herramientas",
    request: {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list"
    }
  },
  {
    name: "Información de Medellín",
    request: {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "get_city_info",
        arguments: {
          city: "medellin",
          include_weather: true
        }
      }
    }
  },
  {
    name: "Clima de Bogotá",
    request: {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "get_weather",
        arguments: {
          city: "bogota"
        }
      }
    }
  },
  {
    name: "Atracciones de Cartagena",
    request: {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "get_attractions",
        arguments: {
          city: "cartagena",
          category: "all"
        }
      }
    }
  },
  {
    name: "Plan de Ruta: Medellín → Cartagena → Bogotá",
    request: {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "plan_route",
        arguments: {
          cities: ["medellin", "cartagena", "bogota"],
          duration: 8,
          interests: ["cultura", "gastronomia"]
        }
      }
    }
  },
  {
    name: "Comparar Ciudades Caribeñas",
    request: {
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: {
        name: "compare_cities",
        arguments: {
          cities: ["barranquilla", "cartagena", "santa_marta"],
          criteria: ["clima", "atracciones"]
        }
      }
    }
  },
  {
    name: "Información Regional Andina",
    request: {
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: {
        name: "get_regional_info",
        arguments: {
          region: "Andina"
        }
      }
    }
  },
  {
    name: "Lista de Recursos",
    request: {
      jsonrpc: "2.0",
      id: 8,
      method: "resources/list"
    }
  },
  {
    name: "Leer Recurso: Ciudades Completas",
    request: {
      jsonrpc: "2.0",
      id: 9,
      method: "resources/read",
      params: {
        uri: "colombia://cities/complete"
      }
    }
  },
  {
    name: "Lista de Prompts",
    request: {
      jsonrpc: "2.0",
      id: 10,
      method: "prompts/list"
    }
  },
  {
    name: "Prompt: Itinerario de Viaje",
    request: {
      jsonrpc: "2.0",
      id: 11,
      method: "prompts/get",
      params: {
        name: "travel_itinerary",
        arguments: {
          cities: "Medellín, Cartagena",
          days: "6",
          budget: "medio"
        }
      }
    }
  }
];

async function runTest(test, serverProcess) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Ejecutando: ${test.name}`);
    
    const requestString = JSON.stringify(test.request) + '\n';
    
    let responseBuffer = '';
    let timeout;
    
    const onData = (data) => {
      responseBuffer += data.toString();
      
      // Verificar si tenemos una respuesta JSON completa
      try {
        const lines = responseBuffer.split('\n').filter(line => line.trim());
        for (const line of lines) {
          const response = JSON.parse(line);
          if (response.id === test.request.id) {
            clearTimeout(timeout);
            serverProcess.stdout.removeListener('data', onData);
            
            if (response.error) {
              console.log(`   ❌ Error: ${response.error.message}`);
              resolve({ success: false, error: response.error });
            } else {
              console.log(`   ✅ Exitoso`);
              if (response.result && response.result.content) {
                console.log(`   📝 Respuesta recibida (${response.result.content.length} items)`);
              } else if (response.result && response.result.tools) {
                console.log(`   🛠️ ${response.result.tools.length} herramientas disponibles`);
              } else if (response.result && response.result.resources) {
                console.log(`   📚 ${response.result.resources.length} recursos disponibles`);
              } else if (response.result && response.result.prompts) {
                console.log(`   💬 ${response.result.prompts.length} prompts disponibles`);
              } else {
                console.log(`   📋 Respuesta estructurada recibida`);
              }
              resolve({ success: true, result: response.result });
            }
            return;
          }
        }
      } catch (e) {
        // Continuar esperando más datos
      }
    };
    
    serverProcess.stdout.on('data', onData);
    
    timeout = setTimeout(() => {
      serverProcess.stdout.removeListener('data', onData);
      console.log(`   ⏰ Timeout en test: ${test.name}`);
      resolve({ success: false, error: 'Timeout' });
    }, 10000);
    
    serverProcess.stdin.write(requestString);
  });
}

async function runPracticalTests() {
  console.log("🚀 Iniciando servidor MCP...");
  
  const serverProcess = spawn('node', ['index.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_ENV: 'test'
    }
  });
  
  let serverReady = false;
  
  // Esperar a que el servidor esté listo
  await new Promise((resolve) => {
    serverProcess.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('MCP Server Ciudades Colombia iniciado correctamente')) {
        console.log("✅ Servidor iniciado correctamente\n");
        serverReady = true;
        resolve();
      }
    });
    
    setTimeout(() => {
      if (!serverReady) {
        console.log("⚠️ Servidor tardando en iniciar, continuando con tests...\n");
        resolve();
      }
    }, 3000);
  });
  
  // Ejecutar todos los tests
  const results = [];
  for (const test of tests) {
    const result = await runTest(test, serverProcess);
    results.push({
      name: test.name,
      ...result
    });
    
    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Finalizar servidor
  serverProcess.kill();
  
  // Mostrar resumen
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMEN DE TESTS");
  console.log("=".repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Tests exitosos: ${successful}`);
  console.log(`❌ Tests fallidos: ${failed}`);
  console.log(`📊 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log("\n❌ Tests fallidos:");
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error || 'Error desconocido'}`);
    });
  }
  
  console.log("\n" + "=".repeat(60));
  
  if (failed === 0) {
    console.log("🎉 ¡Todos los tests pasaron exitosamente!");
    console.log("🚀 El MCP Server está funcionando correctamente.");
  } else {
    console.log("⚠️ Algunos tests fallaron. Revisar configuración.");
    process.exit(1);
  }
}

// Ejecutar tests
runPracticalTests().catch(error => {
  console.error("💥 Error fatal en tests:", error);
  process.exit(1);
});
