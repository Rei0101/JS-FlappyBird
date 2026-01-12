import { game } from "./index.js";

document.getElementById("exportGame").addEventListener("click", () => {
    game.episodeId = -1;
    if (game.frameStates.length === 0 || !game.gameIsOver) {
        alert("Sorry, can't export right now.")
        return
    };

    let csvRows = [];
    const headers = Object.keys(game.frameStates[0]);
    csvRows.push(headers.join(","));

    for (let frame of game.frameStates) {
        const values = Object.values(frame).join(",");
        csvRows.push(values)
    }
    let csvString = csvRows.join('\n')

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const [currentDate, currentTime] = [
        [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join(""),
        [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join("")
    ]
    
    a.download = `flappy_bird_game_${currentDate}_${currentTime}.csv`;
    a.click();
})
