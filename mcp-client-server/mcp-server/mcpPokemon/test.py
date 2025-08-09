#!/usr/bin/env python3
"""
Script de pruebas para el servidor MCP de Pokémon
"""

import asyncio
import httpx

POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

async def test_get_pokemon_info():
    """Prueba la función get_pokemon_info"""
    print("🧪 Probando get_pokemon_info...")
    
    # Prueba con nombre
    result = await get_pokemon_info("pikachu")
    print(f"✅ Pikachu: {result['name'] if 'name' in result else 'Error'}")
    
    # Prueba con ID
    result = await get_pokemon_info("25")
    print(f"✅ Pokémon ID 25: {result['name'] if 'name' in result else 'Error'}")
    
    # Prueba con Pokémon no existente
    result = await get_pokemon_info("pokemonnoexiste")
    print(f"✅ Pokémon no existente: {'Error manejado correctamente' if 'error' in result else 'Error no manejado'}")
    
    print()

async def test_get_pokemon_evolution_chain():
    """Prueba la función get_pokemon_evolution_chain"""
    print("🧪 Probando get_pokemon_evolution_chain...")
    
    result = await get_pokemon_evolution_chain("charmander")
    if 'error' not in result:
        print(f"✅ Cadena de evolución de Charmander obtenida correctamente")
        print(f"   Especie base: {result['evolution_chain']['species']}")
    else:
        print(f"❌ Error: {result['error']}")
    
    print()

async def test_search_pokemon_by_type():
    """Prueba la función search_pokemon_by_type"""
    print("🧪 Probando search_pokemon_by_type...")
    
    result = await search_pokemon_by_type("electric", 5)
    if 'error' not in result:
        print(f"✅ Encontrados {result['count']} Pokémon de tipo {result['type']}")
        for pokemon in result['pokemon'][:3]:  # Mostrar solo los primeros 3
            print(f"   - {pokemon['name']} (ID: {pokemon['id']})")
    else:
        print(f"❌ Error: {result['error']}")
    
    print()

async def test_get_random_pokemon():
    """Prueba la función get_random_pokemon"""
    print("🧪 Probando get_random_pokemon...")
    
    result = await get_random_pokemon()
    if 'error' not in result:
        print(f"✅ Pokémon aleatorio: {result['name']} (ID: {result['id']})")
    else:
        print(f"❌ Error: {result['error']}")
    
    print()

async def test_compare_pokemon_stats():
    """Prueba la función compare_pokemon_stats"""
    print("🧪 Probando compare_pokemon_stats...")
    
    result = await compare_pokemon_stats("pikachu", "raichu")
    if 'error' not in result:
        print(f"✅ Comparación entre {result['pokemon1']['name']} y {result['pokemon2']['name']}")
        print(f"   Ganador total: {result['total_stats']['winner']}")
        print(f"   Total stats - {result['pokemon1']['name']}: {result['total_stats'][result['pokemon1']['name']]}")
        print(f"   Total stats - {result['pokemon2']['name']}: {result['total_stats'][result['pokemon2']['name']]}")
    else:
        print(f"❌ Error: {result['error']}")
    
    print()

async def test_get_pokemon_moves():
    """Prueba la función get_pokemon_moves"""
    print("🧪 Probando get_pokemon_moves...")
    
    result = await get_pokemon_moves("pikachu", 5)
    if 'error' not in result:
        print(f"✅ Movimientos de {result['pokemon']} (mostrando {result['moves_shown']} de {result['total_moves']})")
        for move in result['moves'][:3]:  # Mostrar solo los primeros 3
            level_info = f"Nivel {move['level_learned']}" if move['level_learned'] else "N/A"
            print(f"   - {move['name']} ({move['learn_method']}, {level_info})")
    else:
        print(f"❌ Error: {result['error']}")
    
    print()

async def run_all_tests():
    """Ejecuta todas las pruebas"""
    print("🚀 Iniciando pruebas del servidor MCP de Pokémon\n")
    
    try:
        await test_get_pokemon_info()
        await test_get_pokemon_evolution_chain()
        await test_search_pokemon_by_type()
        await test_get_random_pokemon()
        await test_compare_pokemon_stats()
        await test_get_pokemon_moves()
        
        print("🎉 ¡Todas las pruebas completadas!")
        
    except Exception as e:
        print(f"❌ Error durante las pruebas: {str(e)}")

if __name__ == "__main__":
    # Ejecutar todas las pruebas
    asyncio.run(run_all_tests())
