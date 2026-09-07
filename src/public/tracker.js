/*
 * Tracker de presencia. Envía un ping al cargar y cada 20s (heartbeat).
 * Mismo origen que el panel: endpoint relativo.
 */
(function () {
    var ENDPOINT = "/api/track";
    var HEARTBEAT_MS = 20000;

    function vid() {
        try {
            var k = "ds_vid", v = localStorage.getItem(k);
            if (!v) {
                v = (window.crypto && crypto.randomUUID)
                    ? crypto.randomUUID()
                    : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
                localStorage.setItem(k, v);
            }
            return v;
        } catch (e) {
            return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
        }
    }

    var ID = vid();
    var PAGE = location.hostname + location.pathname;

    function ping() {
        var url = ENDPOINT
            + "?vid=" + encodeURIComponent(ID)
            + "&page=" + encodeURIComponent(PAGE)
            + "&t=" + Date.now();
        try {
            if (navigator.sendBeacon) navigator.sendBeacon(url);
            else fetch(url, { mode: "no-cors", keepalive: true });
        } catch (e) {}
    }

    ping();
    setInterval(ping, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) ping();
    });
})();
