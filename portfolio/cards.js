// Return a promise for the contents of projects.json
async function fetch_projects() {
    try {
        let response = await fetch("assets/projects.json");

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return -1;
    }
}

// Return a DOM element for card
function create_card_div(card) {
    // Aux func to quickly create a div with classes and text
    function create_elem(type, class_, text) {
        const res = document.createElement(type);
        if (typeof class_ !== "undefined") {
            class_.split(" ").forEach((element) => {
                res.classList.add(element);
            });
        }
        if (typeof text !== "undefined") {
            res.appendChild(document.createTextNode(text));
        }
        return res;
    }
    function create_div(class_, text) {
        return create_elem("div", class_, text);
    }

    // Initialize the result
    const res = create_elem("a", "unformatted");
    // Link stuff
    res.setAttribute("href", card.link);
    res.setAttribute("target", "_blank");
    res.setAttribute("title", "View project");
    // Class stuff
    if (card.spotlight) {
        res.classList.add("big");
    } else {
        res.classList.add("small");
    }
    res.classList.add("card");

    // Add description
    res.appendChild(create_div("title", card.title));
    res.appendChild(create_div("meta", card.slogan));
    res.appendChild(create_elem("hr"));
    res.appendChild(create_div("description", card.description));

    // Add tags
    const tags = create_div("tags");
    card.tags.primary.forEach((element) => {
        tags.appendChild(create_div("primary tag", element));
    });
    card.tags.secondary.forEach((element) => {
        tags.appendChild(create_div("secondary tag", element));
    });
    card.tags.tertiary.forEach((element) => {
        tags.appendChild(create_div("tertiary tag", element));
    });
    res.appendChild(tags);

    return res;
}

document.addEventListener("DOMContentLoaded", async function () {
    const cs_cards = document.getElementById("cs_projects");
    const other_cards = document.getElementById("other_projects");
    const projects = await fetch_projects();

    cs_cards.textContent = "";
    projects.cs_projects.forEach((card) => {
        if (card.title != "") {
            cs_cards.appendChild(create_card_div(card));
        }
    });

    other_cards.textContent = "";
    projects.other_projects.forEach((card) => {
        if (card.title != "") {
            other_cards.appendChild(create_card_div(card));
        }
    });
});
