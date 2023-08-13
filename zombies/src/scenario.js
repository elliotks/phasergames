import Tile from "./tile";

export default class Scenario {
    constructor (width, height, tileSize = 32) {
        this.columnCount = parseInt(width / 32);;
        this.rowCount = parseInt(height / 32);
        this.init();
    }

    init (width, height) {
        const rows = [];

        for(let y = 0; y < this.rowCount;y++) {
            const row = new Array(this.columnCount).fill(0).map((tile, x) => new Tile(x, y));
            rows.push(row);
        }

        this.map = rows;

        this.createSlots();
    }

    createSlots() {
        this.slots = this.map.flat().sort(() => (Math.random() > .5) ? 1 : -1);
    }

    addChopper(chopper) {
        const {x, y} = this._getSlot();
        this.map[y][x].addChopper(chopper);
        return {x, y}
    }

    addPlayer(player) {
        const {x, y} = this._getSlot();
        this.map[y][x].addPlayer(player);
        return {x, y}
    }


    move(player, x, y) {
        const cell = this.findPlayerCell(player)
        const finalX = x + cell.x >= this.columnCount || x + cell.x < 0 ? this.columnCount - 1 : (x + cell.x);
        const finalY = y + cell.y >= this.rowCount || y + cell.y < 0 ? this.rowCount - 1 : (y + cell.y);
        cell.removePlayer(player);
        this.map[finalY][finalY].addPlayer(player);

        return {movedX: finalX, movedY: finalY}
    }

    findPlayerCell(player) {
        return this.map.flat().find(tile => tile.players.find(p => p.name === player.name));
    }

    _getSlot() {
        if (this.slots.length === 0) { this.createSlots()}
        const slot = this.slots.pop();
        console.log("About to return: ", slot)
        return slot;
    }

    zombieInside (x, y) {
        return this.map[y][x].zombieInside()
    }

    chopperInside (x, y) {
        return this.map[y][x].chopperInside()
    }

    print() {
        for (let i = 0; i < this.rowCount;i++) {
            console.log(i, this.map[i].map(cell => cell.print()).join(""))
        }
    }
}