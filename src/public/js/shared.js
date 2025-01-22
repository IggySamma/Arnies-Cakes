function createElement(type, attributes = {}, classes = "", innerHTML = "") {
    const element = document.createElement(type);
    if (classes) element.className = classes;
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

/*Side Scroll*/
function createImageColumn(src) {
    const col = createElement('div', {}, "col p-0 my-1 py-1");
    const img = createElement('img', { src, loading: "lazy" }, "homeImage");
    col.appendChild(img);
    return col;
}

function buildSideScroll() {
    const attach = document.getElementById("sideScroll");
    attach.className = "row sideScrollContainer m-0 p-0";

    const container = createElement('div', {}, "col homeImageContainer");
    const rowL = createElement('div', {}, "row sideScrollL m-1 d-inline-block");
    const rowR = createElement('div', {}, "row sideScrollR m-1 d-inline-block");

    attach.appendChild(container);
    appendChildren(container, [rowL, rowR]);

    for (let j = 0; j <= 1; j++) {
        for (let i = 1; i <= 3; i++) {
            rowL.appendChild(createImageColumn(`./images/Sidescroll/${i}.jpg`));
        }
        for (let i = 4; i <= 6; i++) {
            rowR.appendChild(createImageColumn(`./images/Sidescroll/${i}.jpg`));
        }
    }
}

function buildNavBar() {
    const attach = document.getElementById("navbar");
    attach.className = "navbar fixed-top navbar-expand-lg";

    const containerFluid = createElement("div", {}, "container-fluid m-0 p-0 navContainer");
    attach.appendChild(containerFluid);

    const toggleButton = createElement("button", {
        type: "button",
        id: "toggling",
        "data-bs-toggle": "collapse",
        "data-bs-target": "#navbarSupportedContent"
    }, "navbar-toggler collapsed");
    const spanIcon = createElement("span", {}, "navbar-toggler-icon");
    toggleButton.appendChild(spanIcon);
    containerFluid.appendChild(toggleButton);

    const mainDiv = createElement("div", { id: "navbarSupportedContent" }, "collapse navbar-collapse justify-content-center");
    mainDiv.style.top = "0";
    containerFluid.appendChild(mainDiv);

    const ul = createElement("ul", {}, "navbar-nav");
    mainDiv.appendChild(ul);

  // Define the nav items and links
    const navItems = [
        { class: "nav-item", linkClass: "nav-link active fontsize", href: "./Index.html", text: "Home" },
        { class: "nav-item", linkClass: "nav-link fontsize", href: "./About.html", text: "About Me" },
        { class: "nav-item dropdown", linkClass: "nav-link dropdown-toggle fontsize", href: "#", id: "navbarDropdown", role: "button", "data-bs-toggle": "dropdown", text: "Gallery" },
        { class: "nav-item", linkClass: "nav-link fontsize", href: "./Flavours.html", text: "Flavours" },
        { class: "nav-item", linkClass: "nav-link fontsize", href: "./Enquiries.html", text: "Enquiries", extra: createElement("img", { src: "./images/ribbon.png" }, "ribbon") }
    ];

    // Add the logo item separately
    const logoItem = createElement("li", {}, "nav-item nav-logo m-0 p-0");
    const logoLink = createElement("a", { href: "./Index.html" });
    const logoImg = createElement("img", { src: "./images/home logo.png" }, "navBarLogo");
    logoLink.appendChild(logoImg);
    logoItem.appendChild(logoLink);
    ul.appendChild(logoItem);

    // Append nav items to ul
    navItems.forEach(item => {
        const li = createElement("li", {}, item.class);
        const a = createElement("a", { href: item.href, id: item.id, role: item.role, "data-bs-toggle": item["data-bs-toggle"] }, item.linkClass, item.text);
        if (item.extra) li.appendChild(item.extra);
        li.appendChild(a);
        ul.appendChild(li);

        if (item.text === "Gallery") {
            const dropDiv = createElement("div", {}, "dropdown-menu fontsize");
            const galleryItems = [
                { href: "./Gallery.html?type=All", text: "All" },
                { href: "./Gallery.html?type=Cakes", text: "Cakes" },
                { href: "./Gallery.html?type=Cakepops", text: "Cakepops" },
                { href: "./Gallery.html?type=Cupcakes", text: "Cupcakes" },
                { href: "./Gallery.html?type=KidsCakes", text: "Kids Cakes" },
                { href: "./Gallery.html?type=Treats", text: "Treats" }
            ];
            galleryItems.forEach(gItem => {
                const a = createElement("a", { href: gItem.href }, "dropdown-item", gItem.text);
                dropDiv.appendChild(a);
            });
            li.appendChild(dropDiv);
        }
    });
}

function buildFooter() {
    const attach = document.getElementById("footer");
    attach.className = "footer container-fluid m-0 p-0";

    const ul = createElement("ul", {}, "nav border-top m-0 p-0 footerList");
    attach.appendChild(ul);

    const logoItem = createElement("li", {}, "nav-item nav-logo-footer");
    const logoLink = createElement("a", { href: "./Index.html" });
    const logoImg = createElement("img", { src: "./images/home logo.png" }, "footerLogo");
    logoLink.appendChild(logoImg);
    logoItem.appendChild(logoLink);
    ul.appendChild(logoItem);

const footerItems = [
    {
        class: "nav-item my-auto",
        link: [
            { href: "https://www.instagram.com/arnies_cakes/", target: "_blank", img: { src: "./images/instagram.svg", class: "footerImages" } },
            { href: "https://www.instagram.com/arnies_cakes/", target: "_blank", text: "@arnies_cakes", class: "footerLinks" }
        ]
    },
    {
        class: "nav-item my-auto",
        link: [
            { href: "https://www.facebook.com/ArniesCakes", target: "_blank", img: { src: "./images/facebook.svg", class: "footerImages" } },
            { href: "https://www.facebook.com/ArniesCakes", target: "_blank", text: "Dublin Tortai - 'Arnie's Cakes'", class: "footerLinks" }
        ]
    },
    {
        class: "nav-item my-auto",
        link: [
            { href: "mailto:arniescakes@gmail.com", img: { src: "./images/gmail.svg", class: "footerImages" } },
            { href: "mailto:arniescakes@gmail.com", text: "arniescakes@gmail.com", class: "footerLinks" }
        ]
    },
    {
        class: "nav-item footerEnquires my-auto rounded-5",
        link: { href: "./Enquiries.html", text: "Enquiries" }
    }
];

footerItems.forEach(item => {
    const li = createElement("li", {}, item.class);
    if (Array.isArray(item.link)) {
        item.link.forEach(link => {
            const a = createElement("a", { href: link.href, target: link.target || "" }, link.class || "", link.text || "");
            if (link.img) {
                const img = createElement("img", { src: link.img.src }, link.img.class);
                a.appendChild(img);
            }
            li.appendChild(a);
        });
    } else {
        const a = createElement("a", { href: item.link.href }, "", item.link.text || "");
        if (item.link.img) {
            const img = createElement("img", { src: item.link.img.src }, item.link.img.class);
            a.appendChild(img);
        }
        li.appendChild(a);
    }
    ul.appendChild(li);
});
}

var prevScrollpos = window.scrollY;
var navCollapse = new bootstrap.Collapse(document.getElementById("navbar"));
var scrollThreshold = 15;

window.onscroll = function() {
    const container = document.getElementById("navbar");

    container.addEventListener("animationend", () => {
        container.style.removeProperty("animation");
        container.style.removeProperty("-webkit-animation");
    }, { once: true });

    var currentScrollPos = window.scrollY;

    if (currentScrollPos < 150){
        return
    }

    if (Math.abs(prevScrollpos - currentScrollPos) >= scrollThreshold) {
        if (prevScrollpos > currentScrollPos) {
            if (container.style.top !== "0px") {
                container.style = "animation: showNav ease-in-out 0.4s; -webkit-animation: showNav ease-in-out 0.4s;";
                container.style.top = "0";
            }
        } else if (document.getElementById("toggling").classList.contains("collapsed")) {
            if (container.style.top !== "-150px") { 
                container.style = "animation: hideNav ease-in-out 0.4s; -webkit-animation: hideNav ease-in-out 0.4s;";
                container.style.top = "-150px";
            }
        }
        prevScrollpos = currentScrollPos;
    }
};