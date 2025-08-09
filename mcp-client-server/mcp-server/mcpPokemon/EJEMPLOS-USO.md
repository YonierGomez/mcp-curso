# Ejemplos de Uso - Servidor MCP Pokémon 🔴⚪

Este documento contiene ejemplos prácticos de cómo usar las herramientas del servidor MCP de Pokémon.

## 🔧 Configuración Inicial

Antes de usar el servidor, asegúrate de tenerlo configurado en tu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "/home/ney/IA/.venv/bin/python",
      "args": ["/home/ney/IA/mcp-client-server/mcp-server/mcpPokemon/index.py"]
    }
  }
}
```

## 📝 Ejemplos de Uso

### 1. Obtener información básica de un Pokémon

```
¿Puedes obtener información sobre Pikachu?
```

**Respuesta esperada:**
- Nombre, ID, altura y peso
- Tipos (electric)
- Habilidades (static, lightning-rod)
- Estadísticas completas (HP, Attack, Defense, etc.)
- Sprites (imágenes front/back, normal/shiny)

### 2. Comparar dos Pokémon

```
Compara las estadísticas entre Charizard y Blastoise
```

**Respuesta esperada:**
- Estadísticas de ambos Pokémon
- Ganador por cada estadística individual
- Ganador por total de estadísticas

### 3. Buscar Pokémon por tipo

```
¿Qué Pokémon de tipo fuego existen? Muestra los primeros 8
```

**Funciones utilizadas:**
- `search_pokemon_by_type` con parámetros: tipo="fire", limit=8

### 4. Cadena de evolución

```
¿Cuál es la cadena de evolución completa de Squirtle?
```

**Respuesta esperada:**
- Squirtle → Wartortle → Blastoise
- Niveles de evolución y triggers

### 5. Pokémon aleatorio

```
Muéstrame un Pokémon aleatorio
```

**Funciones utilizadas:**
- `get_random_pokemon`

### 6. Movimientos de un Pokémon

```
¿Qué movimientos puede aprender Lucario? Muestra los primeros 10
```

**Respuesta esperada:**
- Lista de movimientos
- Método de aprendizaje (level-up, TM, etc.)
- Nivel en el que se aprende (si aplica)

## 🎮 Casos de Uso Avanzados

### Análisis de equipo competitivo

```
Necesito formar un equipo balanceado. Compara las estadísticas de estos Pokémon:
1. Garchomp vs Salamence
2. Rotom-Wash vs Magnezone  
3. Ferrothorn vs Skarmory

¿Cuál recomendarías para cada rol?
```

### Información para construcción de equipo

```
Busca Pokémon de tipo acero que tengan buenas estadísticas defensivas. 
Luego muéstrame los movimientos que puede aprender Metagross.
```

### Exploración de evoluciones

```
Quiero conocer todas las evoluciones posibles de Eevee. 
¿Puedes mostrarme su cadena de evolución completa?
```

### Pokémon para principiantes

```
¿Puedes recomendarme 5 Pokémon de tipo agua que sean buenos para principiantes? 
Muestra sus estadísticas y habilidades.
```

## 🔥 Preguntas Frecuentes y Ejemplos

### ¿Cómo encontrar Pokémon legendarios?

```
Busca información sobre Mewtwo, Mew y Rayquaza. 
¿Cuál tiene mejores estadísticas de ataque?
```

### ¿Qué Pokémon tiene las mejores estadísticas defensivas?

```
Compara las estadísticas defensivas de Shuckle, Steelix y Aggron
```

### ¿Cuáles son los Pokémon más rápidos?

```
Busca Pokémon de tipo electric y compara sus estadísticas de velocidad
```

### ¿Qué evoluciones requieren piedras evolutivas?

```
Muéstrame las cadenas de evolución de Pikachu, Eevee y Growlithe
```

## 🎯 Tips para Uso Efectivo

1. **Usa nombres en inglés**: Los nombres de Pokémon deben estar en inglés (ej: "charizard" no "charizard español")

2. **IDs numéricos**: Puedes usar tanto nombres como IDs numéricos (ej: "25" para Pikachu)

3. **Tipos válidos**: Los tipos deben estar en inglés: fire, water, electric, grass, psychic, etc.

4. **Límites razonables**: Para búsquedas por tipo, usa límites razonables (5-20) para evitar respuestas muy largas

5. **Combinación de herramientas**: Puedes combinar múltiples consultas para análisis más profundos

## 🚀 Ejemplos de Análisis Completo

### Análisis de Starter Pokémon

```
Quiero analizar los Pokémon iniciales de Kanto:
1. Obtén información de Bulbasaur, Charmander y Squirtle
2. Compara sus estadísticas finales: Venusaur vs Charizard vs Blastoise  
3. Muestra las cadenas de evolución de los tres
4. ¿Qué movimientos únicos puede aprender cada uno?
```

### Construyendo un Equipo Competitivo

```
Ayúdame a construir un equipo competitivo:
1. Busca Pokémon de tipo dragon con buenas estadísticas
2. Compara Garchomp vs Salamence vs Dragonite
3. Para cada uno, muestra 5 movimientos que puedan aprender
4. ¿Cuál recomendarías como sweeper físico?
```

---

💡 **Recuerda**: El servidor MCP de Pokémon utiliza la PokeAPI oficial, por lo que toda la información es precisa y actualizada. ¡Disfruta explorando el mundo Pokémon! 🌟
