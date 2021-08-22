export default {
    door: { x: 220, y: 68 },
    start: { x: 20, y: 400 },
    beans: [
        { x: 190, y: 550, color: 0x00ff00 },
        { x: 190, y: 460, color: 0x00ff00 },
        { x: 190, y: 360, color: 0x00ff00 },
        { x: 190, y: 260, color: 0x00ff00 },
        { x: 190, y: 160, color: 0x00ff00 },
        { x: 600, y: 460, color: 0x00ff00 },
        { x: 600, y: 360, color: 0x00ff00 },
        { x: 600, y: 260, color: 0x00ff00 },
        { x: 600, y: 160, color: 0x00ff00 },
    ],
    redBeans: [
        { x: 160, y: 260, color: 0x00ff00 },
        { x: 640, y: 60, color: 0x00ff00 },
    ],
    foes: [
        { x: 500, y: 60, name: "tomato" },
        { x: 190, y: 60, name: "tomato" },
        { x: 500, y: 460, name: "tomato" },
        { x: 190, y: 460, name: "tomato" },
        { x: 190, y: 260, name: "avocado" },
        { x: 600, y: 260, name: "avocado" },
        { x: 120, y: 50, name: "greenpepper" },
        { x: 330, y: 200, name: "greenpepper" },
        { x: 190, y: 60, name: "carrot" },
    ],
    platforms: [
        {x: 200, y: 500, type: "platform3", mode: "horizontal", offset: 100},
        {x: 600, y: 500, type: "platform3", mode: "horizontal", offset: 100},
        {x: 200, y: 400, type: "platform3", mode: "horizontal", offset: 100},
        {x: 600, y: 400, type: "platform3", mode: "horizontal", offset: 100},
        {x: 200, y: 300, type: "platform3", mode: "horizontal", offset: 100},
        {x: 600, y: 300, type: "platform3", mode: "horizontal", offset: 100},
        {x: 200, y: 200, type: "platform3", mode: "horizontal", offset: 100},
        {x: 600, y: 200, type: "platform3", mode: "horizontal", offset: 100},
        {x: 200, y: 100, type: "platform3", mode: "horizontal", offset: 100},
        {x: 600, y: 100, type: "platform3", mode: "horizontal", offset: 100},
    ],
    nextScene: "stage4"
};