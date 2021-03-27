// Show/Hide nav bar on scroll

var previousScrollPosition = window.pageYOffset;
window.onscroll = function () {
    var currentScrollPosition = window.pageYOffset;
    if (previousScrollPosition > currentScrollPosition) {
        document.getElementById("nav").style.top = "0";
    }
    else {
        document.getElementById("nav").style.top = "-60px";
    }
    previousScrollPosition = currentScrollPosition;
}

var menuIcon = document.getElementById("menu-icon");
var navItems = document.getElementById("nav-items");

if (window.innerWidth <= 768) {
    // Toggle nav menu button
    menuIcon.addEventListener('click', function () {
        navItems.classList.toggle("show");
    })

    // Toggle to close menu if user clicks a link or anywhere else
    document.addEventListener("click", function (event) {
        if ((navItems.classList.contains("show")) && (event.target != menuIcon)) {
            navItems.classList.toggle("show");
        }
    });
}

// Always show nav items on wide screen
if (window.innerWidth > 768) {
    if (!navItems.classList.contains("show")) {
        navItems.classList.add("show");
    }
}