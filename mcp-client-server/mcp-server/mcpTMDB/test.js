import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testTMDBServer() {
  console.log('🧪 Iniciando pruebas del servidor MCP TMDB...\n');

  const tests = [
    {
      name: 'Buscar películas - "Inception"',
      input: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_movies',
          arguments: { query: 'Inception' }
        }
      })
    },
    {
      name: 'Obtener detalles de película - Inception (ID: 27205)',
      input: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'get_movie_details',
          arguments: { movie_id: '27205' }
        }
      })
    },
    {
      name: 'Buscar series - "Breaking Bad"',
      input: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'search_tv_shows',
          arguments: { query: 'Breaking Bad' }
        }
      })
    },
    {
      name: 'Buscar personas - "Leonardo DiCaprio"',
      input: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'search_people',
          arguments: { query: 'Leonardo DiCaprio' }
        }
      })
    },
    {
      name: 'Obtener trending movies',
      input: JSON.stringify({
        jsonrpc: '2.0',
        id: 5,
        method: 'tools/call',
        params: {
          name: 'get_trending',
          arguments: { media_type: 'movie', time_window: 'week' }
        }
      })
    }
  ];

  for (const test of tests) {
    console.log(`📋 ${test.name}`);
    console.log('─'.repeat(50));
    
    try {
      const { stdout } = await execAsync(`echo '${test.input}' | node index.js`);
      console.log('✅ Respuesta recibida:');
      
      try {
        const response = JSON.parse(stdout.trim());
        if (response.result && response.result.content) {
          console.log(response.result.content[0].text.substring(0, 300) + '...\n');
        } else {
          console.log('📝 Respuesta:', stdout.substring(0, 200) + '...\n');
        }
      } catch (parseError) {
        console.log('📝 Respuesta (raw):', stdout.substring(0, 200) + '...\n');
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
      console.log('');
    }
  }

  console.log('🎉 Pruebas completadas!');
}

testTMDBServer().catch(console.error);
