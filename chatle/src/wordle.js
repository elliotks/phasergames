export default class Wordle {
    constructor(word, attempts = 6) {
        this.word = word.toLowerCase();
        this.length = word.length;
        this.attempts = attempts;
        this.current = 0;
        this.outcome = "playing";

        this.init();
    }

    init () {
        this.status = [];

        for (let i = 0; i < this.attempts; i++) {
            let row = Array(this.length).fill({letter: "", color: ""});
            this.status.push(row);
        }
    }

    guess(word) {
        this.nope = this.word.split("");
        this.taken = [];
        for (let i = 0; i < this.length; i++) {
            let currentChar = word.charAt(i).toLowerCase();
            if (this.isSameCharacter(currentChar, i)) {
                if (!this.taken.includes(i)) {
                    this.removeFromNope(currentChar)
                    this.taken.push(i);
                }

                this.status[this.current][i] = {letter: currentChar, color: 0x00ff00 };
            }
        }

        for (let i = 0; i < this.length; i++) {
            let currentChar = word.charAt(i).toLowerCase();
            if (this.isSomeWhereElse(currentChar)) {
                this.status[this.current][i] = {letter: currentChar, color: 0xffa500 };
                this.removeFromNope(currentChar)
            } else if (!this.taken.includes(i))
                this.status[this.current][i] = {letter: currentChar, color: 0xcccccc };
        }

        this.setOutcome()
    }

    next () {
        if (this.current < this.attempts)
            this.current++;
    }

    setOutcome () {
        if (this.word === this.status[this.current].map(s => s.letter).join(""))
            this.outcome = "win";
        else if (this.current+1 === this.attempts)
            this.outcome = "lose"
    }

    removeFromNope(char) {
        this.nope.splice(this.nope.indexOf(char), 1)
    }

    isSameCharacter (char, i) {
        return char === this.word.charAt(i);
    }

    isSomeWhereElse(char) {
        return this.nope.includes(char)
    }

    reset () {
        this.current--;
        this.status[this.current] = Array(this.length).fill({letter: "", color: ""});
    }

    currentStatus() {
        return this.status[this.current];
    }
}