$(document).ready(init);
var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var max_matches = 7;
var games_played = 0;
var attempts = null;
const CARDS = [
  "buttStallion",
  "jack",
  "tina",
  "badonkL",
  "badonkR",
  "zero",
  "zero",
  "zero",
  "psycho",
  "psycho",
  "maya",
  "maya",
  "flak",
  "flak",
  "lillith",
  "lillith",
  "roland",
  "roland"
];
var zeroHaiku = [
  "Haiku's are quite rad,",
  "But sometimes they don't make sense,",
  "Refridgerator."
];
var zerosFound = 0;
var damselsSafe = false;
function init() {
  $(".gameboard").on("click", ".card-back", handleCardClick);
  var cards = [...CARDS];
  randomizeCardLocations(cards);
}

function randomizeCardLocations(cardArray) {
  var gameboard = $(".gameboard");
  for (var i = 0; i < 3; i++) {
    var currentRow = $("<div>").addClass("row");
    for (var cardIndex = 0; cardIndex < 6; cardIndex++) {
      let currentCard = $("<div>").addClass("card-container");
      let cardBack = $("<div>").addClass("card-back");
      currentCard.append(cardBack);
      let randomIndex = Math.floor(Math.random() * cardArray.length);
      let randomClass = cardArray.splice(randomIndex, 1);
      let cardFront = $("<div>").addClass(randomClass);
      currentCard.append(cardFront);
      currentRow.append(currentCard);
    }
    gameboard.append(currentRow);
  }
}
function handleCardClick(event) {
  var card = $(this);
  if (!firstCardClicked) {
    firstCardClicked = $(card);
    firstCardClicked.toggleClass("shrink");
    if (firstCardClicked[0].nextSibling.className === "tina") {
      damselsSafe = true;
      resetCards();
      setTimeout(function() {
        $(".tina").addClass("quiet");
      }, 700);
      $(".damselstatus .statstext")
        .removeClass("notsafe")
        .addClass("safe");
    } else if (firstCardClicked[0].nextSibling.className === "zero") {
      var thisZero = firstCardClicked;
      resetCards();
      setTimeout(function() {
        $(thisZero[0].nextSibling).addClass("quiet");
      }, 700);
      var selector = ".zerohaiku .haiku" + zerosFound;
      $(selector).text(zeroHaiku[zerosFound++]);
    }
    return;
  } else if (secondCardClicked) {
    return;
  } else {
    attempts++;
    secondCardClicked = $(card);
    secondCardClicked.toggleClass("shrink");
    var firstClass = firstCardClicked[0].nextSibling.className;
    var secondClass = secondCardClicked[0].nextSibling.className;
    switch (secondClass) {
      case "jack":
        if (firstClass === "buttStallion") {
          matches++;
          setTimeout(function() {
            $(firstCardClicked[0].nextSibling).addClass("quiet");
            $(secondCardClicked[0].nextSibling).addClass("quiet");
            resetCards();
          }, 700);
        } else {
          setTimeout(function() {
            firstCardClicked.toggleClass("shrink");
            secondCardClicked.toggleClass("shrink");
            resetCards();
          }, 1500);
        }
        break;
      case "buttStallion":
        if (firstClass === "jack") {
          matches++;
          setTimeout(function() {
            $(firstCardClicked[0].nextSibling).addClass("quiet");
            $(secondCardClicked[0].nextSibling).addClass("quiet");
            resetCards();
          }, 700);
        } else {
          setTimeout(function() {
            firstCardClicked.toggleClass("shrink");
            secondCardClicked.toggleClass("shrink");
            resetCards();
          }, 1500);
        }
        break;
      case "psycho":
        matches++;
        if (firstClass === "psycho" && matches !== max_matches) {
          matches--;
          loseCondition("psycho");
        } else if (firstClass === "psycho" && matches === max_matches) {
          winCondition();
        } else {
          matches--;
          setTimeout(function() {
            firstCardClicked.toggleClass("shrink");
            secondCardClicked.toggleClass("shrink");
            resetCards();
          }, 1500);
        }
        break;
      case "zero":
        var selector = ".zerohaiku .haiku" + zerosFound;
        $(selector).text(zeroHaiku[zerosFound++]);
        setTimeout(function() {
          $(secondCardClicked[0].nextSibling).addClass("quiet");
          firstCardClicked.toggleClass("shrink");
          resetCards();
        }, 700);
        break;
      case "badonkL":
        if (firstClass === "badonkR") {
          if (!damselsSafe) {
            loseCondition("tina");
          } else {
            matches++;
            setTimeout(function() {
              $(firstCardClicked[0].nextSibling).addClass("quiet");
              $(secondCardClicked[0].nextSibling).addClass("quiet");
              resetCards();
            }, 700);
          }
          break;
        } else {
          setTimeout(function() {
            firstCardClicked.toggleClass("shrink");
            secondCardClicked.toggleClass("shrink");
            resetCards();
          }, 1500);
        }
      case "badonkR":
        if (firstClass === "badonkL") {
          if (!damselsSafe) {
            loseCondition("tina");
          } else {
            matches++;
            setTimeout(function() {
              $(firstCardClicked[0].nextSibling).addClass("quiet");
              $(secondCardClicked[0].nextSibling).addClass("quiet");
              resetCards();
            }, 700);
          }
        } else {
          setTimeout(function() {
            firstCardClicked.toggleClass("shrink");
            secondCardClicked.toggleClass("shrink");
            resetCards();
          }, 1500);
        }
        break;
      case "tina":
        damselsSafe = true;
        setTimeout(function() {
          $(secondCardClicked[0].nextSibling).addClass("quiet");
          firstCardClicked.toggleClass("shrink");
          resetCards();
        }, 700);
        break;
      default:
        if (firstClass === secondClass) {
          matches++;
          setTimeout(function() {
            $(firstCardClicked[0].nextSibling).addClass("quiet");
            $(secondCardClicked[0].nextSibling).addClass("quiet");
            resetCards();
          }, 700);
        } else {
          setTimeout(function() {
            firstCardClicked.toggleClass("shrink");
            secondCardClicked.toggleClass("shrink");
            resetCards();
          }, 1500);
        }
    }
    winCondition();
    displayStats();
  }
}
function sameChecker(card) {
  if (!firstCardClicked) {
    firstCardClicked = $(card);
    firstCardClicked.toggleClass("shrink");
    return;
  } else if (secondCardClicked) {
    return;
  } else {
    attempts++;
    secondCardClicked = $(card);
    secondCardClicked.toggleClass("shrink");
  }
}
function loseCondition(typeString) {
  if (typeString === "tina") {
    var sentence = "Find an explosives expert before matching the damsels!";
  } else if (typeString === "psycho") {
    var sentence = "Match the psychos last!";
  }
  var modal = $(".victoryModal-background");
  modal.css({
    display: "block"
  });
  $(".lossType").text(sentence);
  $(".verdict").text("You lose!");
  $(".victoryModal-content > .final-attempts").text(
    "You lost in " + attempts + " attempts. Try harder next time grinder!"
  );
  $(".close").on("click", function(e) {
    modal.css({
      display: "none"
    });
    resetStats();
    $(".gameboard").empty();
    var cards = [...CARDS];
    randomizeCardLocations(cards);
  });
  resetCards();
  games_played++;
}

