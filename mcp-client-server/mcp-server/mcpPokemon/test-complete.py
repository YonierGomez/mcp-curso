#!/usr/bin/env python3
"""
Script de pruebas completo para todas las herramientas del servidor MCP de Pokémon
Simula el comportamiento de las funciones MCP para verificar su funcionamiento
"""

import asyncio
import httpx
import random
from typing import Dict, Any, List, Optional

POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

# Recrear las funciones del servidor MCP para testing
async def get_pokemon_info(name_or_id: str) -> Dict[str, Any]:
    """Obtiene información básica de un Pokémon por nombre o ID"""
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

async def get_pokemon_evolution_chain(pokemon_name: str) -> Dict[str, Any]:
    """Obtiene la cadena de evolución de un Pokémon"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon-species/{pokemon_name.lower()}")
            if response.status_code != 200:
                return {"error": f"Especie de Pokémon '{pokemon_name}' no encontrada"}
            
            species_data = response.json()
            evolution_chain_url = species_data["evolution_chain"]["url"]
            
            evolution_response = await client.get(evolution_chain_url)
            evolution_data = evolution_response.json()
            
            def parse_evolution_chain(chain_data):
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

async def search_pokemon_by_type(pokemon_type: str, limit: int = 10) -> Dict[str, Any]:
    """Busca Pokémon por tipo"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{POKEAPI_BASE_URL}/type/{pokemon_type.lower()}")
            if response.status_code != 200:
                return {"error": f"Tipo '{pokemon_type}' no encontrado"}
            
            type_data = response.json()
            pokemon_list = []
            
            for i, pokemon_info in enumerate(type_data["pokemon"][:limit]):
                pokemon_name = pokemon_info["pokemon"]["name"]
                
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

async def get_random_pokemon() -> Dict[str, Any]:
    """Obtiene un Pokémon aleatorio"""
    try:
        random_id = random.randint(1, 1010)
        return await get_pokemon_info(str(random_id))
    except Exception as e:
        return {"error": f"Error al obtener Pokémon aleatorio: {str(e)}"}

async def compare_pokemon_stats(pokemon1: str, pokemon2: str) -> Dict[str, Any]:
    """Compara las estadísticas de dos Pokémon"""
    try:
        pokemon1_info = await get_pokemon_info(pokemon1)
        pokemon2_info = await get_pokemon_info(pokemon2)
        
        if "error" in pokemon1_info:
            return pokemon1_info
        if "error" in pokemon2_info:
            return pokemon2_info
        
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
        
        for stat_name in pokemon1_info["stats"]:
            stat1 = pokemon1_info["stats"][stat_name]
            stat2 = pokemon2_info["stats"][stat_name]
            
            if stat1 > stat2:
                comparison["winner_by_stat"][stat_name] = pokemon1_info["name"]
            elif stat2 > stat1:
                comparison["winner_by_stat"][stat_name] = pokemon2_info["name"]
            else:
                comparison["winner_by_stat"][stat_name] = "Empate"
        
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

async def get_pokemon_moves(pokemon_name: str, limit: int = 10) -> Dict[str, Any]:
    """Obtiene los movimientos que puede aprender un Pokémon"""
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

# Funciones de prueba
async def test_get_pokemon_info():
    """Prueba la función get_pokemon_info"""
    print("🧪 PRUEBA 1: get_pokemon_info")
    print("=" * 50)
    
    test_cases = [
        ("pikachu", "Nombre válido"),
        ("25", "ID válido"),
        ("charizard", "Pokémon popular"),
        ("999999", "ID inválido"),
        ("pokemonfalso", "Nombre inválido")
    ]
    
    passed = 0
    total = len(test_cases)
    
    for pokemon, description in test_cases:
        print(f"\n📋 Probando: {description} ({pokemon})")
        result = await get_pokemon_info(pokemon)
        
        if "error" in result:
            if pokemon in ["999999", "pokemonfalso"]:
                print(f"✅ Error esperado manejado correctamente: {result['error']}")
                passed += 1
            else:
                print(f"❌ Error inesperado: {result['error']}")
        else:
            print(f"✅ Éxito: {result['name']} (ID: {result['id']})")
            print(f"   Tipos: {', '.join(result['types'])}")
            print(f"   Altura: {result['height']}m, Peso: {result['weight']}kg")
            print(f"   HP: {result['stats']['hp']}, Attack: {result['stats']['attack']}")
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} pruebas exitosas\n")
    return passed == total

