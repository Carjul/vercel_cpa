(function () {
    var API_URL = "https://affiliate-api.drcash.pro/v1/order";
    var API_TOKEN = "ZJI1OTDLMJATNGMYOS00OTKWLTG4Y2UTYWRMN2JJOWYZNTFL";
    var STREAM_CODE = "teiji";
    var VISITOR_ID_KEY = "hs_vid";

    function getParam(name) {
        var url = new URL(window.location.href);
        return url.searchParams.get(name) || "";
    }

    function getOrCreateVisitorId() {
        try {
            var stored = localStorage.getItem(VISITOR_ID_KEY);
            if (stored) {
                return stored;
            }
            var fresh = (window.crypto && crypto.randomUUID)
                ? crypto.randomUUID()
                : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                    var r = (Math.random() * 16) | 0;
                    var v = c === "x" ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                });
            localStorage.setItem(VISITOR_ID_KEY, fresh);
            return fresh;
        } catch (e) {
            return "no-storage";
        }
    }

    function buildPayload(form) {
        var formData = new FormData(form);
        var phone = (formData.get("phone") || "").trim();
        var name = (formData.get("name") || "").trim();

        return {
            stream_code: STREAM_CODE,
            client: {
                phone: phone,
                name: name
            },
            sub1: phone,
            sub2: getOrCreateVisitorId(),
            sub3: name,
            sub4: "advertlink",
            sub5: (formData.get("sub5") || getParam("sub5") || "").trim()
        };
    }

    function validate(form, payload) {
        var valid = true;

        var nameField = form.querySelector('[name="name"]');
        if (payload.client.name.length < 3) {
            nameField && nameField.classList.add("has-error");
            valid = false;
        } else {
            nameField && nameField.classList.remove("has-error");
        }

        var phoneField = form.querySelector('[name="phone"]');
        if (payload.client.phone.length < 6) {
            phoneField && phoneField.classList.add("has-error");
            valid = false;
        } else {
            phoneField && phoneField.classList.remove("has-error");
        }

        return valid;
    }

    function showError(form, message) {
        var errorEl = form.querySelector(".order-error");
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearError(form) {
        showError(form, "");
    }

    function sendOrder(form) {
        var payload = buildPayload(form);

        clearError(form);

        if (!validate(form, payload)) {
            showError(form, "Por favor revisa los datos marcados.");
            return;
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn && (submitBtn.disabled = true);

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_TOKEN
            },
            body: JSON.stringify(payload)
        })
            .then(function (response) {
                if (response.status === 200) {
                    window.location.href = "./thanks";
                    return;
                }
                return response.text().then(function (text) {
                    console.error("Error " + response.status + ": " + text);
                    showError(form, "No pudimos procesar tu pedido. Por favor, inténtalo de nuevo.");
                    submitBtn && (submitBtn.disabled = false);
                });
            })
            .catch(function (err) {
                console.error("Request failed:", err);
                showError(form, "Hubo un problema de conexión. Por favor, inténtalo de nuevo.");
                submitBtn && (submitBtn.disabled = false);
            });
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("form.orderForm").forEach(function (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                sendOrder(form);
            });
        });
    });
})();
