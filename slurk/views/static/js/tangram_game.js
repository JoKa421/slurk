console.log("Tangram-Game Script geladen");

function waitForSocketAndInit() {
  if (typeof socket === "undefined") return setTimeout(waitForSocketAndInit, 50);

  console.log("Socket ist bereit – initialisiere Tangram-Listener");

  const gameArea = document.getElementById("game-area");
  if (!gameArea) return console.warn("game-area nicht gefunden");

  let myRoomId = null;

  socket.on("status", (data) => {
    if (data && data.room) {
      myRoomId = Number(data.room);
      console.log("Meine room_id:", myRoomId);
    // Status aktiv anfordern
    socket.emit("tangram_request_state", { room: myRoomId });
    }
    
  });

  socket.on("tangram_state", (state) => {
    if (!state || !Array.isArray(state.files)) return;
    if (!myRoomId) return;
    if (Number(state.room) !== myRoomId) return;

    console.log("Tangram-State empfangen:", state);

    gameArea.innerHTML = "";
    state.files.forEach((file, i) => {
      const img = document.createElement("img");
      img.src = `/static/dataset/tangrams-svg/${file}`;
      img.classList.add("tangram-image");
      if (i === state.highlight) img.classList.add("highlight");
      gameArea.appendChild(img);
    });
  });
}

document.addEventListener("DOMContentLoaded", waitForSocketAndInit);