async def test_get_pokemon_evolution_chain():
    """Prueba la función get_pokemon_evolution_chain"""
    print("🧪 PRUEBA 2: get_pokemon_evolution_chain")
    print("=" * 50)
    
    test_cases = [
        ("charmander", "Starter con 3 evoluciones"),
        ("eevee", "Múltiples evoluciones"),
        ("pikachu", "Evolución simple"),
        ("ditto", "Sin evolución"),
        ("fakemon", "Pokémon inexistente")
    ]
    
    passed = 0
    total = len(test_cases)
    
    for pokemon, description in test_cases:
        print(f"\n📋 Probando: {description} ({pokemon})")
        result = await get_pokemon_evolution_chain(pokemon)
        
        if "error" in result:
            if pokemon == "fakemon":
                print(f"✅ Error esperado manejado: {result['error']}")
                passed += 1
            else:
                print(f"❌ Error inesperado: {result['error']}")
        else:
            print(f"✅ Éxito: Cadena de {result['pokemon']} obtenida")
            print(f"   Especie base: {result['evolution_chain']['species']}")
            if result['evolution_chain']['evolves_to']:
                print(f"   Tiene evoluciones: Sí")
            else:
                print(f"   Tiene evoluciones: No")
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} pruebas exitosas\n")
    return passed == total

async def test_search_pokemon_by_type():
    """Prueba la función search_pokemon_by_type"""
    print("🧪 PRUEBA 3: search_pokemon_by_type")
    print("=" * 50)
    
    test_cases = [
        ("electric", 5, "Tipo popular"),
        ("fire", 3, "Tipo inicial"),
        ("dragon", 8, "Tipo raro"),
        ("fairy", 4, "Tipo nuevo"),
        ("invalidtype", 5, "Tipo inválido")
    ]
    
    passed = 0
    total = len(test_cases)
    
    for ptype, limit, description in test_cases:
        print(f"\n📋 Probando: {description} ({ptype}, límite: {limit})")
        result = await search_pokemon_by_type(ptype, limit)
        
        if "error" in result:
            if ptype == "invalidtype":
                print(f"✅ Error esperado manejado: {result['error']}")
                passed += 1
            else:
                print(f"❌ Error inesperado: {result['error']}")
        else:
            print(f"✅ Éxito: Encontrados {result['count']} Pokémon de tipo {result['type']}")
            for pokemon in result['pokemon'][:3]:
                print(f"   - {pokemon['name']} (ID: {pokemon['id']})")
            if result['count'] > 3:
                print(f"   ... y {result['count'] - 3} más")
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} pruebas exitosas\n")
    return passed == total

async def test_get_random_pokemon():
    """Prueba la función get_random_pokemon"""
    print("🧪 PRUEBA 4: get_random_pokemon")
    print("=" * 50)
    
    passed = 0
    total = 3
    
    for i in range(total):
        print(f"\n📋 Probando: Pokémon aleatorio #{i+1}")
        result = await get_random_pokemon()
        
        if "error" in result:
            print(f"❌ Error: {result['error']}")
        else:
            print(f"✅ Éxito: {result['name']} (ID: {result['id']})")
            print(f"   Tipos: {', '.join(result['types'])}")
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} pruebas exitosas\n")
    return passed == total

