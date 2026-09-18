/*
 * Toasts de marketing (escasez + prueba social).
 * Alterna dos tipos de aviso, arriba a la derecha:
 *   1) Escasez: "¡Solo quedan X unidades!" (el stock baja solo, nunca a 0).
 *   2) Prueba social: "Alguien acaba de pedir" con nombre y ciudad de España.
 * Autocontenido (inyecta su propio CSS). Sin dependencias.
 */
(function () {
    var CFG = {
        producto: "Diaform RX",
        inicio: 27,               // stock inicial
        minimo: 5,                // nunca baja de aquí
        primerRetraso: 8000,      // ms antes del primer aviso
        cada: [30000, 60000],     // ms entre avisos (aleatorio) -> más separados
        visible: 7000,            // ms que se queda en pantalla
        clave: "stock_diaformrx_v3"
    };

    // Variantes de texto (escasez)
    var SUB_ESCASEZ = [
        "el stock se está agotando",
        "última tanda disponible",
        "se agota más rápido de lo previsto",
        "muchos pedidos en este momento"
    ];

    // Datos para prueba social (España)
    var NOMBRES = ["María L.", "José A.", "Carmen R.", "Antonio M.", "Laura S.",
        "Francisco G.", "Isabel P.", "Manuel D.", "Lucía F.", "Javier T.",
        "Rosa H.", "Miguel Á.", "Ana B.", "David C.", "Elena V."];
    var CIUDADES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza",
        "Málaga", "Murcia", "Bilbao", "Alicante", "Córdoba", "Valladolid",
        "Vigo", "Gijón", "Granada", "A Coruña"];

    function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function rndInt(a, b) { return Math.floor(a + Math.random() * (b - a)); }

    function inject(css) {
        var s = document.createElement("style");
        s.textContent = css;
        document.head.appendChild(s);
    }

    function getStock() {
        try {
            var v = parseInt(localStorage.getItem(CFG.clave), 10);
            if (!isNaN(v) && v >= CFG.minimo && v <= CFG.inicio) return v;
        } catch (e) {}
        return CFG.inicio;
    }
    function setStock(v) {
        try { localStorage.setItem(CFG.clave, String(v)); } catch (e) {}
    }

    inject(
        ".mkt-toast{position:fixed;top:18px;right:18px;z-index:99999;max-width:330px;" +
        "background:#fff;color:#1d2733;border-radius:14px;padding:14px 30px 14px 14px;" +
        "box-shadow:0 12px 34px rgba(0,0,0,.28);display:flex;gap:12px;align-items:center;" +
        "font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;" +
        "border:1px solid rgba(0,0,0,.06);transform:translateX(140%);opacity:0;" +
        "transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .45s}" +
        ".mkt-toast.show{transform:translateX(0);opacity:1}" +
        ".mkt-toast__ic{flex:0 0 42px;width:42px;height:42px;border-radius:12px;" +
        "display:flex;align-items:center;justify-content:center;font-size:22px}" +
        ".mkt-toast.escasez .mkt-toast__ic{background:linear-gradient(135deg,#e11d2a,#a30c16)}" +
        ".mkt-toast.social .mkt-toast__ic{background:linear-gradient(135deg,#16a34a,#0f7a37)}" +
        ".mkt-toast__body{line-height:1.35}" +
        ".mkt-toast__t{font-size:14px;font-weight:700;margin:0 0 2px}" +
        ".mkt-toast.escasez .mkt-toast__t b{color:#e11d2a;font-size:16px}" +
        ".mkt-toast.social .mkt-toast__t b{color:#0f7a37}" +
        ".mkt-toast__s{font-size:12px;color:#6b7688;margin:0}" +
        ".mkt-toast__x{position:absolute;top:6px;right:9px;border:0;background:transparent;" +
        "color:#aab2c0;font-size:17px;cursor:pointer;line-height:1;padding:2px}" +
        ".mkt-toast__x:hover{color:#6b7688}" +
        ".mkt-toast .bar{position:absolute;left:0;bottom:0;height:3px;border-radius:0 0 14px 14px}" +
        ".mkt-toast.escasez .bar{background:linear-gradient(90deg,#e11d2a,#f59e0b)}" +
        ".mkt-toast.social .bar{background:linear-gradient(90deg,#16a34a,#84cc16)}" +
        "@media(max-width:520px){.mkt-toast{top:12px;left:12px;right:12px;max-width:none}}"
    );

    var el, icEl, tEl, sEl, barEl, hideT, stock, lastType = "social";

    function build() {
        el = document.createElement("div");
        el.className = "mkt-toast";
        el.setAttribute("role", "status");
        el.innerHTML =
            '<button class="mkt-toast__x" aria-label="Cerrar">&times;</button>' +
            '<div class="mkt-toast__ic"></div>' +
            '<div class="mkt-toast__body">' +
            '<p class="mkt-toast__t"></p><p class="mkt-toast__s"></p>' +
            '</div><span class="bar"></span>';
        document.body.appendChild(el);
        icEl = el.querySelector(".mkt-toast__ic");
        tEl = el.querySelector(".mkt-toast__t");
        sEl = el.querySelector(".mkt-toast__s");
        barEl = el.querySelector(".bar");
        el.querySelector(".mkt-toast__x").addEventListener("click", hide);
    }

    function renderEscasez() {
        el.className = "mkt-toast escasez";
        icEl.textContent = "🔥";
        tEl.innerHTML = "¡Solo quedan <b>" + stock + "</b> unidades!";
        sEl.textContent = CFG.producto + " · " + rnd(SUB_ESCASEZ);
        var pct = Math.max(6, ((stock - CFG.minimo) / (CFG.inicio - CFG.minimo)) * 100);
        barEl.style.width = pct + "%";
    }

    function renderSocial() {
        el.className = "mkt-toast social";
        icEl.textContent = "🛒";
        tEl.innerHTML = "<b>" + rnd(NOMBRES) + "</b> acaba de pedir";
        sEl.textContent = rnd(CIUDADES) + " · hace " + rndInt(1, 12) + " min · Pago contra entrega";
        barEl.style.width = "100%";
    }

    function showOnce() {
        // Alterna: si el último fue social, ahora escasez, y viceversa.
        if (lastType === "social") {
            renderEscasez();                 // muestra el stock actual (17 la 1ª vez)
            if (stock > CFG.minimo) { stock -= 1; setStock(stock); } // baja para la próxima
            lastType = "escasez";
        } else {
            renderSocial();
            lastType = "social";
        }
        requestAnimationFrame(function () { el.classList.add("show"); });
        clearTimeout(hideT);
        hideT = setTimeout(hide, CFG.visible);
    }

    function hide() { el.classList.remove("show"); }

    function loop() {
        showOnce();
        setTimeout(loop, rndInt(CFG.cada[0], CFG.cada[1]));
    }

    function start() {
        stock = getStock();
        build();
        setTimeout(loop, CFG.primerRetraso);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
