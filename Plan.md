# Viking Ship Duel: Project Roadmap

This document outlines the development plan to take the project from its current state (a technical prototype) to a fully playable, themed game.

---

### Phase 1: Implementing Core Battleship Rules

This phase focuses on implementing the essential mechanics that define the Battleship game genre.

1.  **Hide the Enemy Fleet:** The primary goal is to make the opponent's ships invisible. The core gameplay relies on the player not knowing the enemy's ship positions.

2.  **Ship Sinking Logic:** The `Ship` class will be upgraded to track hits. When the number of hits equals the ship's size, it will be marked as 'sunk'.

3.  **Reveal Sunk Ships:** When an opponent's ship is sunk, its 3D model will be made visible on their board. Its color will be changed to signify that it is destroyed, providing visual feedback to the player.

---

### Phase 2: Creating the Full Game Loop

This phase focuses on building the turn-based structure and a clear win/loss state.

4.  **Turn-Based System & Opponent AI:** A state machine will be implemented to manage turns (`PLAYER_TURN`, `OPPONENT_TURN`). After the player fires, the turn will switch to a simple AI opponent who will fire at a random, untargeted cell on the player's grid.

5.  **Win/Loss Condition:** The game logic will be updated to check if all ships belonging to a player have been sunk. When this condition is met, the game will end and declare a winner.

6.  **Basic User Interface (UI):** A simple HTML/CSS overlay will be added to display the current game state, such as "Your Turn," "Opponent's Turn," "You Win!," or "You Lose!"

---

### Phase 3: The Viking Theme & Polish

This final phase focuses on enhancing the user experience with thematic assets, and improved audio-visual feedback.

7.  **Viking Ship Models:** The current placeholder block models for ships will be replaced with more detailed, Viking-themed 3D models (e.g., longships like the Drakkar or Karve).

8.  **Visual Effects (VFX):** The visual feedback for game actions will be improved. This includes custom animations/effects for firing a shot, a water splash for a 'miss', and an explosion or fire effect for a 'hit'.

9.  **Sound Design (SFX):** Sound effects will be added for key game events (firing, hits, misses, sinking a ship) along with ambient background audio (e.g., the sound of the sea) to create a more immersive experience.
