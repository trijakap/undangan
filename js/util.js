import { storage } from "./storage.js";
import { bootstrap } from "./bootstrap.js";

export const util = (() => {
    var myModalEl = document.getElementById("modal-image");
    myModalEl.addEventListener("hidden.bs.modal", function (event) {
        document.body.style.overflowY = "scroll";
    });

    const opacity = (id, speed = 0.01) => {
        const element = document.getElementById(id);
        let op = parseInt(element.style.opacity);

        let clear = null;
        clear = setInterval(() => {
            if (op > 0) {
                element.style.opacity = op.toString();
                op -= speed;
            } else {
                clearInterval(clear);
                clear = null;
                element.remove();
            }
        }, 10);
    };

    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const disableButton = (button, message = "Loading..") => {
        button.disabled = true;
        const tmp = button.innerHTML;
        button.innerHTML = `<div class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem"></div>${message}`;

        return {
            restore: () => {
                button.innerHTML = tmp;
                button.disabled = false;
            },
        };
    };

    const addLoadingCheckbox = (checkbox) => {
        checkbox.disabled = true;

        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        const tmp = label.innerHTML;
        label.innerHTML = `<div class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem"></div>${tmp}`;

        return {
            restore: () => {
                label.innerHTML = tmp;
                checkbox.disabled = false;
            },
        };
    };

    const animate = (svg, timeout, classes) => {
        setTimeout(() => {
            svg.classList.add(classes);
        }, timeout);
    };

    const modal = (img) => {
        document.getElementById("show-modal-image").src = img.src;
        let modal = new bootstrap.Modal("#modal-image");
        modal.show();
    };

    const copy = async (button, message = null, timeout = 1500) => {
        const copy = button.getAttribute("data-copy");

        if (!copy || copy.length == 0) {
            alert("Nothing to copy");
            return;
        }

        button.disabled = true;

        try {
            await navigator.clipboard.writeText(copy);
        } catch {
            button.disabled = false;
            alert("Failed to copy");
            return;
        }

        const tmp = button.innerHTML;
        button.innerHTML = message
            ? message
            : '<i class="fa-solid fa-check"></i>';

        let clear = null;
        clear = setTimeout(() => {
            button.disabled = false;
            button.innerHTML = tmp;

            clearTimeout(clear);
            clear = null;
            return;
        }, timeout);
    };

    const open = async (button) => {
        button.disabled = true;
        confetti({
            origin: { y: 1 },
            zIndex: 1057,
        });

        document.querySelector("body").style.overflowY = "scroll";
        if (storage("information").get("info")) {
            document.getElementById("information")?.remove();
        }

        const token = document.querySelector("body").getAttribute("data-key");
        if (!token || token.length === 0) {
            document.getElementById("rsvp")?.remove();
            document
                .querySelector('a.nav-link[href="#rsvp"]')
                ?.closest("li.nav-item")
                ?.remove();
        }

        AOS.init();

        countDownDate();
        opacity("loading", 0.025);

        //TODO: Revert to play audio
        audio.showButton();

        document.body.style.overflowY = "scroll";
        document.body.scrollIntoView({ behavior: "instant" });

        if (!token || token.length === 0) {
            return;
        }

        const status = await storeConfig(token);
        if (status === 200) {
            animation();
            await comment.comment();
        }
    };

    const close = () => {
        storage("information").set("info", true);
    };

    return {
        open,
        copy,
        close,
        modal,
        opacity,
        animate,
        escapeHtml,
        disableButton,
        addLoadingCheckbox,
    };
})();
