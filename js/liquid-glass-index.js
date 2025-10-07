const userAgent = navigator.userAgent;
const vendor = navigator.vendor;

const navButtons = document.getElementsByClassName("nav_button");

const sidebar = document.querySelector('.sidebar');

document.addEventListener('DOMContentLoaded', () => {
    const onSafari = vendor && vendor.indexOf('Apple') > -1 &&
    userAgent && userAgent.indexOf('Safari') > -1

    if (!onSafari) {
        document.querySelectorAll('.liquid_glass').forEach(el => {
            el.classList.add('has_displacement');
        });
    }
    else {
        document.querySelectorAll('.liquid_glass').forEach(el => {
            el.classList.add('no_displacement');
        });
    }

    for (var i = 0; i < navButtons.length; i++) {
        const button = navButtons[i];

        button.addEventListener("click", (event) => {
            for (var j = 0; j < navButtons.length; j++) {
                const toRemoveFrom = navButtons[j];
                toRemoveFrom.classList.remove("selected");
            }
            button.classList.add("selected");
        })
    }
});