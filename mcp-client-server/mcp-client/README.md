# MCP Client

A modern, interactive MCP (Model Context Protocol) client built with TypeScript and the latest MCP SDK.

## Features

- ✅ **Latest MCP SDK** - Uses `@modelcontextprotocol/sdk` v1.17.1
- 🔧 **Interactive Mode** - Command-line interface for exploring MCP servers
- 🛠️ **Tools Support** - Execute server tools with parameters
- 📂 **Resources Support** - Read server resources and data
- 💬 **Prompts Support** - Access structured conversation templates
- 🎯 **TypeScript** - Full type safety and modern JavaScript features
- 📦 **Modern Tooling** - ESLint, Prettier, and tsx for development
- 🧪 **Example Server** - Includes a complete MCP server with tools, resources, and prompts

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

## Quick Start

### Using the Example Server

1. Start the example MCP server in one terminal:
```bash
node examples/simple-server.js
```

2. In another terminal, connect the client to the server:
```bash
npm run dev node examples/simple-server.js
```

### Connecting to Other MCP Servers

You can connect to any MCP server that uses stdio transport:

```bash
# Connect to a Python MCP server
npm run dev python my_mcp_server.py

# Connect to a Node.js MCP server
npm run dev node my-server.js

# Connect to an executable
npm run dev ./my-mcp-executable
```

## Interactive Commands

Once connected, you can use these commands:

- `help` - Show available commands
- `tools` - List all available tools
- `call <tool_name>` - Call a specific tool (you'll be prompted for arguments)
- `resources` - List available resources
- `read <resource_uri>` - Read a specific resource
- `prompts` - List available prompt templates
- `prompt <prompt_name>` - Get a specific prompt template (you'll be prompted for arguments)
- `exit` - Exit the client

## Core MCP Concepts

### 🛠️ Tools
**Tools** are executable functions that perform actions:
- `add(a, b)` - Mathematical operations
- `send_email(to, subject, body)` - Communication
- `query_database(sql)` - Data operations

### 📂 Resources  
**Resources** are readable data sources:
- `file:///config.json` - Configuration files
- `api://weather/current` - Live data feeds
- `database://users/active` - Database queries

### 💬 Prompts
**Prompts** are structured conversation templates:
- `code_review` - Template for code reviews
- `email_template` - Professional email templates
- `bug_report` - Structured bug reporting

## Example Usage

```bash
$ npm run dev node examples/simple-server.js

🔗 Connecting to MCP server: node examples/simple-server.js
✅ Connected successfully to MCP server
📋 Server capabilities: {...}

🔧 Listing available tools...
Found 4 tools:

1. add
   Description: Add two numbers together
   Input Schema: {...}

2. multiply
   Description: Multiply two numbers
   Input Schema: {...}

3. echo
   Description: Echo back the input message
   Input Schema: {...}

4. current-time
   Description: Get the current date and time
   Input Schema: {...}

📂 Listing available resources...
Found 2 resources:

1. file:///example.txt
   Name: Example Text File
   Description: A sample text resource
   MIME Type: text/plain

2. config://server-info
   Name: Server Information
   Description: Information about this MCP server
   MIME Type: application/json

💬 Listing available prompts...
Found 3 prompts:

1. code_review
   Description: Template for conducting code reviews
   Arguments:
     - code (required): The code to review
     - language (optional): Programming language

2. email_template
   Description: Professional email template
   Arguments:
     - recipient (required): Email recipient
     - subject (required): Email subject
     - tone (optional): Email tone (formal/casual)

3. bug_report
   Description: Bug report template
   Arguments:
     - title (required): Bug title
     - severity (optional): Bug severity level

🎮 Entering interactive mode. Type "help" for commands.

# Example: Calling a tool
mcp> call add
Args: {"a": 5, "b": 3}
📤 Tool response: "The sum of 5 and 3 is 8"

# Example: Reading a resource
mcp> read file:///example.txt
📖 Content: "¡Hola! Este es un archivo de ejemplo..."

# Example: Using a prompt
mcp> prompt email_template
Args: {"recipient": "cliente@empresa.com", "subject": "Propuesta", "tone": "formal"}
📝 Prompt: "Redacta un email profesional con estas especificaciones..."
```

## Development

### Build the project
```bash
npm run build
```

### Run in development mode
```bash
npm run dev <server_command>
```

### Lint and format code
```bash
npm run lint
npm run format
```

### Clean build directory
```bash
npm run clean
```

## Project Structure

```
mcp-client/
├── src/
│   ├── index.ts          # Main client implementation
│   └── types.ts          # TypeScript type definitions
├── examples/
│   └── simple-server.js  # Example MCP server for testing
├── dist/                 # Compiled output (after build)
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## Creating Your Own MCP Server

Check out the `examples/simple-server.js` file to see how to create a complete MCP server. The server implements:

### 🛠️ Tools:
- `add(a, b)` - Add two numbers
- `multiply(a, b)` - Multiply two numbers  
- `echo(message)` - Echo back a message
- `current-time()` - Get current timestamp

### 📂 Resources:
- `file:///example.txt` - Sample text file with documentation
- `config://server-info` - JSON with server information and statistics

### 💬 Prompts:
- `code_review` - Structured template for code reviews
- `email_template` - Professional email template
- `bug_report` - Standardized bug report template

The server demonstrates:

- Tool listing (`tools/list`)
- Tool calling (`tools/call`)
- Basic math operations (add, multiply)
- Utility functions (echo, current-time)

## Requirements

- Node.js 18+ (for ES modules support)
- npm or yarn

## License

MIT

The server demonstrates:
- ✅ **Complete MCP capabilities** (tools, resources, prompts)
- ✅ **Error handling** and validation
- ✅ **TypeScript integration** with proper schemas
- ✅ **Real-world examples** you can extend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## Troubleshooting

### "Cannot find module" errors
Make sure you've run `npm install` to install all dependencies.

### "Permission denied" errors
Make sure your MCP server executable has the correct permissions:
```bash
chmod +x your-mcp-server
```

### Connection issues
- Verify the MCP server is working by running it directly
- Check that the server uses stdio transport
- Ensure the server path and arguments are correct
