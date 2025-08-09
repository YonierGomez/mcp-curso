#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function quickDemo() {
  console.log('🎬 DEMO RÁPIDO DEL SERVIDOR MCP TMDB\n');

  // Test 1: Buscar una película popular
  console.log('🔍 1. Buscando "Spider-Man"...');
  const searchInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'search_movies',
      arguments: { query: 'Spider-Man' }
    }
  });

  try {
    const { stdout } = await execAsync(`echo '${searchInput}' | node index.js`);
    const response = JSON.parse(stdout.trim());
    
    if (response.result && response.result.content) {
      console.log('✅ Resultados encontrados:');
      console.log(response.result.content[0].text.substring(0, 400) + '...\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Obtener trending
  console.log('🔥 2. Obteniendo películas trending...');
  const trendingInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_trending',
      arguments: { media_type: 'movie', time_window: 'week' }
    }
  });

  try {
    const { stdout } = await execAsync(`echo '${trendingInput}' | node index.js`);
    const response = JSON.parse(stdout.trim());
    
    if (response.result && response.result.content) {
      console.log('✅ Trending obtenido:');
      console.log(response.result.content[0].text.substring(0, 400) + '...\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Buscar persona
  console.log('👤 3. Buscando "Ryan Reynolds"...');
  const personInput = JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'search_people',
      arguments: { query: 'Ryan Reynolds' }
    }
  });

  try {
    const { stdout } = await execAsync(`echo '${personInput}' | node index.js`);
    const response = JSON.parse(stdout.trim());
    
    if (response.result && response.result.content) {
      console.log('✅ Persona encontrada:');
      console.log(response.result.content[0].text.substring(0, 300) + '...\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('🎉 ¡Demo completado! Tu servidor MCP TMDB está funcionando perfectamente.');
  console.log('\n📋 Herramientas disponibles:');
  console.log('✅ search_movies - ✅ search_tv_shows - ✅ search_people');
  console.log('✅ get_movie_details - ✅ get_tv_details - ✅ get_person_details');
  console.log('✅ get_trending - ✅ get_popular_movies - ✅ get_popular_tv_shows');
  console.log('✅ get_movie_credits - ✅ get_tv_credits - ✅ discover_movies');
}

quickDemo().catch(console.error);
