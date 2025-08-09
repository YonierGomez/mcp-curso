#!/usr/bin/env python3
"""
Servidor MCP para obtener información de Pokémon usando la PokeAPI
Desarrollado con FastMCP
"""

import asyncio
import httpx
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastmcp import FastMCP

# Configuración de la API
POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

# Modelos de datos
class PokemonBasicInfo(BaseModel):
    id: int
    name: str
    height: int  # en decímetros
    weight: int  # en hectogramos
    base_experience: int
    types: List[str]
    abilities: List[str]
    sprites: Dict[str, Any]

class PokemonStats(BaseModel):
    hp: int
    attack: int
    defense: int
    special_attack: int
    special_defense: int
    speed: int

class PokemonEvolution(BaseModel):
    species_name: str
    min_level: Optional[int]
    trigger: str
    evolves_to: List[Dict[str, Any]]

# Inicializar FastMCP
mcp = FastMCP("Pokemon MCP Server")

# Función auxiliar interna para obtener información de Pokémon (sin decorador MCP)
async def _get_pokemon_data(name_or_id: str) -> Dict[str, Any]:
    """Función auxiliar interna para obtener datos de Pokémon"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon/{name_or_id.lower()}")
            if response.status_code != 200:
                return {"error": f"Pokémon '{name_or_id}' no encontrado"}
            
            pokemon_data = response.json()
            
            # Procesar tipos
            types = [type_info["type"]["name"] for type_info in pokemon_data["types"]]
            
            # Procesar habilidades
            abilities = [ability_info["ability"]["name"] for ability_info in pokemon_data["abilities"]]
            
            # Procesar estadísticas
            stats = {}
            for stat in pokemon_data["stats"]:
                stat_name = stat["stat"]["name"].replace("-", "_")
                stats[stat_name] = stat["base_stat"]
            
            # Procesar sprites
            sprites = {
                "front_default": pokemon_data["sprites"]["front_default"],
                "front_shiny": pokemon_data["sprites"]["front_shiny"],
                "back_default": pokemon_data["sprites"]["back_default"],
                "back_shiny": pokemon_data["sprites"]["back_shiny"]
            }
            
            return {
                "id": pokemon_data["id"],
                "name": pokemon_data["name"].title(),
                "height": pokemon_data["height"] / 10,  # Convertir a metros
                "weight": pokemon_data["weight"] / 10,  # Convertir a kg
                "base_experience": pokemon_data["base_experience"],
                "types": types,
                "abilities": abilities,
                "stats": stats,
                "sprites": sprites
            }
    
    except Exception as e:
        return {"error": f"Error al obtener información del Pokémon: {str(e)}"}

@mcp.tool()
async def get_pokemon_info(name_or_id: str) -> Dict[str, Any]:
    """
    Obtiene información básica de un Pokémon por nombre o ID
    
    Args:
        name_or_id: Nombre o ID del Pokémon (ej: "pikachu", "25")
    
    Returns:
        Información básica del Pokémon incluyendo tipos, habilidades, estadísticas y sprites
    """
    return await _get_pokemon_data(name_or_id)

@mcp.tool()
async def get_pokemon_evolution_chain(pokemon_name: str) -> Dict[str, Any]:
    """
    Obtiene la cadena de evolución de un Pokémon
    
    Args:
        pokemon_name: Nombre del Pokémon
    
    Returns:
        Cadena de evolución completa del Pokémon
    """
    try:
        async with httpx.AsyncClient() as client:
            # Obtener información de la especie
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon-species/{pokemon_name.lower()}")
            if response.status_code != 200:
                return {"error": f"Especie de Pokémon '{pokemon_name}' no encontrada"}
            
            species_data = response.json()
            evolution_chain_url = species_data["evolution_chain"]["url"]
            
            # Obtener cadena de evolución
            evolution_response = await client.get(evolution_chain_url)
            evolution_data = evolution_response.json()
            
            def parse_evolution_chain(chain_data):
                """Función recursiva para parsear la cadena de evolución"""
                evolution_info = {
                    "species": chain_data["species"]["name"],
                    "min_level": None,
                    "trigger": None,
                    "evolves_to": []
                }
                
                if chain_data["evolution_details"]:
                    details = chain_data["evolution_details"][0]
                    evolution_info["min_level"] = details.get("min_level")
                    evolution_info["trigger"] = details["trigger"]["name"] if details["trigger"] else None
                
                for evolution in chain_data["evolves_to"]:
                    evolution_info["evolves_to"].append(parse_evolution_chain(evolution))
                
                return evolution_info
            
            evolution_chain = parse_evolution_chain(evolution_data["chain"])
            
            return {
                "pokemon": pokemon_name.title(),
                "evolution_chain": evolution_chain
            }
    
    except Exception as e:
        return {"error": f"Error al obtener cadena de evolución: {str(e)}"}

@mcp.tool()
async def search_pokemon_by_type(pokemon_type: str, limit: int = 10) -> Dict[str, Any]:
    """
    Busca Pokémon por tipo
    
    Args:
        pokemon_type: Tipo de Pokémon (ej: "fire", "water", "electric")
        limit: Número máximo de Pokémon a retornar (default: 10)
    
    Returns:
        Lista de Pokémon del tipo especificado
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{POKEAPI_BASE_URL}/type/{pokemon_type.lower()}")
            if response.status_code != 200:
                return {"error": f"Tipo '{pokemon_type}' no encontrado"}
            
            type_data = response.json()
            pokemon_list = []
            
            for i, pokemon_info in enumerate(type_data["pokemon"][:limit]):
                pokemon_name = pokemon_info["pokemon"]["name"]
                
                # Obtener información básica de cada Pokémon
                pokemon_response = await client.get(f"{POKEAPI_BASE_URL}/pokemon/{pokemon_name}")
                if pokemon_response.status_code == 200:
                    pokemon_data = pokemon_response.json()
                    pokemon_list.append({
                        "id": pokemon_data["id"],
                        "name": pokemon_data["name"].title(),
                        "sprite": pokemon_data["sprites"]["front_default"]
                    })
            
            return {
                "type": pokemon_type.title(),
                "count": len(pokemon_list),
                "pokemon": sorted(pokemon_list, key=lambda x: x["id"])
            }
    
    except Exception as e:
        return {"error": f"Error al buscar Pokémon por tipo: {str(e)}"}

