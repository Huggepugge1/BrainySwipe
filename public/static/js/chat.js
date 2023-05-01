const getMessages = async () => {
    const res = await fetch("/get_messages");
    return await res.json();
};

const getAccounts = (messages) => {
    let accounts = [];
    messages.forEach((message) => {
        let inArray = false;
        for (let account of accounts) {
            if (account[1] === message.username) inArray = true;
        }
        if (!inArray) accounts.push([message.name, message.username]);
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
        name.value = account[0];
        let username = document.querySelector("#username");
        username.value = account[1];
        const messageContainer = document.querySelector("#messages");
        messageContainer.replaceChildren();
        getMessages()
            .then((messages) => {
                messages = JSON.parse(messages);
                messages.forEach((message) => {
                    if (message.sent) messageElement = createMessage("p", "medium message sent", message.value);
                    else messageElement = createMessage("p", "medium message recieved", message.value);
                    messageContainer.appendChild(messageElement);
                });
            });
    };
    button.innerHTML = account[0];
    return button;
};

getMessages()
    .then((messages) => {
        console.log(messages)
        messages = JSON.parse(messages);
        getAccounts(messages);
    });
