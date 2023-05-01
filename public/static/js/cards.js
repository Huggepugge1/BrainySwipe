const getCards = async () => {
    const res = await fetch("/get_cards");
    const json = await res.json();
    return json;
}

const createElement = (type, classes, value, inDiv) => {
    let div;
    if (inDiv) {
        div = document.createElement("div");
        div.className = "flex flex-align-center";
    }
    const element = document.createElement(type);
    element.className = classes;
    if (value !== "") element.innerHTML = value;
    if (inDiv) div.appendChild(element);   
    else return element;
    return div;
}

const createCard = (card) => {
    const cardElement = createElement("div", "card next-card flex flex-wrap", "", false);
    cardElement.appendChild(createElement("p", "fpf", `Favorite physics field: ${card.fpf}`, true));
    const div = cardElement.appendChild(createElement("div", "flex name-container", "", false));
    div.appendChild(createElement("p", "name", card.name, true));
    div.appendChild(createElement("p", "age", card.age, true));
    return cardElement;
}

const nextCard = (dir) => {
    const cards = document.querySelectorAll(".card");
    const buttons = document.querySelectorAll(".swipe-button");
    buttons.forEach((button) => button.disabled = true);
    if (dir === "right") { 
        cards[0].className += " swipe-right";
        setTimeout(() => {cards[0].remove(); orderCards(); buttons.forEach((button) => button.disabled = false)}, 2000);
    }
    else {
        cards[0].className += " swipe-left";
        setTimeout(() => {cards[0].remove(); orderCards(); buttons.forEach((button) => button.disabled = false)}, 10000);
    }
    if (cards.length > 1 && cards[1].className.includes("next-card")) cards[1].className = "card flex flex-wrap";
    return cards;
}

const orderCards = () => {
    cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.style.zIndex = cards.length - i;
    });
    return cards;
}

const cardContainer = document.querySelector("#cards");
getCards()
    .then((cards) => {
        cards = JSON.parse(cards);
        cards.forEach((card) => {
            card = createCard(card);
            cardContainer.appendChild(card);
        });
        orderCards();
        cards = document.querySelectorAll(".card");
        if (cards.length > 0) cards[0].className = "card flex flex-wrap";
    });

