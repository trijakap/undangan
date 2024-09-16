import { util } from "./util.js";
import { guest } from "./guest.js";

export const progress = (() => {
    let info = null;
    const btnEnvelope = document.getElementById("btn-envelope");

    let total = 0;
    let loaded = 0;
    let valid = true;
    let push = true;

    const open = () => {
        guest.name();
        util.opacity("loading", 0.025);

        document.body.style.overflowY = "scroll";
        document.body.scrollIntoView({ behavior: "instant" });
    };

    const onComplete = () => {
        guest.name();

        btnEnvelope.style.display = "block";
        info.style.display = "none";
    };

    const complete = (type) => {
        if (!valid) {
            return;
        }

        var percentage = parseInt((loaded / total) * 100).toFixed(0);

        info.innerText = `${percentage}%`;

        loaded += 1;
        if (loaded === total) {
            onComplete();
        }
    };

    const add = () => {
        if (!push) {
            return;
        }

        total += 1;
    };

    const invalid = (type) => {
        info.innerText = `Error loading ${type} (${loaded}/${total}) [${parseInt(
            (loaded / total) * 100
        ).toFixed(0)}%]`;
        valid = false;
    };

    const run = async () => {
        document.querySelectorAll("img").forEach((asset) => {
            asset.onerror = () => {
                console.log(asset);
                invalid("image");
            };
            asset.onload = () => {
                complete("image");
            };

            if (
                asset.complete &&
                asset.naturalWidth !== 0 &&
                asset.naturalHeight !== 0
            ) {
                complete("image");
            } else if (asset.complete) {
                invalid("image");
            }
        });
    };

    const init = () => {
        document.querySelectorAll("img").forEach(add);

        info = document.getElementById("progress-info");
        info.style.display = "block";

        push = false;
        run();
    };

    return {
        init,
        add,
        open,
        invalid,
        complete,
    };
})();