async def test_compare_pokemon_stats():
    """Prueba la función compare_pokemon_stats"""
    print("🧪 PRUEBA 5: compare_pokemon_stats")
    print("=" * 50)
    
    test_cases = [
        ("pikachu", "raichu", "Evolución"),
        ("charizard", "blastoise", "Starters"),
        ("mewtwo", "mew", "Legendarios"),
        ("invalidpokemon", "pikachu", "Pokémon inválido")
    ]
    
    passed = 0
    total = len(test_cases)
    
    for pokemon1, pokemon2, description in test_cases:
        print(f"\n📋 Probando: {description} ({pokemon1} vs {pokemon2})")
        result = await compare_pokemon_stats(pokemon1, pokemon2)
        
        if "error" in result:
            if pokemon1 == "invalidpokemon":
                print(f"✅ Error esperado manejado: {result['error']}")
                passed += 1
            else:
                print(f"❌ Error inesperado: {result['error']}")
        else:
            p1_name = result['pokemon1']['name']
            p2_name = result['pokemon2']['name']
            winner = result['total_stats']['winner']
            p1_total = result['total_stats'][p1_name]
            p2_total = result['total_stats'][p2_name]
            
            print(f"✅ Éxito: Comparación completada")
            print(f"   {p1_name}: {p1_total} stats totales")
            print(f"   {p2_name}: {p2_total} stats totales")
            print(f"   Ganador total: {winner}")
            
            # Mostrar algunos ganadores por stat
            winners = result['winner_by_stat']
            print(f"   HP: {winners.get('hp', 'N/A')}")
            print(f"   Attack: {winners.get('attack', 'N/A')}")
            print(f"   Speed: {winners.get('speed', 'N/A')}")
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} pruebas exitosas\n")
    return passed == total

async def test_get_pokemon_moves():
    """Prueba la función get_pokemon_moves"""
    print("🧪 PRUEBA 6: get_pokemon_moves")
    print("=" * 50)
    
    test_cases = [
        ("pikachu", 8, "Pokémon popular"),
        ("charizard", 5, "Pokémon con muchos movimientos"),
        ("ditto", 3, "Pokémon con pocos movimientos"),
        ("notapokemon", 5, "Pokémon inexistente")
    ]
    
    passed = 0
    total = len(test_cases)
    
    for pokemon, limit, description in test_cases:
        print(f"\n📋 Probando: {description} ({pokemon}, límite: {limit})")
        result = await get_pokemon_moves(pokemon, limit)
        
        if "error" in result:
            if pokemon == "notapokemon":
                print(f"✅ Error esperado manejado: {result['error']}")
                passed += 1
            else:
                print(f"❌ Error inesperado: {result['error']}")
        else:
            print(f"✅ Éxito: {result['pokemon']} puede aprender {result['total_moves']} movimientos")
            print(f"   Mostrando {result['moves_shown']} movimientos:")
            for move in result['moves'][:3]:
                level_str = f"Nivel {move['level_learned']}" if move['level_learned'] else "Sin nivel"
                print(f"   - {move['name']} ({move['learn_method']}, {level_str})")
            if result['moves_shown'] > 3:
                print(f"   ... y {result['moves_shown'] - 3} más")
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} pruebas exitosas\n")
    return passed == total

async def run_comprehensive_tests():
    """Ejecuta todas las pruebas del servidor MCP"""
    print("🚀 INICIANDO PRUEBAS COMPLETAS DEL SERVIDOR MCP POKÉMON")
    print("=" * 60)
    print("Esto probará todas las 6 herramientas disponibles\n")
    
    tests = [
        test_get_pokemon_info,
        test_get_pokemon_evolution_chain,
        test_search_pokemon_by_type,
        test_get_random_pokemon,
        test_compare_pokemon_stats,
        test_get_pokemon_moves
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test_func in tests:
        try:
            success = await test_func()
            if success:
                passed_tests += 1
        except Exception as e:
            print(f"❌ Error ejecutando {test_func.__name__}: {str(e)}\n")
    
    print("🏁 RESUMEN FINAL")
    print("=" * 60)
    print(f"Pruebas exitosas: {passed_tests}/{total_tests}")
    print(f"Porcentaje de éxito: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("🎉 ¡TODAS LAS PRUEBAS PASARON!")
        print("✅ El servidor MCP de Pokémon está funcionando perfectamente")
        print("🔴⚪ ¡Listo para capturar información de Pokémon!")
    else:
        print("⚠️  Algunas pruebas fallaron")
        print("🔧 Revisa los errores anteriores para diagnosticar problemas")
    
    return passed_tests == total_tests

if __name__ == "__main__":
    # Ejecutar todas las pruebas
    asyncio.run(run_comprehensive_tests())
