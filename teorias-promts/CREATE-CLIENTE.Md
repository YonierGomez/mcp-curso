# 🤖 Prompt para Crear un Cliente MCP Completo

## 📋 Prompt de Creación

```
Crea un cliente MCP (Model Context Protocol) completo en TypeScript con las siguientes especificaciones:

## Estructura del Proyecto:
- Crear un proyecto TypeScript moderno con ES modules
- Usar la última versión del SDK oficial @modelcontextprotocol/sdk
- Configuración estricta de TypeScript con target ES2022
- Incluir ESLint y Prettier para calidad de código
- Estructura de carpetas: src/, examples/, dist/

## Funcionalidades del Cliente:
1. **Conexión MCP**: 
   - Conectar a servidores MCP via stdio transport
   - Manejo robusto de errores de conexión
   - Cleanup automático de recursos

2. **Descubrimiento de Capacidades**:
   - Listar herramientas (tools) disponibles con sus esquemas
   - Listar recursos (resources) disponibles con metadata
   - Mostrar capacidades del servidor

3. **Ejecución de Herramientas**:
   - Comando 'call' para ejecutar tools con parámetros JSON
   - Validación de argumentos
   - Manejo de errores en ejecución

4. **Lectura de Recursos**:
   - Comando 'read' para leer resources por URI
   - Soporte para diferentes tipos MIME
   - Mostrar contenido formateado

5. **Gestión de Prompts**:
   - Comando 'prompts' para listar plantillas disponibles
   - Comando 'prompt' para obtener plantillas específicas
   - Soporte para argumentos parametrizables
   - Templates estructurados para tareas comunes

6. **Interfaz CLI Interactiva**:
   - Modo interactivo con readline
   - Comandos: help, tools, resources, prompts, call, read, prompt, exit
   - Prompt amigable 'mcp>'
   - Manejo de SIGTERM y cleanup

## Características Técnicas:
- TypeScript estricto con tipos personalizados (MCPTool, MCPResource, MCPPrompt)
- Manejo asíncrono con async/await
- Logging con emojis para mejor UX
- Scripts npm: dev, build, lint
- Archivos de configuración: tsconfig.json, eslint.config.js, .prettierrc

## Servidor de Ejemplo:
Incluir un servidor MCP de ejemplo (simple-server.js) con:
- 4 herramientas: add, multiply, echo, current-time
- 2 recursos: file:///example.txt, config://server-info
- 3 prompts: code_review, email_template, bug_report
- Implementación completa de handlers para tools, resources y prompts
- Contenido real y útil en recursos y plantillas

## Validación y Calidad:
- Código debe compilar sin errores TypeScript
- Pasar linting sin warnings
- Funcionalidad 100% operativa
- Documentación completa en README.md

## Uso:
- npm run dev examples/simple-server.js
- Interfaz interactiva completa
- Conexión exitosa y operaciones funcionales

Asegúrate de que todo funcione al 100% y que no haya errores de compilación o lint.
```

## 🎯 Prompt Adicional para Comprensión

```
Antes de implementar, explica brevemente:

1. ¿Qué es MCP y para qué sirve?
2. ¿Qué diferencia hay entre Tools, Resources y Prompts?
3. ¿Cómo se integra este cliente con LLMs como Claude?
4. ¿Cuáles son los casos de uso principales?

Luego procede con la implementación completa siguiendo las especificaciones técnicas mencionadas.
```

## 🔧 Prompt de Extensión (Opcional)

```
Después de crear el cliente básico, agrega:

1. Comando 'read' funcional para leer recursos
2. Comandos 'prompts' y 'prompt' para manejar plantillas
3. Actualización del servidor de ejemplo con handlers de recursos y prompts
4. Documentación completa en formato Markdown
5. Ejemplos prácticos de uso
6. Explicación de integración con LLMs

Todo debe estar en TypeScript, ser type-safe, y funcionar perfectamente.
```
