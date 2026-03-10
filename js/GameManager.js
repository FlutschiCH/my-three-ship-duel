class GameManager {
    constructor(playerShips) {
        this.playerShips = playerShips;
        this.gridSize = 10;
        
        // Create a lookup for all occupied cells
        this.occupiedCells = new Map(); // Using a Map for efficient lookups
        this.playerShips.forEach(ship => {
            ship.occupiedCells.forEach(cell => {
                const key = `${cell.x},${cell.z}`;
                this.occupiedCells.set(key, ship);
            });
        });

        this.firedAt = new Set(); // Keep track of cells already fired at
    }

    areAllShipsSunk() {
        return this.playerShips.every(ship => ship.isSunk());
    }

    fireAt(x, z) {
        const key = `${x},${z}`;

        if (this.firedAt.has(key)) {
            console.log(`You already fired at (${x}, ${z})`);
            return null; // Indicates an invalid move
        }

        this.firedAt.add(key);

        if (this.occupiedCells.has(key)) {
            const ship = this.occupiedCells.get(key);
            ship.hit();
            
            if (ship.isSunk()) {
                console.log(`SUNK! You have destroyed a ship of size ${ship.size}!`);
                if (this.areAllShipsSunk()) {
                    console.log("GAME OVER! You have defeated the enemy fleet!");
                }
            } else {
                console.log(`Hit! at (${x}, ${z})`);
            }

            return { result: 'hit', ship: ship };
        } else {
            console.log(`Miss! at (${x}, ${z})`);
            return { result: 'miss' };
        }
    }
}

export { GameManager };