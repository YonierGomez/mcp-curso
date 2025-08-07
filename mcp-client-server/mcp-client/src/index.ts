#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MCPTool, MCPResource, MCPPrompt } from './types.js';

/**
 * MCP Client - A simple client to connect to MCP servers
 */
class MCPClient {
  private client: Client;
  private transport: StdioClientTransport | null = null;

  constructor() {
    this.client = new Client({
      name: 'mcp-client',
      version: '1.0.0',
    }, {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    });
  }

  /**
   * Connect to an MCP server using stdio transport
   */
  async connect(command: string, args: string[] = []): Promise<void> {
    try {
      console.log(`🔗 Connecting to MCP server: ${command} ${args.join(' ')}`);
      
      this.transport = new StdioClientTransport({
        command,
        args,
      });

      await this.client.connect(this.transport);
      console.log('✅ Connected successfully to MCP server');
      
      // Get server info
      const serverInfo = await this.client.getServerCapabilities();
      console.log('📋 Server capabilities:', JSON.stringify(serverInfo, null, 2));
      
      // Add error handler to prevent unexpected disconnections
      this.client.onclose = () => {
        console.log('⚠️  Server connection closed unexpectedly');
      };
      
      this.client.onerror = (error) => {
        console.error('⚠️  Connection error:', error);
      };
      
    } catch (error) {
      console.error('❌ Failed to connect to MCP server:', error);
      throw error;
    }
  }

  /**
   * List available tools from the connected server
   */
  async listTools(): Promise<void> {
    try {
      console.log('\n🔧 Listing available tools...');
      
      const response = await this.client.listTools();

      if (response.tools && response.tools.length > 0) {
        console.log(`Found ${response.tools.length} tools:`);
        response.tools.forEach((tool: MCPTool, index: number) => {
          console.log(`\n${index + 1}. ${tool.name}`);
          console.log(`   Description: ${tool.description || 'No description'}`);
          if (tool.inputSchema) {
            console.log(`   Input Schema: ${JSON.stringify(tool.inputSchema, null, 2)}`);
          }
        });
      } else {
        console.log('No tools available on this server.');
      }
    } catch (error) {
      console.error('❌ Failed to list tools:', error);
    }
  }

  /**
   * Call a specific tool with arguments
   */
  async callTool(toolName: string, args: Record<string, unknown> = {}): Promise<void> {
    try {
      console.log(`\n🚀 Calling tool: ${toolName}`);
      console.log(`Arguments: ${JSON.stringify(args, null, 2)}`);
      
      const response = await this.client.callTool({
        name: toolName,
        arguments: args,
      });

      console.log('📤 Tool response:');
      console.log(JSON.stringify(response, null, 2));
      
    } catch (error) {
      console.error(`❌ Failed to call tool ${toolName}:`, error);
    }
  }

