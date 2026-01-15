import { game } from "./index.js";
import Pipes from "./pipes.js";

let activeReplayId = 0;

function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    let obj = {};

    headers.forEach((header, i) => {
      let value = values[i];

      if (header === "pipes" && value) {
        try {
          obj[header] = JSON.parse(atob(value));
        } catch {
          obj[header] = [];
        }
      } else if (!isNaN(value) && value.trim() !== "") {
        obj[header] = parseFloat(value);
      } else {
        obj[header] = value;
      }
    });

    return obj;
  });
}
function objectToSingleRowCSV(obj) {
  const headers = Object.keys(obj).join(",");
  const values = Object.values(obj).join(",");
  return headers + "\n" + values;
}
function framesToCSV(frames) {
  const headers = Object.keys(frames[0]).join(",");
  const rows = frames.map((frame) => Object.values(frame).join(","));
  return [headers, ...rows].join("\n");
}

document.getElementById("importGame").addEventListener("click", () => {
  if (!game.gameIsOver) {
    alert("Sorry, can't import game state CSV right now.");
    return;
  }

  document.getElementById("fileInput").click();
});
document.getElementById("fileInput").addEventListener("change", function (e) {
  if (!game.gameIsOver) {
    game.gameIsOver = true;
    alert("Sorry, can't import game state CSV right now.");
    return;
  }

  const file = e.target.files[0];
  if (!file) {
    alert("Sorry, can't import game state CSV right now.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    activeReplayId++;
    const currentReplayId = activeReplayId;
    game.gameIsImported = false;
    game.gameIsOver = true;

    const csvContent = event.target.result;
    const frames = parseCSV(csvContent);

    let currentFrame = 0;
    game.reset();
    game.gameIsImported = true;
    game.gameIsOver = false;

    function runReplay() {
      if (currentReplayId !== activeReplayId) return;

      if (currentFrame < frames.length) {
        const data = frames[currentFrame];

        game.bird.y = data.bird_y;
        game.bird.velocity = data.bird_velocity;
        game.points = data.score;

        if (data.pipes && data.pipes.length > 0) {
          game.pipes = data.pipes.map((p) => {
            const pipe = new Pipes(game);
            pipe.x = p.x;
            pipe.topY = p.top_y;
            pipe.botY = p.bot_y;
            pipe.passed = p.passed;
            pipe.topHeight = p.top_y;
            pipe.botHeight = game.GAME_HEIGHT - p.bot_y;
            return pipe;
          });
        } else {
          game.pipes = [];
        }
        currentFrame++;
        requestAnimationFrame(runReplay);
      } else {
        game.episodeId = -1;
        game.gameIsImported = false;
        game.gameIsOver = true;

        document.getElementById("fileInput").value = "";
      }
    }
    runReplay();
  };
  reader.readAsText(file);
});

document.getElementById("exportGame").addEventListener("click", async () => {
  if (game.frameStates.length === 0 || !game.gameIsOver) {
    game.gameIsOver = true;
    alert("Sorry, can't export the game state right now.");
    return;
  }

  game.episodeId = -1;

  const zip = new JSZip();

  const framesCSV = framesToCSV(game.frameStates);
  const metadataCSV = objectToSingleRowCSV(game.metadata);

  zip.file("frames.csv", framesCSV);
  zip.file("metadata.csv", metadataCSV);

  const blob = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const [currentDate, currentTime] = [
    [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join(""),
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(
      ""
    ),
  ];

  a.download = `flappy_bird_game_${currentDate}_${currentTime}.zip`;
  a.click();
});
