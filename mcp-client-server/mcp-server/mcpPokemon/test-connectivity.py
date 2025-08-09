#!/usr/bin/env python3
"""
Script de pruebas simplificado para verificar la conectividad con PokeAPI
"""

import asyncio
import httpx

POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

async def test_pokeapi_connection():
    """Prueba la conexión básica con PokeAPI"""
    print("🧪 Probando conexión con PokeAPI...")
    
    try:
        async with httpx.AsyncClient() as client:
            # Prueba básica con Pikachu
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon/pikachu")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Conexión exitosa!")
                print(f"   Pokémon: {data['name'].title()}")
                print(f"   ID: {data['id']}")
                print(f"   Altura: {data['height']/10} metros")
                print(f"   Peso: {data['weight']/10} kg")
                print(f"   Tipos: {[t['type']['name'] for t in data['types']]}")
                return True
            else:
                print(f"❌ Error en la respuesta: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Error de conexión: {str(e)}")
        return False

async def test_type_search():
    """Prueba la búsqueda por tipo"""
    print("\n🧪 Probando búsqueda por tipo...")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{POKEAPI_BASE_URL}/type/electric")
            if response.status_code == 200:
                data = response.json()
                pokemon_count = len(data['pokemon'])
                print(f"✅ Búsqueda por tipo exitosa!")
                print(f"   Tipo: Electric")
                print(f"   Pokémon encontrados: {pokemon_count}")
                
                # Mostrar algunos ejemplos
                print("   Ejemplos:")
                for i, pokemon_info in enumerate(data['pokemon'][:3]):
                    print(f"   - {pokemon_info['pokemon']['name'].title()}")
                
                return True
            else:
                print(f"❌ Error en la respuesta: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

async def test_evolution_chain():
    """Prueba la cadena de evolución"""
    print("\n🧪 Probando cadena de evolución...")
    
    try:
        async with httpx.AsyncClient() as client:
            # Obtener información de la especie
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon-species/charmander")
            if response.status_code == 200:
                species_data = response.json()
                evolution_chain_url = species_data["evolution_chain"]["url"]
                
                # Obtener cadena de evolución
                evolution_response = await client.get(evolution_chain_url)
                if evolution_response.status_code == 200:
                    evolution_data = evolution_response.json()
                    print(f"✅ Cadena de evolución obtenida!")
                    print(f"   Especie base: {evolution_data['chain']['species']['name'].title()}")
                    
                    # Mostrar evoluciones
                    if evolution_data['chain']['evolves_to']:
                        for evolution in evolution_data['chain']['evolves_to']:
                            print(f"   Evoluciona a: {evolution['species']['name'].title()}")
                    
                    return True
                else:
                    print(f"❌ Error obteniendo evolución: {evolution_response.status_code}")
                    return False
            else:
                print(f"❌ Error obteniendo especie: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

async def run_connectivity_tests():
    """Ejecuta todas las pruebas de conectividad"""
    print("🚀 Iniciando pruebas de conectividad con PokeAPI\n")
    
    tests_passed = 0
    total_tests = 3
    
    if await test_pokeapi_connection():
        tests_passed += 1
    
    if await test_type_search():
        tests_passed += 1
    
    if await test_evolution_chain():
        tests_passed += 1
    
    print(f"\n📊 Resultado: {tests_passed}/{total_tests} pruebas exitosas")
    
    if tests_passed == total_tests:
        print("🎉 ¡Todas las pruebas de conectividad pasaron!")
        print("✅ El servidor MCP está listo para usar")
    else:
        print("⚠️  Algunas pruebas fallaron. Revisa tu conexión a internet.")

if __name__ == "__main__":
    asyncio.run(run_connectivity_tests())
