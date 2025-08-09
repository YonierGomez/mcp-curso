#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { request } from 'undici';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

class TMDBServer {
  constructor() {
    this.server = new Server(
      {
        name: 'tmdb-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_movies',
          description: 'Busca películas por título',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Título de la película a buscar'
              },
              page: {
                type: 'integer',
                description: 'Número de página (default: 1)',
                default: 1
              }
            },
            required: ['query']
          }
        },
        {
          name: 'search_tv_shows',
          description: 'Busca series de TV por título',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Título de la serie a buscar'
              },
              page: {
                type: 'integer',
                description: 'Número de página (default: 1)',
                default: 1
              }
            },
            required: ['query']
          }
        },
        {
          name: 'get_movie_details',
          description: 'Obtiene información detallada de una película específica',
          inputSchema: {
            type: 'object',
            properties: {
              movie_id: {
                type: 'string',
                description: 'ID de la película en TMDB'
              }
            },
            required: ['movie_id']
          }
        },
        {
          name: 'get_tv_details',
          description: 'Obtiene información detallada de una serie de TV específica',
          inputSchema: {
            type: 'object',
            properties: {
              tv_id: {
                type: 'string',
                description: 'ID de la serie en TMDB'
              }
            },
            required: ['tv_id']
          }
        },
        {
          name: 'get_person_details',
          description: 'Obtiene información detallada de una persona (actor, director, etc.)',
          inputSchema: {
            type: 'object',
            properties: {
              person_id: {
                type: 'string',
                description: 'ID de la persona en TMDB'
              }
            },
            required: ['person_id']
          }
        },
        {
          name: 'search_people',
          description: 'Busca personas (actores, directores, etc.) por nombre',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Nombre de la persona a buscar'
              },
              page: {
                type: 'integer',
                description: 'Número de página (default: 1)',
                default: 1
              }
            },
            required: ['query']
          }
        },
        {
          name: 'get_trending',
          description: 'Obtiene contenido trending (películas, series o personas)',
          inputSchema: {
            type: 'object',
            properties: {
              media_type: {
                type: 'string',
                description: 'Tipo de contenido',
                enum: ['movie', 'tv', 'person', 'all']
              },
              time_window: {
                type: 'string',
                description: 'Ventana de tiempo',
                enum: ['day', 'week'],
                default: 'week'
              }
            },
            required: ['media_type']
          }
        },
        {
          name: 'get_popular_movies',
          description: 'Obtiene las películas más populares',
          inputSchema: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                description: 'Número de página (default: 1)',
                default: 1
              }
            }
          }
        },
        {
          name: 'get_popular_tv_shows',
          description: 'Obtiene las series de TV más populares',
          inputSchema: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                description: 'Número de página (default: 1)',
                default: 1
              }
            }
          }
        },
        {
          name: 'get_movie_credits',
          description: 'Obtiene el reparto y equipo de una película',
          inputSchema: {
            type: 'object',
            properties: {
              movie_id: {
                type: 'string',
                description: 'ID de la película en TMDB'
              }
            },
            required: ['movie_id']
          }
        },
        {
          name: 'get_tv_credits',
          description: 'Obtiene el reparto y equipo de una serie de TV',
          inputSchema: {
            type: 'object',
            properties: {
              tv_id: {
                type: 'string',
                description: 'ID de la serie en TMDB'
              }
            },
            required: ['tv_id']
          }
        },
        {
          name: 'discover_movies',
          description: 'Descubre películas con filtros específicos',
          inputSchema: {
            type: 'object',
            properties: {
              sort_by: {
                type: 'string',
                description: 'Criterio de ordenación',
                enum: ['popularity.desc', 'release_date.desc', 'vote_average.desc', 'vote_count.desc'],
                default: 'popularity.desc'
              },
              year: {
                type: 'integer',
                description: 'Año de lanzamiento'
              },
              genre: {
                type: 'string',
                description: 'ID del género'
              },
              with_cast: {
                type: 'string',
                description: 'ID del actor/actriz'
              },
              page: {
                type: 'integer',
                description: 'Número de página (default: 1)',
                default: 1
              }
            }
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!this.apiKey) {
          throw new McpError(
            ErrorCode.InternalError,
            'TMDB API key no configurada. Asegúrate de tener TMDB_API_KEY en tu archivo .env'
          );
        }

        switch (name) {
          case 'search_movies':
            return await this.searchMovies(args.query, args.page || 1);
          
          case 'search_tv_shows':
            return await this.searchTVShows(args.query, args.page || 1);
          
          case 'get_movie_details':
            return await this.getMovieDetails(args.movie_id);
          
          case 'get_tv_details':
            return await this.getTVDetails(args.tv_id);
          
          case 'get_person_details':
            return await this.getPersonDetails(args.person_id);
          
          case 'search_people':
            return await this.searchPeople(args.query, args.page || 1);
          
          case 'get_trending':
            return await this.getTrending(args.media_type, args.time_window || 'week');
          
          case 'get_popular_movies':
            return await this.getPopularMovies(args.page || 1);
          
          case 'get_popular_tv_shows':
            return await this.getPopularTVShows(args.page || 1);
          
          case 'get_movie_credits':
            return await this.getMovieCredits(args.movie_id);
          
          case 'get_tv_credits':
            return await this.getTVCredits(args.tv_id);
          
          case 'discover_movies':
            return await this.discoverMovies(args);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Herramienta desconocida: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error ejecutando ${name}: ${error.message}`
        );
      }
    });
  }

  async makeRequest(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('language', 'es-ES');
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    const { statusCode, body } = await request(url.toString());
    
    if (statusCode !== 200) {
      throw new Error(`Error en la API de TMDB: ${statusCode}`);
    }

    const text = await body.text();
    return JSON.parse(text);
  }

  async searchMovies(query, page = 1) {
    const data = await this.makeRequest('/search/movie', { query, page });
    
    return {
      content: [
        {
          type: 'text',
          text: `🎬 **Búsqueda de películas: "${query}"**\n\n` +
                `📊 **Resultados:** ${data.total_results} películas encontradas\n` +
                `📄 **Página:** ${page} de ${data.total_pages}\n\n` +
                data.results.slice(0, 10).map(movie => 
                  `🎭 **${movie.title}** (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})\n` +
                  `   📝 ID: ${movie.id}\n` +
                  `   ⭐ Calificación: ${movie.vote_average}/10\n` +
                  `   📖 ${movie.overview ? movie.overview.substring(0, 150) + '...' : 'Sin descripción'}\n` +
                  `   🖼️ Poster: ${movie.poster_path ? this.imageBaseUrl + movie.poster_path : 'No disponible'}\n`
                ).join('\n')
        }
      ]
    };
  }

  async searchTVShows(query, page = 1) {
    const data = await this.makeRequest('/search/tv', { query, page });
    
    return {
      content: [
        {
          type: 'text',
          text: `📺 **Búsqueda de series: "${query}"**\n\n` +
                `📊 **Resultados:** ${data.total_results} series encontradas\n` +
                `📄 **Página:** ${page} de ${data.total_pages}\n\n` +
                data.results.slice(0, 10).map(show => 
                  `🎭 **${show.name}** (${show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A'})\n` +
                  `   📝 ID: ${show.id}\n` +
                  `   ⭐ Calificación: ${show.vote_average}/10\n` +
                  `   📖 ${show.overview ? show.overview.substring(0, 150) + '...' : 'Sin descripción'}\n` +
                  `   🖼️ Poster: ${show.poster_path ? this.imageBaseUrl + show.poster_path : 'No disponible'}\n`
                ).join('\n')
        }
      ]
    };
  }

  async getMovieDetails(movieId) {
    const movie = await this.makeRequest(`/movie/${movieId}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `🎬 **${movie.title}** (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})\n\n` +
                `📝 **ID:** ${movie.id}\n` +
                `⭐ **Calificación:** ${movie.vote_average}/10 (${movie.vote_count} votos)\n` +
                `⏱️ **Duración:** ${movie.runtime ? movie.runtime + ' minutos' : 'No disponible'}\n` +
                `🏷️ **Géneros:** ${movie.genres.map(g => g.name).join(', ')}\n` +
                `🌍 **Países:** ${movie.production_countries.map(c => c.name).join(', ')}\n` +
                `💰 **Presupuesto:** ${movie.budget ? '$' + movie.budget.toLocaleString() : 'No disponible'}\n` +
                `💸 **Recaudación:** ${movie.revenue ? '$' + movie.revenue.toLocaleString() : 'No disponible'}\n` +
                `🎬 **Productoras:** ${movie.production_companies.map(c => c.name).join(', ')}\n` +
                `🗣️ **Idiomas:** ${movie.spoken_languages.map(l => l.english_name).join(', ')}\n` +
                `🏠 **Página oficial:** ${movie.homepage || 'No disponible'}\n` +
                `🖼️ **Poster:** ${movie.poster_path ? this.imageBaseUrl + movie.poster_path : 'No disponible'}\n` +
                `🎨 **Backdrop:** ${movie.backdrop_path ? this.imageBaseUrl.replace('w500', 'w1280') + movie.backdrop_path : 'No disponible'}\n\n` +
                `📖 **Sinopsis:**\n${movie.overview || 'Sin descripción disponible'}\n` +
                `\n🏷️ **Tagline:** ${movie.tagline || 'No disponible'}`
        }
      ]
    };
  }

  async getTVDetails(tvId) {
    const show = await this.makeRequest(`/tv/${tvId}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `📺 **${show.name}** (${show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A'})\n\n` +
                `📝 **ID:** ${show.id}\n` +
                `⭐ **Calificación:** ${show.vote_average}/10 (${show.vote_count} votos)\n` +
                `📺 **Temporadas:** ${show.number_of_seasons}\n` +
                `📑 **Episodios:** ${show.number_of_episodes}\n` +
                `⏱️ **Duración por episodio:** ${show.episode_run_time.length > 0 ? show.episode_run_time.join(', ') + ' minutos' : 'Variable'}\n` +
                `🏷️ **Géneros:** ${show.genres.map(g => g.name).join(', ')}\n` +
                `🌍 **Países:** ${show.origin_country.join(', ')}\n` +
                `📺 **Estado:** ${show.status}\n` +
                `🎬 **Productoras:** ${show.production_companies.map(c => c.name).join(', ')}\n` +
                `📺 **Cadenas:** ${show.networks.map(n => n.name).join(', ')}\n` +
                `📅 **Primera emisión:** ${show.first_air_date || 'No disponible'}\n` +
                `📅 **Última emisión:** ${show.last_air_date || 'En emisión'}\n` +
                `🏠 **Página oficial:** ${show.homepage || 'No disponible'}\n` +
                `🖼️ **Poster:** ${show.poster_path ? this.imageBaseUrl + show.poster_path : 'No disponible'}\n` +
                `🎨 **Backdrop:** ${show.backdrop_path ? this.imageBaseUrl.replace('w500', 'w1280') + show.backdrop_path : 'No disponible'}\n\n` +
                `📖 **Sinopsis:**\n${show.overview || 'Sin descripción disponible'}\n` +
                `\n🏷️ **Tagline:** ${show.tagline || 'No disponible'}\n\n` +
                `🎭 **Creado por:** ${show.created_by.map(c => c.name).join(', ')}`
        }
      ]
    };
  }

  async getPersonDetails(personId) {
    const person = await this.makeRequest(`/person/${personId}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `👤 **${person.name}**\n\n` +
                `📝 **ID:** ${person.id}\n` +
                `⭐ **Popularidad:** ${person.popularity}\n` +
                `🎭 **Conocido por:** ${person.known_for_department}\n` +
                `🎂 **Fecha de nacimiento:** ${person.birthday || 'No disponible'}\n` +
                `📍 **Lugar de nacimiento:** ${person.place_of_birth || 'No disponible'}\n` +
                `🪦 **Fecha de fallecimiento:** ${person.deathday || 'Vivo'}\n` +
                `👥 **También conocido como:** ${person.also_known_as.join(', ') || 'No disponible'}\n` +
                `🏠 **Página oficial:** ${person.homepage || 'No disponible'}\n` +
                `🖼️ **Foto:** ${person.profile_path ? this.imageBaseUrl + person.profile_path : 'No disponible'}\n\n` +
                `📖 **Biografía:**\n${person.biography || 'Sin biografía disponible'}`
        }
      ]
    };
  }

  async searchPeople(query, page = 1) {
    const data = await this.makeRequest('/search/person', { query, page });
    
    return {
      content: [
        {
          type: 'text',
          text: `👤 **Búsqueda de personas: "${query}"**\n\n` +
                `📊 **Resultados:** ${data.total_results} personas encontradas\n` +
                `📄 **Página:** ${page} de ${data.total_pages}\n\n` +
                data.results.slice(0, 10).map(person => 
                  `👤 **${person.name}**\n` +
                  `   📝 ID: ${person.id}\n` +
                  `   🎭 Conocido por: ${person.known_for_department}\n` +
                  `   ⭐ Popularidad: ${person.popularity}\n` +
                  `   🎬 Trabajos conocidos: ${person.known_for.map(work => work.title || work.name).join(', ')}\n` +
                  `   🖼️ Foto: ${person.profile_path ? this.imageBaseUrl + person.profile_path : 'No disponible'}\n`
                ).join('\n')
        }
      ]
    };
  }

  async getTrending(mediaType, timeWindow = 'week') {
    const data = await this.makeRequest(`/trending/${mediaType}/${timeWindow}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `🔥 **Trending ${mediaType} - ${timeWindow === 'day' ? 'Hoy' : 'Esta semana'}**\n\n` +
                data.results.slice(0, 15).map((item, index) => {
                  const title = item.title || item.name;
                  const date = item.release_date || item.first_air_date;
                  const type = item.media_type === 'movie' ? '🎬' : item.media_type === 'tv' ? '📺' : '👤';
                  
                  return `${index + 1}. ${type} **${title}**${date ? ` (${date.split('-')[0]})` : ''}\n` +
                         `   📝 ID: ${item.id}\n` +
                         `   ⭐ Calificación: ${item.vote_average || 'N/A'}/10\n` +
                         `   📊 Popularidad: ${item.popularity}\n`;
                }).join('\n')
        }
      ]
    };
  }

  async getPopularMovies(page = 1) {
    const data = await this.makeRequest('/movie/popular', { page });
    
    return {
      content: [
        {
          type: 'text',
          text: `🔥 **Películas Populares**\n\n` +
                `📄 **Página:** ${page} de ${data.total_pages}\n\n` +
                data.results.slice(0, 10).map((movie, index) => 
                  `${index + 1}. 🎬 **${movie.title}** (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})\n` +
                  `   📝 ID: ${movie.id}\n` +
                  `   ⭐ Calificación: ${movie.vote_average}/10\n` +
                  `   📊 Popularidad: ${movie.popularity}\n`
                ).join('\n')
        }
      ]
    };
  }

  async getPopularTVShows(page = 1) {
    const data = await this.makeRequest('/tv/popular', { page });
    
    return {
      content: [
        {
          type: 'text',
          text: `🔥 **Series de TV Populares**\n\n` +
                `📄 **Página:** ${page} de ${data.total_pages}\n\n` +
                data.results.slice(0, 10).map((show, index) => 
                  `${index + 1}. 📺 **${show.name}** (${show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A'})\n` +
                  `   📝 ID: ${show.id}\n` +
                  `   ⭐ Calificación: ${show.vote_average}/10\n` +
                  `   📊 Popularidad: ${show.popularity}\n`
                ).join('\n')
        }
      ]
    };
  }

  async getMovieCredits(movieId) {
    const data = await this.makeRequest(`/movie/${movieId}/credits`);
    
    const cast = data.cast.slice(0, 10).map(actor => 
      `👤 **${actor.name}** como *${actor.character}*\n` +
      `   📝 ID: ${actor.id}`
    ).join('\n');

    const crew = data.crew.slice(0, 10).map(member => 
      `👥 **${member.name}** - *${member.job}*\n` +
      `   📝 ID: ${member.id}`
    ).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `🎭 **Créditos de la película (ID: ${movieId})**\n\n` +
                `**🎬 REPARTO PRINCIPAL:**\n${cast}\n\n` +
                `**👥 EQUIPO TÉCNICO:**\n${crew}`
        }
      ]
    };
  }

  async getTVCredits(tvId) {
    const data = await this.makeRequest(`/tv/${tvId}/credits`);
    
    const cast = data.cast.slice(0, 10).map(actor => 
      `👤 **${actor.name}** como *${actor.character}*\n` +
      `   📝 ID: ${actor.id}`
    ).join('\n');

    const crew = data.crew.slice(0, 10).map(member => 
      `👥 **${member.name}** - *${member.job}*\n` +
      `   📝 ID: ${member.id}`
    ).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `🎭 **Créditos de la serie (ID: ${tvId})**\n\n` +
                `**📺 REPARTO PRINCIPAL:**\n${cast}\n\n` +
                `**👥 EQUIPO TÉCNICO:**\n${crew}`
        }
      ]
    };
  }

  async discoverMovies(params) {
    const queryParams = {};
    if (params.sort_by) queryParams.sort_by = params.sort_by;
    if (params.year) queryParams.year = params.year;
    if (params.genre) queryParams.with_genres = params.genre;
    if (params.with_cast) queryParams.with_cast = params.with_cast;
    if (params.page) queryParams.page = params.page;

    const data = await this.makeRequest('/discover/movie', queryParams);
    
    return {
      content: [
        {
          type: 'text',
          text: `🔍 **Descubrir Películas**\n\n` +
                `📊 **Filtros aplicados:**\n` +
                `${params.sort_by ? `🔄 Ordenado por: ${params.sort_by}\n` : ''}` +
                `${params.year ? `📅 Año: ${params.year}\n` : ''}` +
                `${params.genre ? `🏷️ Género ID: ${params.genre}\n` : ''}` +
                `${params.with_cast ? `🎭 Actor ID: ${params.with_cast}\n` : ''}` +
                `\n📄 **Página:** ${params.page || 1} de ${data.total_pages}\n\n` +
                data.results.slice(0, 10).map((movie, index) => 
                  `${index + 1}. 🎬 **${movie.title}** (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})\n` +
                  `   📝 ID: ${movie.id}\n` +
                  `   ⭐ Calificación: ${movie.vote_average}/10\n` +
                  `   📊 Popularidad: ${movie.popularity}\n`
                ).join('\n')
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Servidor MCP TMDB iniciado en stdin/stdout');
  }
}

const server = new TMDBServer();
server.run().catch(console.error);