@mcp.tool()
async def get_random_pokemon() -> Dict[str, Any]:
    """
    Obtiene un Pokémon aleatorio
    
    Returns:
        Información de un Pokémon seleccionado aleatoriamente
    """
    import random
    
    try:
        # Generar un ID aleatorio (hay aproximadamente 1010 Pokémon)
        random_id = random.randint(1, 1010)
        return await _get_pokemon_data(str(random_id))
    
    except Exception as e:
        return {"error": f"Error al obtener Pokémon aleatorio: {str(e)}"}

@mcp.tool()
async def compare_pokemon_stats(pokemon1: str, pokemon2: str) -> Dict[str, Any]:
    """
    Compara las estadísticas de dos Pokémon
    
    Args:
        pokemon1: Nombre o ID del primer Pokémon
        pokemon2: Nombre o ID del segundo Pokémon
    
    Returns:
        Comparación detallada de estadísticas entre ambos Pokémon
    """
    try:
        # Obtener información de ambos Pokémon
        pokemon1_info = await _get_pokemon_data(pokemon1)
        pokemon2_info = await _get_pokemon_data(pokemon2)
        
        if "error" in pokemon1_info:
            return pokemon1_info
        if "error" in pokemon2_info:
            return pokemon2_info
        
        # Comparar estadísticas
        comparison = {
            "pokemon1": {
                "name": pokemon1_info["name"],
                "id": pokemon1_info["id"],
                "stats": pokemon1_info["stats"]
            },
            "pokemon2": {
                "name": pokemon2_info["name"],
                "id": pokemon2_info["id"],
                "stats": pokemon2_info["stats"]
            },
            "winner_by_stat": {}
        }
        
        # Determinar ganador por estadística
        for stat_name in pokemon1_info["stats"]:
            stat1 = pokemon1_info["stats"][stat_name]
            stat2 = pokemon2_info["stats"][stat_name]
            
            if stat1 > stat2:
                comparison["winner_by_stat"][stat_name] = pokemon1_info["name"]
            elif stat2 > stat1:
                comparison["winner_by_stat"][stat_name] = pokemon2_info["name"]
            else:
                comparison["winner_by_stat"][stat_name] = "Empate"
        
        # Calcular total de estadísticas
        total1 = sum(pokemon1_info["stats"].values())
        total2 = sum(pokemon2_info["stats"].values())
        
        comparison["total_stats"] = {
            pokemon1_info["name"]: total1,
            pokemon2_info["name"]: total2,
            "winner": pokemon1_info["name"] if total1 > total2 else pokemon2_info["name"] if total2 > total1 else "Empate"
        }
        
        return comparison
    
    except Exception as e:
        return {"error": f"Error al comparar Pokémon: {str(e)}"}

@mcp.tool()
async def get_pokemon_moves(pokemon_name: str, limit: int = 10) -> Dict[str, Any]:
    """
    Obtiene los movimientos que puede aprender un Pokémon
    
    Args:
        pokemon_name: Nombre del Pokémon
        limit: Número máximo de movimientos a mostrar (default: 10)
    
    Returns:
        Lista de movimientos del Pokémon
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon/{pokemon_name.lower()}")
            if response.status_code != 200:
                return {"error": f"Pokémon '{pokemon_name}' no encontrado"}
            
            pokemon_data = response.json()
            moves_list = []
            
            for move_info in pokemon_data["moves"][:limit]:
                move_name = move_info["move"]["name"]
                learn_method = move_info["version_group_details"][0]["move_learn_method"]["name"] if move_info["version_group_details"] else "unknown"
                level_learned = move_info["version_group_details"][0]["level_learned_at"] if move_info["version_group_details"] else None
                
                moves_list.append({
                    "name": move_name.replace("-", " ").title(),
                    "learn_method": learn_method.replace("-", " ").title(),
                    "level_learned": level_learned
                })
            
            return {
                "pokemon": pokemon_name.title(),
                "total_moves": len(pokemon_data["moves"]),
                "moves_shown": len(moves_list),
                "moves": moves_list
            }
    
    except Exception as e:
        return {"error": f"Error al obtener movimientos: {str(e)}"}

if __name__ == "__main__":
    # Ejecutar el servidor MCP
    mcp.run()
