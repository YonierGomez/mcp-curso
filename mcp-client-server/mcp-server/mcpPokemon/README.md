# Servidor MCP Pokémon 🔴⚪

Un servidor de Model Context Protocol (MCP) que proporciona acceso a información detallada de Pokémon utilizando la [PokeAPI](https://pokeapi.co/). Desarrollado con FastMCP en Python.

## 🚀 Características

- **Información completa de Pokémon**: Obtén datos detallados incluyendo estadísticas, tipos, habilidades y sprites
- **Cadenas de evolución**: Explora las evoluciones completas de cualquier Pokémon
- **Búsqueda por tipo**: Encuentra Pokémon específicos por su tipo elemental
- **Pokémon aleatorio**: Descubre Pokémon de forma aleatoria
- **Comparación de estadísticas**: Compara las estadísticas entre dos Pokémon
- **Movimientos**: Lista los movimientos que puede aprender cada Pokémon

## 🛠️ Instalación

### Prerrequisitos

- Python 3.8+
- FastMCP
- httpx
- pydantic

### Instalación de dependencias

```bash
pip install fastmcp httpx pydantic
```

## 📋 Herramientas disponibles

### 1. `get_pokemon_info`
Obtiene información básica completa de un Pokémon.

**Parámetros:**
- `name_or_id` (string): Nombre o ID del Pokémon

**Ejemplo de uso:**
```python
await get_pokemon_info("pikachu")
await get_pokemon_info("25")
```

### 2. `get_pokemon_evolution_chain`
Obtiene la cadena de evolución completa de un Pokémon.

**Parámetros:**
- `pokemon_name` (string): Nombre del Pokémon

### 3. `search_pokemon_by_type`
Busca Pokémon por tipo elemental.

**Parámetros:**
- `pokemon_type` (string): Tipo de Pokémon (fire, water, electric, etc.)
- `limit` (int, opcional): Número máximo de resultados (default: 10)

### 4. `get_random_pokemon`
Obtiene un Pokémon seleccionado aleatoriamente.

**Sin parámetros**

### 5. `compare_pokemon_stats`
Compara las estadísticas entre dos Pokémon.

**Parámetros:**
- `pokemon1` (string): Nombre o ID del primer Pokémon
- `pokemon2` (string): Nombre o ID del segundo Pokémon

### 6. `get_pokemon_moves`
Obtiene los movimientos que puede aprender un Pokémon.

**Parámetros:**
- `pokemon_name` (string): Nombre del Pokémon
- `limit` (int, opcional): Número máximo de movimientos (default: 10)

## 🔧 Configuración en Claude Desktop

Agrega esta configuración a tu archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "python",
      "args": ["/ruta/completa/al/mcp-client-server/mcp-server/mcpPokemon/index.py"]
    }
  }
}
```

## 📊 Ejemplos de respuestas

### Información básica de Pokémon
```json
{
  "id": 25,
  "name": "Pikachu",
  "height": 0.4,
  "weight": 6.0,
  "base_experience": 112,
  "types": ["electric"],
  "abilities": ["static", "lightning-rod"],
  "stats": {
    "hp": 35,
    "attack": 55,
    "defense": 40,
    "special_attack": 50,
    "special_defense": 50,
    "speed": 90
  },
  "sprites": {
    "front_default": "https://...",
    "front_shiny": "https://...",
    "back_default": "https://...",
    "back_shiny": "https://..."
  }
}
```

### Comparación de estadísticas
```json
{
  "pokemon1": {
    "name": "Pikachu",
    "id": 25,
    "stats": {...}
  },
  "pokemon2": {
    "name": "Raichu",
    "id": 26,
    "stats": {...}
  },
  "winner_by_stat": {
    "hp": "Raichu",
    "attack": "Raichu",
    "speed": "Raichu"
  },
  "total_stats": {
    "Pikachu": 320,
    "Raichu": 485,
    "winner": "Raichu"
  }
}
```

## 🐛 Manejo de errores

El servidor maneja elegantemente los errores comunes:
- Pokémon no encontrado
- Tipos no válidos
- Errores de conectividad con la API
- Parámetros inválidos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu característica
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- [PokeAPI](https://pokeapi.co/) por proporcionar una API gratuita y completa
- [FastMCP](https://github.com/fastmcp/fastmcp) por el framework MCP
- La comunidad Pokémon por su apoyo continuo

---

¡Gotta catch 'em all! 🔴⚪
