# Planering BrainySwipe - Hugo Lindström

## 1. Inledning

### 1.1 Kort beskrivning av projektet
Jag ska göra en datinghemsida med fokus på teknikelever.

### 1.2 Beskrivning av målgrupp
Extrema nördar. Kommer innehålla funktioner som bara otroligt stora nördar skulle kunna komma på att de behöver.

### 1.3 Betyg
A

## 2. Ingående beskrivning av projektet
### 2.1 Beskrivningen
Många kanske tycker att det är drygt med datingappar och datinghemsidor som inte har inbyggda kortkommandon samt ingen automatisk swiping. 
Jag vill göra en sida där man lätt kan skapa ett konto och börja dejta. Allting ska ha både kortkommandon och grafiska knappar samt så ska det finnas
en funktion som swipear alla till höger. Jag vill också lägga till en funktion som gör det långsamt att swipea vänster för att få fler att 
prata med varandra då man inte orkar säga nej. Ens profil kommer inte innehålla vanliga personuppgifter såsom om man har hund utan saker som 
favoritdel av fysik eller drömuniversitet. Chatfunktionen ska även innehålla en knapp som låter en slumpa mellan 100+ nördiga pick-up-lines.

### 2.2 Lista av saker som ska göras för att projektet ska bli till
#### 2.2.1 Frontend
* **Login** -> Formulär för att logga in / registrera
* **Logout** -> Du har nu loggat ut sida
* **Dashboard** -> Man ska kunna se swipe-kort, help samt en gå till chat knapp
* **Chat** -> Man kan chatta med den som du och den andra har swipat höger.
* **Profile** -> Visa ens profil samt stats
* **Help** -> Visar alla kortkommandon

#### 2.2.2 Backend
* **Login samt logout** -> Cookie handler
* **Profile** -> Skapa profil, kryptera lösenord, ändra profil, visa stats
* **Chat** -> Kunna chatta med varandra
* **Swipea** -> Veta vem som swipeat vem samt autoswiper

#### 2.2.3 Databas
* **Profiler** -> ID, användarnamn, krypterat lösenord, samt alla olika personligheter med mera
* **Swipat** -> ID1, ID2, höger, vänster
* **Meddelanden** -> ID1, ID2, meddelande

### 2.3 Undersidor
* **Login** -> Formulär för att logga in / registrera
* **Logout** -> Du har nu loggat ut sida
* **Profile** -> Du ska kunna se och modifiera din profil
* **Dashboard** -> Man ska kunna se swipe-kort, logga ut, se help, samt en gå till chat knapp
* **Chat** -> Man kan chatta med den som du och den andra har swipat höger

### 2.4 Moduler
* **Login** -> Kunna logga in
* **Logout** -> Kunna logga ut
* **Cookies** -> Kunna behålla login
* **Profile** -> Kunna skapa, uppdatera, se status samt statistik
* **Swipe** -> Kunna swipa
* **Messages** -> Kunna ta emot samt skicka meddelanden
* **Server** -> Express server för att kunna göra GET, POST, DELETE och PUT requests

### 2.5 Databas
* **Profiles** <br>
    | ID(primary key)  | name      | age | favorite_physics_field | dream_university |
    |------------------|-----------|-----|------------------------|------------------|
    | INT32 (auto inc) | CHAR(100) | INT | CHAR(100)              | CHAR(100)        |
* **Messages**
    | ID(primary key)  | userID (secondary key) | content    |
    |------------------|------------------------|------------|
    | INT32 (auto inc) | INT                    | CHAR(1000) |
* **Swiped**
    | ID(primary key)  | user1ID (foreign key) | user2ID (foreign key) | swiped |
    |------------------|-----------------------|-----------------------|--------|
    | INT32 (auto inc) | INT                   | INT                   | BIT    |
![Databas modell](./images/databas.png)

### 2.6 Kunskaper
Jag kommer behöva

### 2.7 Säkerhet


## 3. Tidsplanering - Deadlines
* Server - ND
* Dashboard-frontend - ND
* Login-frontend - ND
* Logout-frontend - ND
* Profile-frontend - ND
* Chat-frontend - ND
* Login-backend - ND
* Logout-backend - ND
* Profile-backend - ND
* Login-databas - ND
* Logout-databas - ND
* Profile-databas - ND
* Swipe-backend - ND
* Chat-backend - ND
* Help-backend - ND

## 4. Dokumentation
