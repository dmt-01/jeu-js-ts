"use strict";
const hp_p = document.getElementById("player_hp");
const hp_e = document.getElementById("enemi_hp");
const startButton = document.getElementById("startButton");
const gameStart = document.getElementById("gameStart");
const button_1 = document.getElementById("buton_1");
const button_2 = document.getElementById("buton_2");
const button_3 = document.getElementById("buton_3");
const button_4 = document.getElementById("buton_4");
const sprite_baki = document.getElementById("sprite_baki");
const sprite_yuujiro = document.getElementById("sprite_yuujiro");
const images_baki = ["../images/baki_sprite1.png", "../images/baki_sprite2.png"];
const images_yuujiro = ["../images/yujiro_sprite1.png", "../images/yujiro_sprite2.png"];
const yuujiroAttacks = [
    { name: "douceur", minDamage: 10, maxDamage: 15 },
    { name: "la claque du cowboy", minDamage: 20, maxDamage: 25 },
    { name: "Provocation", minDamage: 0, maxDamage: 0 },
];
button_1 === null || button_1 === void 0 ? void 0 : button_1.addEventListener("click", attack_poing);
button_2 === null || button_2 === void 0 ? void 0 : button_2.addEventListener("click", attack_Coup_spécial);
button_3 === null || button_3 === void 0 ? void 0 : button_3.addEventListener("click", attack_Esquive);
button_4 === null || button_4 === void 0 ? void 0 : button_4.addEventListener("click", attack_Provocation);
let hp_player = 100;
let hp_enemi = 100;
let esquiveActive = false;
let provocationActive = false;
let currentIndex_baki = 0;
let animationInterval_baki;
let currentIndex_yuujiro = 0;
let animationInterval_yuujiro;
startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    gameStart.style.display = "block";
    startSpriteAnimation();
});
function startSpriteAnimation() {
    animationInterval_baki = setInterval(() => {
        currentIndex_baki = (currentIndex_baki + 1) % images_baki.length;
        if (sprite_baki) {
            sprite_baki.src = images_baki[currentIndex_baki];
        }
    }, 150);
    animationInterval_yuujiro = setInterval(() => {
        currentIndex_yuujiro = (currentIndex_yuujiro + 1) % images_yuujiro.length;
        if (sprite_yuujiro) {
            sprite_yuujiro.src = images_yuujiro[currentIndex_yuujiro];
        }
    }, 150);
}
function stopSpriteAnimation() {
    clearInterval(animationInterval_baki);
    clearInterval(animationInterval_yuujiro);
}
function update_hp() {
    if (hp_p) {
        hp_p.style.width = hp_player + "%";
    }
    if (hp_e) {
        hp_e.style.width = hp_enemi + "%";
    }
}
function finish() {
    if (hp_enemi === 0 || hp_player === 0) {
        stopSpriteAnimation();
        button_1 === null || button_1 === void 0 ? void 0 : button_1.removeEventListener("click", attack_poing);
        button_2 === null || button_2 === void 0 ? void 0 : button_2.removeEventListener("click", attack_Coup_spécial);
        button_3 === null || button_3 === void 0 ? void 0 : button_3.removeEventListener("click", attack_Esquive);
        button_4 === null || button_4 === void 0 ? void 0 : button_4.removeEventListener("click", attack_Provocation);
    }
}
function toggleButtons(isEnabled) {
    button_1.disabled = !isEnabled;
    button_2.disabled = !isEnabled;
    button_3.disabled = !isEnabled;
    button_4.disabled = !isEnabled;
}
function enemy_atack() {
    const attack = yuujiroAttacks[Math.floor(Math.random() * yuujiroAttacks.length)];
    let damageToPlayer = Math.floor(Math.random() * (attack.maxDamage - attack.minDamage + 1)) + attack.minDamage;
    if (attack.name === "Provocation") {
        provocationActive = true;
        document.getElementById("text").textContent = "Yuujiro te provoque en souriant ! Ces prochains dégâts seront augmentés.";
    }
    else {
        if (provocationActive) {
            damageToPlayer = Math.floor(damageToPlayer * 1.3);
        }
        if (esquiveActive) {
            esquiveActive = false;
            document.getElementById("text").textContent = `Yuujiro a fait genre de te louper ! Tu as reçu aucun dégâts !`;
        }
        else {
            hp_player = Math.max(0, hp_player - damageToPlayer);
            update_hp();
            document.getElementById("text").textContent = `Yuujiro utilise ${attack.name} et t'inflige ${damageToPlayer} points de dégâts.`;
        }
    }
    if (hp_player === 0) {
        toggleButtons(false);
        document.getElementById("text").textContent = "Tu as perdu 💀 !";
    }
    else {
        toggleButtons(true);
    }
}
function attack_poing() {
    let bonus;
    if (provocationActive === true) {
        bonus = 1.5;
    }
    else {
        bonus = 1;
    }
    toggleButtons(false);
    const damageToEnemy = Math.floor((Math.random() * 11 + 10) * bonus);
    hp_enemi = Math.max(0, hp_enemi - damageToEnemy);
    update_hp();
    document.getElementById("text").textContent = `Baki met un coup de poing et inflige ${damageToEnemy} points de dégâts a son daron!`;
    if (hp_enemi === 0) {
        document.getElementById("text").textContent = "Tu as gagné 🎉 !";
        finish();
        return;
    }
    provocationActive = false;
    setTimeout(() => {
        enemy_atack();
    }, 2500);
}
function attack_Coup_spécial() {
    let bonus;
    if (provocationActive === true) {
        bonus = 1.5;
    }
    else {
        bonus = 1;
    }
    let isCritical = Math.random() < 0.50;
    let damage = Math.floor((Math.random() * 16 + 10) * bonus);
    if (isCritical) {
        damage = Math.floor(damage * 2);
    }
    toggleButtons(false);
    hp_enemi = Math.max(0, hp_enemi - damage);
    update_hp();
    if (isCritical) {
        document.getElementById("text").textContent = `Coup critique ! Baki met un coup de pied retourné dans les parties de Yuujiro avec ${damage} points de dégâts !`;
    }
    else {
        document.getElementById("text").textContent = `Baki met un coup de pied retourné et inflige ${damage} points de dégâts.`;
    }
    if (hp_enemi === 0) {
        document.getElementById("text").textContent = "Tu as gagné 🎉 !";
        finish();
        return;
    }
    provocationActive = false;
    setTimeout(() => {
        enemy_atack();
    }, 2500);
}
function attack_Esquive() {
    toggleButtons(false);
    esquiveActive = true;
    update_hp();
    document.getElementById("text").textContent = `Baki esquive la claquette de papa ! Aucun dégât infligé.`;
    if (hp_enemi === 0) {
        document.getElementById("text").textContent = "Tu as gagné 🎉 !";
        finish();
        return;
    }
    setTimeout(() => {
        enemy_atack();
    }, 2500);
}
function attack_Provocation() {
    toggleButtons(false);
    provocationActive = true;
    update_hp();
    document.getElementById("text").textContent = `Baki provoque Yuujiro. Baki prépare le prochain coup et augmente ces dégâts`;
    if (hp_enemi === 0) {
        document.getElementById("text").textContent = "Tu as gagné 🎉 !";
        finish();
        return;
    }
    setTimeout(() => {
        enemy_atack();
    }, 2500);
}
