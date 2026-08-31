// Workaround-Versuch vom 14.08.2026:
// Sendet alle 20 Sekunden ein kleines Signal über die bestehende Socket.IO-Verbindung, um einen möglicherweise fehlenden/zu kurzen proxy_read_timeout im
// vorgeschalteten Reverse-Proxy (nginx-Standardwert: 60s) zu verhindern. -> NutzerInnen können im Warteraum wegen der read-only-Funktionalität keinen Traffic erzeugen.

const KEEPALIVE_INTERVAL_MS = 20000;

function startKeepalive() {
    if (typeof socket === "undefined") {
        // Socket evtl. noch nicht initialisiert - kurz warten und erneut versuchen
        return setTimeout(startKeepalive, 200);
    }
    setInterval(() => {
        if (socket.connected) {
            socket.emit("keepalive_ping", { t: Date.now() });
        }
    }, KEEPALIVE_INTERVAL_MS);
    console.log(`Keepalive aktiv (alle ${KEEPALIVE_INTERVAL_MS / 1000}s)`);
}

document.addEventListener("DOMContentLoaded", startKeepalive);