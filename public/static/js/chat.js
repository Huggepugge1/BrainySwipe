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
    if (value !== "") element.innerHTML = value.replace(/<[^>]*>/g, "");
    div.appendChild(element);
    return div;
};

const createProfileButton = (account) => {
    let button = document.createElement("button");
    button.className = "medium profile-button";
    button.onclick = () => {
        let name = document.querySelector("#name");
        name.innerHTML = `${account.name} (${account.username})`;
        let username = document.querySelector("#username");
        username.value = account.username;
        const messageContainer = document.querySelector("#messages");
        messageContainer.replaceChildren();
        let messageElement;
        getMessages()
            .then((AM) => {
                let {messages, accounts} = JSON.parse(AM);
                console.log(messages)
                messages.forEach((message) => {
                    if (message.sent) messageElement = createMessage("p", "medium message sent", message.value);
                    else messageElement = createMessage("p", "medium message recieved", message.value);
                    messageContainer.appendChild(messageElement);
                });
            });
    };
    button.innerHTML = `${account.name} (${account.username})`;
    return button;
};

const autoPickUpLine = () => {
    document.querySelector("#message").value = [
        `Forget hydrogen! You’re my number one element.`,
        `Your body must be made of oxygen and neon, because you are the One.`,
        `You are my density!`,
        `Go with me and you’ll be (Mg,Fe)7Si8O22(OH)2.`,
        `Hey, does this handkerchief smell like CHCl3?`,
        `Come with me; let’s convert our potential energy into kinetic energy.`,
        `I’ve got my ion you, baby.`,
        `Talk nerdy to me.`,
        `I think you’re suffering from a lack of vitamin me.`,
        `You’re like a dictionary — you add meaning to my life.`,
        `You must be a star because I can’t stop orbiting around you.`,
        `I lava you! Do you lava me?`,
        `Even if there was no gravity on this planet, I would still fall for you.`,
        `You’re so hot, I bet you’re the one causing global warming.`,
        `You make my dopamine levels go all silly!`,
        `You must be a pile of dinosaur bones, because I dig you.`,
        `I love you like an unspoken metaphor. That’s why I had to use a simile.`,
        `You’re so hot that you managed to melt the elastics in my underwear.`,
        `You had me at your impeccable spelling and correct usage of grammar.`,
        `I think I’ve discovered my supersymmetric partner in you.`,
        `Are you a high test score? Because I just want to take you home and show you to my parents.`,
        `Me without you is like a nerd without braces.`,
        `I’m learning about important dates in history. Wanna be one of them?`,
        `I used to be able to recite the English alphabet before we met. Now, I can’t get past “u.”`,
        `Hey girl, are you gold? Because I’m in Au of your beauty.`,
        `Your Bosons are giving me a Hadron.`,
        `If we were chromosomes, you’d be my homologous pair.`,
        `Your lab or my lab?`,
        `Are you into science? Because I lab you so much!`,
        `You’re sweeter than fructose.`,
        `If you go out with me, I promise I won’t take you for granite.`,
        `You’re more special than relativity.`,
        `Are you made of copper and tellurium? Because you’re CuTe.`,
        `My favorite element on the periodic table is Uranium, because I am in love with U.`,
        `You’re hotter than a Bunsen burner.`,
        `You’re sweeter than 3.14!`,
        `You’ve got the curves, I’ve got the angles.`,
        `You are one well-defined function!`,
        `Hey, nice asymptote!`,
        `My love for you goes on like the value of pi.`,
        `I’m not being obtuse, but you’re so acute!`,
        `If I was a knight in shining armor, would you lower your drawbridge for me?`,
        `If I was a chessboard, I’d be lucky to have a king/queen like you.`,
        `Roses are #FF0000, violets are #0000FF. All my base belongs to you.`,
        `You’re cute, I’m cute. Together, we’re 2cute!`,
        `Excuse me, I just noticed you noticing me, so I just wanted to give you a notice that I noticed you too.`,
        `I was lost in space until I saw you.`,
        `I’ll smuggle you in my spaceship any day.`,
        `You must have your phaser set to stunning.`,
        `I want our love to be like pi, irrational and never-ending.`,
        `You’ve got more curves than a triple integral.`,
        `I am cosine squared and you are sine squared. Together, we are one.`,
        `Are you the square root of -1? Because you can’t be real!`,
        `Your body has the nicest arc length I’ve ever seen.`,
        `Can I plug my solution into your equation?`,
        `I need some answers for my math homework. Quick. What’s your number?`,
        `You must be a 90-degree angle, because you’re looking all right!`,
        `If you’re so good at algebra, could you replace my X without asking Y?`,
        `If you were an angle, you’d be acute one.`,
        `You and I add up better than the Riemann sum.`,
        `Can I have your significant digits?`,
        `I would really like to bisect your angle.`,
        `You must be the square root of 2, because I feel irrational around you.`,
        `Do you want to share some electrons? Maybe we could have a stable relationship.`,
        `Whenever you and I get together, it’s like a superposition of 2 waves in phase.`,
        `Every time I see you, my cardiovascular system gets all worked up.`,
        `Is there a science room nearby, or am I just sensing chemistry between us?`,
        `You must be related to Nikola Tesla, because you’re electrifying.`,
        `Are you made of beryllium, gold, and titanium? Because you are BeAuTi-ful.`,
        `Are you made of uranium? I’m made of iodine! That explains why all I can see is U and I together.`,
        `Are you a carbon sample? Because I want to date you.`,
        `You’re like an exothermic reaction, you spread your hotness everywhere!`,
        `Falling in love with you takes less time than my DNA takes to replicate.`,
        `I wish I was an ion, so I could form an exothermic bond with you.`,
        `My hypothalamus must be secreting serotonin right now, because you’re making me happy!`,
        `I wish I was your coronary artery so that I could be wrapped around your heart.`,
        `You seem to be traveling at the speed of light, because time always seems to stop when I look at you.`,
        `Could you tell me the oxidation state of this atom and your phone number?`,
        `According to the second law of thermodynamics, you’re supposed to share your body heat with me.`,
        `You’re way hotter than the bottom of my laptop.`,
        `I’m a cube; you’re a cube — let’s make a tesseract!`,
        `Hey hon, are you made of dark matter? Because you’re indescribable.`,
        `Are you the moon? Because even in the dark, you shine bright like a diamond.`,
        `Wow! You radiate in the shortest wavelengths I’ve ever seen.`,
        `Are you from Mars? Because you look out of this world.`,
        `You must be made of Fluorine, Iodine, and Neon, because you’re so FINe.`,
        `Did we have class together? I could’ve sworn we had chemistry.`,
        `Your pH must be 14 because you’re the most basic need in my life right now.`,
        `I must be going through anaerobic respiration right now ’cause you take my breath away.`,
        `Why would I need to know about the solar system? My whole world revolves around you.`,
        `Your beauty is as rare as a Venus eclipse.`,
        `Baby, you just turned my bronze into iron.`,
        `Do you like math? Add you and me, subtract our clothes, divide your legs, and we can multiply.`,
        `I wish I was a secant line so I could touch your curve twice.`,
        `Are you a differentiable function? Because I’d like to be the tangent to your curves!`,
        `Let’s go to my room so I can show you the exponential growth of my natural log.`,
        `My favorite attractive force is Van der Waal’s force. Can you feel it? I’ll move closer if you can’t.`,
        `If I was an enzyme, I’d be helicase so I could unzip your genes.`,
        `Did you know that chemists do it on the table periodically? Let’s be chemists for a day!`,
        `Your clothes would look better accelerating towards the floor at 9.8 m/s.`,
        `Want to experience a gamma-ray burst?`,
        `Your name must be Andromeda, because we are destined to collide.`,
        `Wanna partner up so we can test the spring potential of my bed mattress?`,
        `If I supply the voltage and you supply the resistance, imagine the currents we can make together.`,
        `Hey baby, wanna violate the Pauli Exclusion Principle with me?`,
        `I must be a diamond now, because you just gave me a hardness of 10.`,
        `You know, it’s not the length of the vector that counts. It’s how you apply the force.`,
        `We have such great chemistry that we should do some biology together.`,
        `Let’s unzip our genes and see if we can share codes together.`,
        `Let me be your integral so I can be the area under your curves.`,
        `If I was a drum, I’d let you bang me all day long!`,
        `You must be halite, because you have perfect cleavage!`,
        `Is that a metronome in your pocket, or are you just happy to see me?`,
        `They say I’m like a Rubik’s cube. The more you play with me, the harder I get.`,
        `Don’t worry; I played Tetris as a kid. I can make it fit.`,
        `Yes, I have an iPhone in my pocket. Also, I’m glad to see you.`,
        `How about we go back to my place and form a covalent bond?`,
        `Let’s make like Excel and spreadsheets.`,
        `Let’s hang out sometime. You bring your beaker and I’ll bring my stirring rod.`,
        `Hey babe, wanna make a zygote?`,
        `Wanna exchange genetic information with me?`,
        `Are you a fossil? Because I want to date you!`,
        `Are you my homework? Because I’d have to do you hard on my table the whole night.`,
        `Come, let’s measure the coefficient of friction between us.`,
        `I wish I could ctrl-A your clothes and press delete.`,
        `It would be my pleasure to turn on your personal hotspot.`,
        `Are you an exoplanet? Because I’m bad at astronomy and pick-up lines.`,
        `How about you and I form a binary system.`
    ][128 * Math.random() | 0];
}

getMessages()
    .then((AM) => {
        let {messages, accounts} = JSON.parse(AM);
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
