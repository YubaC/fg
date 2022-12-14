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
    stringToFormat = [diningHallLevel, diningHallMaxLevel, dormitoryLevel, dormitoryMaxLevel, costPerLevel * (diningHallLevel + dormitoryLevel), moodPerLevel * (diningHallLevel - diningHallMaxLevel / 2 + dormitoryLevel - dormitoryMaxLevel / 2)];
    // nowGameAt = "showConstruction";
    nextStep();
}

function showExpense() {
    stringToFormat = [
        costPerLevel * (diningHallLevel + dormitoryLevel) + dailyCostEachClass * class_number,
        costPerLevel * (diningHallLevel + dormitoryLevel),
        dailyCostEachClass * class_number,
        Math.round(dailyCostEachClass / 5 * class_number)
    ];
    // nowGameAt = "showConstruction";
    nextStep();
}

function exitTeach() {
    hideDialog();
    hideChoice();
}