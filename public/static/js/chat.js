const getMessages = async () => {
    const res = await fetch("/get_messages");
    return await res.json();
};

const getAccounts = (accounts) => {
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
        name.innerHTML = `${account[0]} (${account[1]})`;
        let username = document.querySelector("#username");
        username.value = account[1];
        const messageContainer = document.querySelector("#messages");
        messageContainer.replaceChildren();
        let messageElement;
        getMessages()
            .then((messages) => {
                messages = JSON.parse(messages);
                messages.messages.forEach((message) => {
                    if (message.sent) messageElement = createMessage("p", "medium message sent", message.value);
                    else messageElement = createMessage("p", "medium message recieved", message.value);
                    messageContainer.appendChild(messageElement);
                });
            });
    };
    button.innerHTML = `${account[0]} (${account[1]})`;
    return button;
};

getMessages()
    .then((messagesAndAccounts) => {
        let { accounts, messages} = JSON.parse(messagesAndAccounts);
        console.log(accounts)
        getAccounts(accounts);
        let params = new URLSearchParams(window.location.search);
        let user = params.get("user");
        if (user !== null) {
            for (let account of document.querySelectorAll(".profile-button")) {
                let re = new RegExp(`\(${user}\)`);
                if (account.innerHTML.match(re))
                    account.click();
            }
        }
    });
