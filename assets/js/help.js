function teach() {
    nowGameAt = "teach";
    nextStep();
}

function teachMood() {
    // nowGameAt = "teachMood";
    nextStep();
}

function teachStain() {
    // nowGameAt = "teachStain";
    nextStep();
}

function showWeather() {
    stringToFormat = [airPollution, receive_now];
    // nowGameAt = "showWeather";
    nextStep();

}

function showMoney() {
    stringToFormat = [money];
    // nowGameAt = "showMoney";
    nextStep();
}

function showMood() {
    stringToFormat = [mood, faceList[faceToShow]];
    // nowGameAt = "showMood";
    nextStep();
}

function showStain() {
    stringToFormat = [stain];
    // nowGameAt = "showStain";
    nextStep();
}

function showConstruction() {
    stringToFormat = [diningHallLevel, diningHallMaxLevel, dormitoryLevel, dormitoryMaxLevel, costPerLevel * (diningHallLevel + dormitoryLevel), moodPerLevel * (diningHallMaxLevel / 2 - diningHallLevel + dormitoryMaxLevel / 2 - dormitoryLevel)];
    // nowGameAt = "showConstruction";
    nextStep();
}

function exitTeach() {
    hideDialog();
    hideChoice();
}