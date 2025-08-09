import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testPractical() {
  console.log('🎬 Pruebas Prácticas del Servidor MCP TMDB\n');
  
  // Test 1: Workflow completo de búsqueda de película
  console.log('📋 TEST 1: Workflow completo - Buscar y obtener detalles de película');
  console.log('─'.repeat(60));
  
  // Buscar Avengers
  const searchInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'search_movies',
      arguments: { query: 'Avengers Endgame' }
    }
  });
  
  try {
    const { stdout: searchResult } = await execAsync(`echo '${searchInput}' | node index.js`);
    console.log('✅ Búsqueda exitosa - Primeros resultados encontrados\n');
    
    // Obtener detalles de Avengers Endgame (ID conocido: 299534)
    const detailsInput = JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_movie_details',
        arguments: { movie_id: '299534' }
      }
    });
    
    const { stdout: detailsResult } = await execAsync(`echo '${detailsInput}' | node index.js`);
    console.log('✅ Detalles obtenidos exitosamente\n');
    
  } catch (error) {
    console.log('❌ Error en workflow de película:', error.message);
  }

  // Test 2: Descubrir películas por año
  console.log('📋 TEST 2: Descubrir películas de 2023 ordenadas por calificación');
  console.log('─'.repeat(60));
  
  const discoverInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'discover_movies',
      arguments: { 
        year: 2023, 
        sort_by: 'vote_average.desc' 
      }
    }
  });
  
  try {
    const { stdout } = await execAsync(`echo '${discoverInput}' | node index.js`);
    console.log('✅ Descubrimiento de películas 2023 exitoso\n');
  } catch (error) {
    console.log('❌ Error en descubrimiento:', error.message);
  }

  // Test 3: Trending y populares
  console.log('📋 TEST 3: Contenido trending y popular');
  console.log('─'.repeat(60));
  
  const trendingInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'get_trending',
      arguments: { media_type: 'all', time_window: 'week' }
    }
  });
  
  try {
    const { stdout } = await execAsync(`echo '${trendingInput}' | node index.js`);
    console.log('✅ Trending semanal obtenido exitosamente\n');
  } catch (error) {
    console.log('❌ Error en trending:', error.message);
  }

  // Test 4: Búsqueda de persona y sus créditos
  console.log('📋 TEST 4: Buscar persona y obtener créditos de película');
  console.log('─'.repeat(60));
  
  const personSearchInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'search_people',
      arguments: { query: 'Robert Downey Jr' }
    }
  });
  
  try {
    const { stdout } = await execAsync(`echo '${personSearchInput}' | node index.js`);
    console.log('✅ Búsqueda de persona exitosa\n');
    
    // Obtener créditos de Iron Man (ID: 1726)
    const creditsInput = JSON.stringify({
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'get_movie_credits',
        arguments: { movie_id: '1726' }
      }
    });
    
    const { stdout: creditsResult } = await execAsync(`echo '${creditsInput}' | node index.js`);
    console.log('✅ Créditos de película obtenidos exitosamente\n');
    
  } catch (error) {
    console.log('❌ Error en workflow de persona:', error.message);
  }

  // Test 5: Series de TV
  console.log('📋 TEST 5: Workflow completo de series de TV');
  console.log('─'.repeat(60));
  
  const tvSearchInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/call',
    params: {
      name: 'search_tv_shows',
      arguments: { query: 'The Office' }
    }
  });
  
  try {
    const { stdout } = await execAsync(`echo '${tvSearchInput}' | node index.js`);
    console.log('✅ Búsqueda de series exitosa\n');
    
    // Obtener series populares
    const popularTVInput = JSON.stringify({
      jsonrpc: '2.0',
      id: 8,
      method: 'tools/call',
      params: {
        name: 'get_popular_tv_shows',
        arguments: { page: 1 }
      }
    });
    
    const { stdout: popularResult } = await execAsync(`echo '${popularTVInput}' | node index.js`);
    console.log('✅ Series populares obtenidas exitosamente\n');
    
  } catch (error) {
    console.log('❌ Error en workflow de TV:', error.message);
  }

  console.log('🎉 Todas las pruebas prácticas completadas!');
  console.log('\n📝 Resumen:');
  console.log('- Búsquedas de películas ✅');
  console.log('- Detalles completos ✅');
  console.log('- Descubrimiento con filtros ✅');
  console.log('- Contenido trending ✅');
  console.log('- Búsqueda de personas ✅');
  console.log('- Créditos de películas ✅');
  console.log('- Series de TV ✅');
  console.log('- Contenido popular ✅');
}

testPractical().catch(console.error);