function winCondition() {
  if (matches === max_matches - 1) {
    $(".psychostatus .statstext")
      .removeClass("notsafe")
      .addClass("safe");
  }
  if (matches === max_matches) {
    var modal = $(".victoryModal-background");
    modal.css({
      display: "block"
    });
    $(".victoryModal-content > .final-attempts").text(
      "It took you " + attempts + " attempts to match all the pairs"
    );
    $(".victoryModal-content > .final-accuracy").text(
      "Your accuracy was " + calcAccuracy() + "%"
    );
    $(".close").on("click", function(e) {
      modal.css({
        display: "none"
      });
      resetStats();
      resetCards();
      $(".gameboard").empty();
      var cards = [...CARDS];
      randomizeCardLocations(cards);
    });
    games_played++;
  }
}

function resetCards() {
  firstCardClicked = null;
  secondCardClicked = null;
}

function calcAccuracy() {
  var percent = (matches * 100) / attempts;
  var rounded = Math.round(percent);
  return rounded;
}

function displayStats() {
  $("#attemptsDiv").text(attempts);
  if (!attempts) {
    $("#accuracyDiv").text(" ");
  } else {
    var accuracy = calcAccuracy();
    $("#accuracyDiv").text(accuracy + "%");
  }
  $("#gamesPlayedDiv").text(games_played);
}

function resetStats() {
  attempts = 0;
  matches = 0;
  zerosFound = 0;
  $("*").removeClass("hidden");
  $("*").removeClass("quiet");
  $("div").removeClass("blocker");
  displayStats();
  $(".haiku0").text("");
  $(".haiku1").text("");
  $(".haiku2").text("");
  $(".psychostatus .statstext").removeClass("safe");
  $(".damselstatus .statstext").removeClass("safe");
  $(".psychostatus .statstext").addClass("notsafe");
  $(".damselstatus .statstext").addClass("notsafe");
}
