class UIManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.unitDrawer = document.getElementById('unit-drawer');
        this.unitName = document.getElementById('unit-name');
        this.unitHp = document.getElementById('unit-hp');
        this.unitDmg = document.getElementById('unit-dmg');
        this.actionPoints = document.getElementById('action-points');
        this.turnTimer = document.getElementById('turn-timer');
        this.endTurnBtn = document.getElementById('end-turn-btn');
        this.unitActions = document.getElementById('unit-actions');

        // Initially, the drawer is collapsed
        this.updateUnitDetails(null);

        this.endTurnBtn.addEventListener('click', () => {
            this.gameManager.endTurn();
        });
    }

    updateUnitDetails(unit, forceRefresh = false) {
        // If we are just refreshing the currently selected unit, don't change the unit itself
        if (forceRefresh && this.currentlySelectedUnit) {
            unit = this.currentlySelectedUnit;
        }

        if (unit) {
            this.createActionButtons(unit);
            this.currentlySelectedUnit = unit;
            this.unitName.textContent = unit.name;
            this.unitHp.textContent = `${unit.health} / ${unit.maxHealth}`;
            this.unitDmg.textContent = unit.damage;
            this.unitDrawer.classList.remove('collapsed');
        } else {
            this.currentlySelectedUnit = null;
            this.unitName.textContent = '-';
            this.unitHp.textContent = '- / -';
            this.unitDmg.textContent = '-';
            this.unitDrawer.classList.add('collapsed');
            this.unitActions.innerHTML = '';
        }
    }

    showGameOver(message) {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over-screen';
        gameOverScreen.innerHTML = `<h1>${message}</h1>`;
        document.body.appendChild(gameOverScreen);
    }

    updateHUD(ap, time) {
        if (ap !== undefined) {
            this.actionPoints.textContent = `${ap} / ${this.gameManager.maxAP}`;
        }
        if (time !== undefined) {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            this.turnTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        if (ap.gameOver) {
            this.showGameOver('You Lose!'); // Or determine winner properly later
        }
    }
    createActionButtons(unit) {
        this.unitActions.innerHTML = ''; // Clear previous buttons

        // Check if the unit is a Submarine and sonar hasn't been used
        if (unit.name === 'Submarine' && !unit.sonarUsed) {
            const sonarButton = document.createElement('button');
            sonarButton.className = 'action-btn';
            sonarButton.textContent = 'Use Sonar (2 AP)';
            sonarButton.onclick = () => {
                if (this.gameManager.spendAP(2)) {
                    this.sonarSystem.ping(unit);
                    unit.useSonar();
                    this.createActionButtons(unit); // Re-render buttons to remove the sonar button
                }
            };
            this.unitActions.appendChild(sonarButton);
        }
    }
}

export { UIManager };
