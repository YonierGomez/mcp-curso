#!/usr/bin/env python3
"""
Prueba específica para la función get_random_pokemon corregida
"""

import asyncio
import httpx
import random

POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

async def _get_pokemon_data(name_or_id: str):
    """Función auxiliar para obtener datos de Pokémon"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon/{name_or_id.lower()}")
            if response.status_code != 200:
                return {"error": f"Pokémon '{name_or_id}' no encontrado"}
            
            pokemon_data = response.json()
            
            types = [type_info["type"]["name"] for type_info in pokemon_data["types"]]
            abilities = [ability_info["ability"]["name"] for ability_info in pokemon_data["abilities"]]
            
            stats = {}
            for stat in pokemon_data["stats"]:
                stat_name = stat["stat"]["name"].replace("-", "_")
                stats[stat_name] = stat["base_stat"]
            
            sprites = {
                "front_default": pokemon_data["sprites"]["front_default"],
                "front_shiny": pokemon_data["sprites"]["front_shiny"],
                "back_default": pokemon_data["sprites"]["back_default"],
                "back_shiny": pokemon_data["sprites"]["back_shiny"]
            }
            
            return {
                "id": pokemon_data["id"],
                "name": pokemon_data["name"].title(),
                "height": pokemon_data["height"] / 10,
                "weight": pokemon_data["weight"] / 10,
                "base_experience": pokemon_data["base_experience"],
                "types": types,
                "abilities": abilities,
                "stats": stats,
                "sprites": sprites
            }
    
    except Exception as e:
        return {"error": f"Error al obtener información del Pokémon: {str(e)}"}

async def test_get_random_pokemon():
    """Prueba la función get_random_pokemon corregida"""
    try:
        random_id = random.randint(1, 1010)
        return await _get_pokemon_data(str(random_id))
    except Exception as e:
        return {"error": f"Error al obtener Pokémon aleatorio: {str(e)}"}

async def run_random_pokemon_test():
    """Ejecuta múltiples pruebas de Pokémon aleatorio"""
    print("🧪 PRUEBA ESPECÍFICA: get_random_pokemon CORREGIDA")
    print("=" * 50)
    
    for i in range(5):
        print(f"\n📋 Prueba #{i+1} - Pokémon aleatorio:")
        result = await test_get_random_pokemon()
        
        if "error" in result:
            print(f"❌ Error: {result['error']}")
        else:
            print(f"✅ Éxito: {result['name']} (ID: {result['id']})")
            print(f"   Tipos: {', '.join(result['types'])}")
            print(f"   HP: {result['stats']['hp']}, Attack: {result['stats']['attack']}")
            print(f"   Altura: {result['height']}m, Peso: {result['weight']}kg")
    
    print(f"\n🎉 Prueba de get_random_pokemon completada!")

if __name__ == "__main__":
    asyncio.run(run_random_pokemon_test())
