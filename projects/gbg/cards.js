// Return a promise for the contents of the file <dir>
async function fetch_dir(dir) {
    let response = await fetch(dir);

    if (!response.ok) {
        throw new Error("HTTP Error: " + response.status);
    }
    let data = await response.json();
    return data;
}

// Return a promise for a list of game info
// Each game info dictionary has this information
/*
    title (string)
    description (string)
    video_link (string)
    images (list of strings)
*/
async function fetch_games() {
    try {
        let games_json = await fetch_dir("games.json");
        let res = [];

        for (let i = 0; i < games_json.folder_names.length; ++i) {
            const game = games_json.folder_names[i];
            let info_json = await fetch_dir(`games/${game}/info.json`);
            info_json["images"] = [];
            for (let i = 1; i <= 4; ++i) {
                info_json["images"].push(`games/${game}/${i}.jpg`);
            }
            res.push(info_json);
        }

        return res;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return -1;
    }
}

// Return a DOM element for card
function create_card_div(game) {
    // Aux func to quickly create a div with classes and text
    function create_elem(type, class_, text) {
        const res = document.createElement(type);
        if (typeof class_ !== "undefined" && class_ != "") {
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
    const res = create_div("game");

    // Cute tab color randomization
    colors = ["red", "green", "blue", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    res.appendChild(create_elem("h1", `${color} tab`, game.title));
    res.appendChild(create_elem("p", "box", game.description));

    //Create the gallery (video)
    const gallery = create_div("gallery box");
    const video = create_elem("iframe", "video");
    video.setAttribute("width", "var(--media-width)");
    video.setAttribute("height", "auto");
    video.setAttribute("src", game.video_link);
    video.setAttribute("title", "YouTube video player");
    video.setAttribute("frameborder", "0");
    video.setAttribute(
        "allow",
        "accelerometer;clipboard-write;encrypted-media;gyroscope;",
    );
    video.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    video.setAttribute("allowfullscreen", "true");
    gallery.appendChild(video);

    //Create the gallery (images)
    const images = create_div("images gallery");
    game.images.forEach((src) => {
        const image = create_elem("img");
        image.setAttribute("src", src);
        image.setAttribute("alt", "Game screenshot");
        image.setAttribute("width", "var(--media-width)");
        image.setAttribute("height", "auto");
        images.appendChild(image);
    });
    gallery.appendChild(images);
    res.appendChild(gallery);

    return res;
}

// Load the cards when the document is loaded
document.addEventListener("DOMContentLoaded", async function () {
    const games_cards = document.getElementById("games");
    const games = await fetch_games();
    console.log("a");
    console.log(games.toString());

    games_cards.textContent = "";
    console.log(games);
    console.log([1, 2, 3]);
    console.log(games["0"]);
    games.forEach((game) => {
        console.log("wow");
        games_cards.appendChild(create_card_div(game));
    });
});
