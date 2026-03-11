const GAME_STATE = {
    PLAYER_TURN: 'PLAYER_TURN',
    OPPONENT_TURN: 'OPPONENT_TURN',
    GAME_OVER: 'GAME_OVER',
};

class GameManager {
    constructor(onStateChange) {
        this.state = GAME_STATE.PLAYER_TURN;
        this.maxAP = 3;
        this.currentAP = this.maxAP;
        this.turnTimeLimit = 90; // seconds
        this.timer = null;
        this.onStateChange = onStateChange; // Callback to update UI
    }

    startTurn() {
        this.currentAP = this.maxAP;
        let timeLeft = this.turnTimeLimit;

        this.onStateChange({ ap: this.currentAP, time: timeLeft });

        this.timer = setInterval(() => {
            timeLeft--;
            this.onStateChange({ time: timeLeft });
            if (timeLeft <= 0) {
                this.endTurn();
            }
        }, 1000);
    }

    endTurn() {
        clearInterval(this.timer);
        console.log("Turn ended!");
        // For now, we'll just start the player's turn again immediately.
        // Later, this will switch to the opponent.
        this.startTurn();
    }

    spendAP(cost) {
        if (this.currentAP >= cost) {
            this.currentAP -= cost;
            this.onStateChange({ ap: this.currentAP });
            return true;
        }
        return false;
    }

    isPlayerTurn() {
        return this.state === GAME_STATE.PLAYER_TURN;
    }

    checkWinLossConditions(damagedUnit) {
        if (damagedUnit.name === 'Aircraft Carrier' && damagedUnit.health < damagedUnit.maxHealth * 0.1) {
            this.state = GAME_STATE.GAME_OVER;
            console.log('Game Over! Carrier has taken critical damage.');
            this.onStateChange({ gameOver: true });
        }
    }
}

export { GameManager };