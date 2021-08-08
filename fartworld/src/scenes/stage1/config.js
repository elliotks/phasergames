export default {
    door: { x: 200, y: 50 },
    start: { x: 60, y: 400 },
    beans: [
        { x: 100, y: 100, color: 0x00ff00 },
        { x: 200, y: 200, color: 0x00ff00 },
        { x: 100, y: 3, color: 0x00ff00 },
        { x: 200, y: 400, color: 0x00ff00 },
        { x: 180, y: 550, color: 0x00ff00 }
    ],
    redBeans: [
        { x: 200, y: 200, color: 0x00ff00 },
        { x: 300, y: 300, color: 0x00ff00 },
        { x: 400, y: 30, color: 0x00ff00 },
        { x: 240, y: 500, color: 0x00ff00 },
        { x: 480, y: 550, color: 0x00ff00 }
    ],
    foes: [
        { x: 100, y: 100, name: "tomato" },
        { x: 340, y: 100, name: "tomato" },
        { x: 200, y: 300, name: "tomato" },
        { x: 400, y: 400, name: "tomato" }
    ],
    nextScene: "stage2"
};