  /**
   * List available resources from the connected server
   */
  async listResources(): Promise<void> {
    try {
      console.log('\n📂 Listing available resources...');
      
      const response = await this.client.listResources();

      if (response.resources && response.resources.length > 0) {
        console.log(`Found ${response.resources.length} resources:`);
        response.resources.forEach((resource: MCPResource, index: number) => {
          console.log(`\n${index + 1}. ${resource.uri}`);
          console.log(`   Name: ${resource.name || 'Unnamed'}`);
          console.log(`   Description: ${resource.description || 'No description'}`);
          console.log(`   MIME Type: ${resource.mimeType || 'Unknown'}`);
        });
      } else {
        console.log('No resources available on this server.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === -32601) {
        console.log('📂 This server does not support resource listing.');
      } else {
        console.error('❌ Failed to list resources:', error);
      }
    }
  }

  /**
   * Read a specific resource by URI
   */
  async readResource(uri: string): Promise<void> {
    try {
      console.log(`\n📖 Reading resource: ${uri}`);
      
      const response = await this.client.readResource({ uri });

      if (response.contents && response.contents.length > 0) {
        response.contents.forEach((content, index) => {
          console.log(`\n--- Content ${index + 1} ---`);
          console.log(`URI: ${content.uri}`);
          console.log(`MIME Type: ${content.mimeType || 'Unknown'}`);
          console.log(`\n${content.text || content.blob || 'No content'}`);
        });
      } else {
        console.log('No content found for this resource.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === -32601) {
        console.log('📖 This server does not support resource reading.');
      } else {
        console.error('❌ Failed to read resource:', error);
      }
    }
  }

  /**
   * List available prompts from the server
   */
  async listPrompts(): Promise<void> {
    try {
      console.log('\n💬 Listing available prompts...');
      
      const response = await this.client.listPrompts();

      if (response.prompts && response.prompts.length > 0) {
        console.log(`Found ${response.prompts.length} prompts:`);
        response.prompts.forEach((prompt: MCPPrompt, index: number) => {
          console.log(`\n${index + 1}. ${prompt.name}`);
          console.log(`   Description: ${prompt.description || 'No description'}`);
          if (prompt.arguments && prompt.arguments.length > 0) {
            console.log(`   Arguments:`);
            prompt.arguments.forEach(arg => {
              const required = arg.required ? ' (required)' : ' (optional)';
              console.log(`     - ${arg.name}${required}: ${arg.description || 'No description'}`);
            });
          }
        });
      } else {
        console.log('No prompts available on this server.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === -32601) {
        console.log('💬 This server does not support prompt listing.');
      } else {
        console.error('❌ Failed to list prompts:', error);
      }
    }
  }

  /**
   * Get a specific prompt by name
   */
  async getPrompt(name: string, args: Record<string, string> = {}): Promise<void> {
    try {
      console.log(`\n📝 Getting prompt: ${name}`);
      
      const response = await this.client.getPrompt({ name, arguments: args });

      if (response.description) {
        console.log(`Description: ${response.description}`);
      }

      if (response.messages && response.messages.length > 0) {
        console.log(`\n--- Prompt Content ---`);
        response.messages.forEach((message, index) => {
          console.log(`\nMessage ${index + 1} (${message.role}):`);
          if (message.content.type === 'text') {
            console.log(message.content.text);
          }
        });
      } else {
        console.log('No prompt content available.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === -32601) {
        console.log('📝 This server does not support prompt requests.');
      } else {
        console.error('❌ Failed to get prompt:', error);
      }
    }
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    try {
      if (this.transport) {
        console.log('\n👋 Disconnecting from MCP server...');
        await this.client.close();
        this.transport = null;
        console.log('✅ Disconnected successfully');
      }
    } catch (error) {
      console.error('❌ Error during disconnect:', error);
    }
  }

  /**
   * Interactive mode - allows user to interact with the server
   */
  async interactiveMode(): Promise<void> {
    console.log('\n🎮 Entering interactive mode. Type "help" for commands.');
    
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise<void>((resolve) => {
      let isClosing = false;
      
      const cleanup = (): void => {
        if (!isClosing) {
          isClosing = true;
          try {
            rl.close();
          } catch {
            // Ignore errors during cleanup
          }
          resolve();
        }
      };

      const prompt = (): void => {
        if (isClosing) return;
        
        try {
          rl.question('mcp> ', async (input) => {
            if (isClosing) return;
            
            const [command, ...args] = input.trim().split(' ');
            
            switch (command.toLowerCase()) {
              case 'help':
                console.log(`
Available commands:
  help          - Show this help message
  tools         - List available tools
  call <tool>   - Call a specific tool (you'll be prompted for arguments)
  resources     - List available resources
  read <uri>    - Read a specific resource by URI
  prompts       - List available prompts
  prompt <name> - Get a specific prompt (you'll be prompted for arguments)
  exit          - Exit interactive mode
                `);
                break;
                
              case 'tools':
                await this.listTools();
                break;
                
              case 'call':
                if (args.length === 0) {
                  console.log('Please specify a tool name. Usage: call <tool_name>');
                } else {
                  const toolName = args[0];
                  console.log('Enter arguments as JSON (or press Enter for empty args):');
                  if (!isClosing) {
                    try {
                      rl.question('Args: ', async (argsInput) => {
                        if (isClosing) return;
                        try {
                          const toolArgs = argsInput.trim() ? JSON.parse(argsInput) : {};
                          await this.callTool(toolName, toolArgs);
                        } catch (parseError) {
                          console.error('❌ Invalid JSON arguments:', parseError);
                        }
                        process.nextTick(() => {
                          if (!isClosing) prompt();
                        });
                      });
                      return;
                    } catch {
                      // Ignore errors during cleanup
                    }
                  }
                }
                break;
                
              case 'resources':
                await this.listResources();
                break;
                
              case 'read':
                if (args.length === 0) {
                  console.log('Please specify a resource URI. Usage: read <resource_uri>');
                } else {
                  const resourceUri = args.join(' '); // Join in case URI has spaces
                  await this.readResource(resourceUri);
                }
                break;
                
              case 'prompts':
                await this.listPrompts();
                break;
                
              case 'prompt':
                if (args.length === 0) {
                  console.log('Please specify a prompt name. Usage: prompt <prompt_name>');
                } else {
                  const promptName = args[0];
                  console.log('Enter prompt arguments as JSON (or press Enter for empty args):');
                  if (!isClosing) {
                    try {
                      rl.question('Args: ', async (argsInput) => {
                        if (isClosing) return;
                        try {
                          const promptArgs = argsInput.trim() ? JSON.parse(argsInput) : {};
                          await this.getPrompt(promptName, promptArgs);
                        } catch (parseError) {
                          console.error('❌ Invalid JSON arguments:', parseError);
                        }
                        process.nextTick(() => {
                          if (!isClosing) prompt();
                        });
                      });
                      return;
                    } catch {
                      // Ignore errors during cleanup
                    }
                  }
                }
                break;
                
              case 'exit':
                cleanup();
                return;
                
              default:
                console.log(`Unknown command: ${command}. Type "help" for available commands.`);
            }
            
            process.nextTick(() => {
              if (!isClosing) prompt();
            });
          });
        } catch (readlineError) {
          if (!isClosing) {
            console.error('❌ Readline error:', readlineError);
            cleanup();
          }
        }
      };

      // Handle process termination
      const signalHandler = (): void => {
        cleanup();
      };
      
      process.once('SIGINT', signalHandler);
      process.once('SIGTERM', signalHandler);
      
      // Clean up event listeners when done
      rl.on('close', () => {
        process.removeListener('SIGINT', signalHandler);
        process.removeListener('SIGTERM', signalHandler);
      });

      prompt();
    });
  }
}

/**
 * Main function to run the MCP client
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔗 MCP Client v1.0.0
Usage: npm run dev <server_command> [server_args...]

Examples:
  npm run dev node server.js
  npm run dev python mcp_server.py
  npm run dev ./my-mcp-server
  
The client will connect to the specified MCP server and enter interactive mode.
    `);
    process.exit(1);
  }

  const client = new MCPClient();
  
  try {
    // Connect to the server
    const [command, ...serverArgs] = args;
    await client.connect(command, serverArgs);
    
    // List initial information
    await client.listTools();
    await client.listResources();
    
    // Enter interactive mode
    await client.interactiveMode();
    
  } catch (error) {
    console.error('❌ Client error:', error);
    process.exit(1);
  }
  
  // Disconnect when we exit interactive mode
  await client.disconnect();
}

// Handle graceful shutdown
let isShuttingDown = false;

process.on('SIGINT', async () => {
  if (!isShuttingDown) {
    isShuttingDown = true;
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
  }
});

process.on('SIGTERM', async () => {
  if (!isShuttingDown) {
    isShuttingDown = true;
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
  }
});

// Run the client
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MCPClient };
