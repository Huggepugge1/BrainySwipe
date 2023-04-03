const acc = "Oskar";

const getMessages = async () => {
    const res = await fetch("/get_messages");
    const json = await res.json();
    return json;
};

const getAccounts = (messages) => {
    let accounts = [];
    messages.forEach((message) => {
        if (!accounts.includes(message.user1) && message.user1 !== acc) accounts.push(message.user1);
        if (!accounts.includes(message.user2) && message.user2 !== acc) accounts.push(message.user2);
    });
    const sidebar = document.querySelector("#sidebar");
    accounts.forEach((account) => {
        const button = createProfileButton(account);
        sidebar.appendChild(button);
    });
};

const createMessage = (type, classes, value) => {
    let div = document.createElement("div");
    div.className = "flex flex-align-center message-container";
    const element = document.createElement(type);
    element.className = classes;
    if (value !== "") element.innerHTML = value;
    div.appendChild(element);   
    return div;
};

const createProfileButton = (account) => {
    let button = document.createElement("button");
    button.className = "medium profile-button";
    button.onclick = () => {
        let name = document.querySelector("#name");
        name.innerHTML = account;
        const messageContainer = document.querySelector("#messages");
        messageContainer.replaceChildren();
        console.log(account);
        getMessages()
            .then((messages) => {
                messages = JSON.parse(messages);
                messages.forEach((message) => {
                    if (message.user1 !== acc && message.user2 !== acc) return;
                    if (message.user1 !== account && message.user2 !== account) return;
                    if (message.user1 === acc) messageElement = createMessage("p", "medium message sent", message.value);
                    if (message.user2 === acc) messageElement = createMessage("p", "medium message recieved", message.value);
                    messageContainer.appendChild(messageElement);
                });
            });
    };
    button.innerHTML = account;
    return button;
};

const changeProfile = (account) => {
};

getMessages()
    .then((messages) => {
        messages = JSON.parse(messages);
        getAccounts(messages);
    });
