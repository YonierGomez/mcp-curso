#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * Simple MCP Server for testing the client
 * This server provides basic math operations and utility tools
 */

class SimpleMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'simple-mcp-server',
        version: '1.0.0',
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
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'add',
            description: 'Add two numbers together',
            inputSchema: {
              type: 'object',
              properties: {
                a: { type: 'number', description: 'First number' },
                b: { type: 'number', description: 'Second number' },
              },
              required: ['a', 'b'],
            },
          },
          {
            name: 'multiply',
            description: 'Multiply two numbers',
            inputSchema: {
              type: 'object',
              properties: {
                a: { type: 'number', description: 'First number' },
                b: { type: 'number', description: 'Second number' },
              },
              required: ['a', 'b'],
            },
          },
          {
            name: 'echo',
            description: 'Echo back the input message',
            inputSchema: {
              type: 'object',
              properties: {
                message: { type: 'string', description: 'Message to echo' },
              },
              required: ['message'],
            },
          },
          {
            name: 'current-time',
            description: 'Get the current date and time',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'file:///example.txt',
            name: 'Example Text File',
            description: 'A sample text resource',
            mimeType: 'text/plain',
          },
          {
            uri: 'config://server-info',
            name: 'Server Information',
            description: 'Information about this MCP server',
            mimeType: 'application/json',
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'add':
          const sum = args.a + args.b;
          return {
            content: [
              {
                type: 'text',
                text: `The sum of ${args.a} and ${args.b} is ${sum}`,
              },
            ],
          };

        case 'multiply':
          const product = args.a * args.b;
          return {
            content: [
              {
                type: 'text',
                text: `The product of ${args.a} and ${args.b} is ${product}`,
              },
            ],
          };

        case 'echo':
          return {
            content: [
              {
                type: 'text',
                text: `Echo: ${args.message}`,
              },
            ],
          };

        case 'current-time':
          const now = new Date().toISOString();
          return {
            content: [
              {
                type: 'text',
                text: `Current time: ${now}`,
              },
            ],
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'file:///example.txt':
          return {
            contents: [
              {
                uri: 'file:///example.txt',
                mimeType: 'text/plain',
                text: `¡Hola! Este es un archivo de ejemplo.

Este archivo contiene:
- Texto de muestra para demostrar los Resources
- Información sobre cómo funciona MCP
- Datos que puedes leer desde el cliente

Fecha de creación: ${new Date().toISOString()}
Servidor: Simple MCP Server v1.0.0

¡Los Resources son geniales para compartir datos!`,
              },
            ],
          };

        case 'config://server-info':
          return {
            contents: [
              {
                uri: 'config://server-info',
                mimeType: 'application/json',
                text: JSON.stringify({
                  serverName: 'Simple MCP Server',
                  version: '1.0.0',
                  capabilities: ['tools', 'resources'],
                  toolsCount: 4,
                  resourcesCount: 2,
                  status: 'running',
                  uptime: process.uptime(),
                  nodeVersion: process.version,
                  platform: process.platform,
                  availableTools: ['add', 'multiply', 'echo', 'current-time'],
                  availableResources: ['file:///example.txt', 'config://server-info'],
                }, null, 2),
              },
            ],
          };

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'code_review',
            description: 'Template for conducting code reviews',
            arguments: [
              {
                name: 'code',
                description: 'The code to review',
                required: true,
              },
              {
                name: 'language',
                description: 'Programming language',
                required: false,
              },
            ],
          },
          {
            name: 'email_template',
            description: 'Professional email template',
            arguments: [
              {
                name: 'recipient',
                description: 'Email recipient',
                required: true,
              },
              {
                name: 'subject',
                description: 'Email subject',
                required: true,
              },
              {
                name: 'tone',
                description: 'Email tone (formal/casual)',
                required: false,
              },
            ],
          },
          {
            name: 'bug_report',
            description: 'Bug report template',
            arguments: [
              {
                name: 'title',
                description: 'Bug title',
                required: true,
              },
              {
                name: 'severity',
                description: 'Bug severity level',
                required: false,
              },
            ],
          },
        ],
      };
    });

    // Handle prompt requests
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'code_review':
          const language = args?.language || 'unknown';
          const code = args?.code || '[No code provided]';
          return {
            description: `Code review template for ${language}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Por favor, revisa el siguiente código ${language} y proporciona:

1. 🔍 **Análisis de Calidad:**
   - Problemas de lógica
   - Posibles bugs
   - Problemas de rendimiento

2. 🛡️ **Seguridad:**
   - Vulnerabilidades potenciales
   - Validaciones faltantes
   - Mejores prácticas de seguridad

3. 📚 **Mejores Prácticas:**
   - Convenciones de código
   - Legibilidad y mantenibilidad
   - Patrones recomendados

4. 🧪 **Testing:**
   - Casos de prueba sugeridos
   - Cobertura recomendada

**Código a revisar:**
\`\`\`${language}
${code}
\`\`\`

Por favor, sé específico en tus recomendaciones.`,
                },
              },
            ],
          };

        case 'email_template':
          const recipient = args?.recipient || '[Destinatario]';
          const subject = args?.subject || '[Asunto]';
          const tone = args?.tone || 'formal';
          return {
            description: `Professional email template (${tone} tone)`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Redacta un email profesional con estas especificaciones:

**Destinatario:** ${recipient}
**Asunto:** ${subject}
**Tono:** ${tone}

**Estructura requerida:**
1. Saludo apropiado
2. Contexto/introducción
3. Mensaje principal
4. Llamada a la acción (si aplica)
5. Cierre profesional
6. Firma

**Consideraciones:**
- Mantén un tono ${tone}
- Sé claro y conciso
- Incluye los elementos necesarios según el contexto
- Usa un formato profesional

Por favor, genera el email completo.`,
                },
              },
            ],
          };

        case 'bug_report':
          const title = args?.title || '[Título del Bug]';
          const severity = args?.severity || 'medium';
          return {
            description: `Bug report template for: ${title}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Crea un reporte detallado de bug con la siguiente información:

**🐛 Título:** ${title}
**⚠️ Severidad:** ${severity}

**Estructura del reporte:**

## 📋 Descripción
- Descripción clara y concisa del problema

## 🔄 Pasos para Reproducir
1. Paso 1
2. Paso 2
3. Paso 3

## ✅ Comportamiento Esperado
- Qué debería pasar normalmente

## ❌ Comportamiento Actual
- Qué está pasando en realidad

## 🌐 Entorno
- OS: 
- Browser/App:
- Versión:

## 📷 Evidencia
- Screenshots, logs, o videos si aplica

## 🔧 Información Adicional
- Contexto relevante
- Workarounds temporales
- Impacto en usuarios

Por favor, completa cada sección con información específica.`,
                },
              },
            ],
          };

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Simple MCP Server started'); // Use stderr so it doesn't interfere with MCP communication
  }
}

// Start the server
const server = new SimpleMCPServer();
server.start().catch(console.error);
