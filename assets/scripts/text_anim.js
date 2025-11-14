// TODO: Replace jquery with regular js

$(document).ready(function () {
    /* Replace all chars in text node with spans with different animation-delay
     *
     * Expects a --parts css variable to
     * define number of unique delays to wave together
     */
    $(".stagger").each(function () {
        // Turn series of spaces into a single space
        let text = $(this).text().trim().replace(/\s+/g, " ");
        let animation_duration = parseFloat($(this).css("animation-duration"));
        let parts = $(this).css("--parts");
        let new_html = "";
        let offset = Math.floor(Math.random() * parts);

        for (let i = 0; i < text.length; i++) {
            let delay = ((i + offset) % parts) * (animation_duration / parts);
            new_html +=
                '<span style="animation-delay:' +
                delay +
                's">' +
                text.charAt(i) +
                "</span>";
        }

        $(this).html(new_html);
    });
});
