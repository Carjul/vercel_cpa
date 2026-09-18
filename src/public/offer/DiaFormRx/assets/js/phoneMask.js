/*
 * Máscara de teléfono ligera (España).
 * Reglas únicas: mantiene el prefijo fijo (+34 ) y limita el máximo de dígitos.
 * NO restringe posiciones: el usuario escribe libremente tras el +34 y los
 * dígitos se acomodan; el cursor siempre queda al final.
 * El vacío muestra el placeholder normal del input.
 *
 * El país se toma del <select id="country_code_selector"> (oculto). Por defecto ES.
 */
(function () {
    var COUNTRIES = {
        es: { prefix: "+34", max: 9 }
    };

    function getConfig() {
        var sel = document.querySelector('select#country_code_selector');
        var cc = (sel && sel.value ? sel.value : "es").toLowerCase();
        return COUNTRIES[cc] || COUNTRIES.es;
    }

    function onlyDigits(s) {
        return (s || "").replace(/\D/g, "");
    }

    function setup(input) {
        var cfg = getConfig();
        var prefixDigits = onlyDigits(cfg.prefix); // "34"
        var display = cfg.prefix + " ";            // "+34 "

        // Dígitos que escribió el usuario (sin el prefijo del país), tope = cfg.max.
        function userDigits() {
            var d = onlyDigits(input.value);
            if (d.indexOf(prefixDigits) === 0) d = d.slice(prefixDigits.length);
            return d.slice(0, cfg.max);
        }

        function caretToEnd() {
            try {
                var p = input.value.length;
                input.setSelectionRange(p, p);
            } catch (e) {}
        }

        // focus=true -> mostrar siempre el prefijo; focus=false y sin dígitos -> vaciar (placeholder).
        function paint(focus) {
            var d = userDigits();
            if (!d && !focus) {
                input.value = "";
                return;
            }
            input.value = display + d;
            caretToEnd();
        }

        input.addEventListener("focus", function () { paint(true); });
        input.addEventListener("input", function () { paint(true); });
        input.addEventListener("click", caretToEnd);
        input.addEventListener("blur", function () { paint(false); });
    }

    function init() {
        var inputs = document.querySelectorAll('[name="phone"]');
        for (var i = 0; i < inputs.length; i++) setup(inputs[i]);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
