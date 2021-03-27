var previousScrollPosition = window.pageYOffset;
var nav = document.getElementById("nav");
var menuIcon = document.getElementById("menu-icon");
var navItems = document.getElementById("nav-items");

// Show/Hide nav bar on scroll
window.onscroll = function () {
    var currentScrollPosition = window.pageYOffset;
    if (previousScrollPosition > currentScrollPosition) {
        nav.style.top = "0";
    }
    else {
        nav.style.top = "-60px";
    }
    previousScrollPosition = currentScrollPosition;
}

if (window.innerWidth <= 768) {
    // Toggle nav menu button
    menuIcon.addEventListener('click', function () {
        navItems.classList.toggle("show");
    })

    // Toggle to close menu if user clicks a link or anywhere else
    document.addEventListener("click", function (event) {
        if ((navItems.classList.contains("show")) && (event.target != menuIcon)) {
            navItems.classList.remove("show");
        }
    });
}

// Always show nav items on wide screen
if (window.innerWidth > 768) {
    if (!navItems.classList.contains("show")) {
        navItems.classList.add("show");
    }
}

// Page load / reload to top of page
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}