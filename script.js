function getCountryInfo() {
  let country = document.getElementById("country").value;
  let countryFood = document.getElementById("country");
  if (country === "China") {
    alert("The API combines data from Macao and mainland China");
  }
  countryFood = countryFood.options[countryFood.selectedIndex].id;
  console.log(countryFood);
  let arr = fetch("https://restcountries.com/v3.1/name/" + country)
    .then((data) => data.json())
    .then((arr) => {
      countryData(arr);
    });
}
function getCovidData(arr) {
  countryData(arr);
  let covData = fetch(
    "https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=" +
      arr[0].altSpellings[0],
    {
      headers: { Authorization: "Bearer 6RIThi5rJCI7uNVZc3xy3mVwbGzz" },
    }
  )
    .then((def) => def.json())
    .then((covData) => {
      console.log(covData.data.diseaseRiskLevel);
      if (
        covData.data.diseaseRiskLevel === "Extreme" ||
        covData.data.diseaseRiskLevel === "High"
      ) {
        getCountryCuisine();
      } else if (
        covData.data.diseaseRiskLevel === "Medium" ||
        covData.data.diseaseRiskLevel === "Low"
      ) {
        getFlightData();
      }
    });
}
function getFlightData() {
  let flightData = document.getElementById("country");
  flightData =
    flightData.options[flightData.selectedIndex].getAttribute("iata");
  let flight = fetch(
    "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=ORD&destinationLocationCode=" +
      flightData +
      "&departureDate=2022-02-02&adults=1&nonStop=false&currencyCode=USD&max=1",
    {
      headers: { Authorization: "Bearer 6RIThi5rJCI7uNVZc3xy3mVwbGzz" },
    }
  )
    .then((res) => res.json())
    .then((flight) => {
      for (let i = 0; i < flight.data[0].itineraries[0].segments.length; i++) {
        document.getElementById("results_container").innerText +=
          "\nDeparture: " +
          flight.data[0].itineraries[0].segments[i].departure.iataCode +
          "\nat: " +
          flight.data[0].itineraries[0].segments[i].departure.at.toLocaleString(
            "en-US"
          ) +
          "\nArrival: " +
          flight.data[0].itineraries[0].segments[i].arrival.iataCode +
          "\nat: " +
          flight.data[0].itineraries[0].segments[i].arrival.at.toLocaleString(
            "en-US"
          );
      }
      document.getElementById("results_container").innerText +=
        "\nPrice: $" + flight.data[0].price.total;
    });
}

function countryData(arr) {
  let langKeys = Object.keys(arr[0].languages);
  let curKeys = Object.keys(arr[0].currencies);
  let currency = curKeys[0];
  let language = langKeys[0];
  console.log(currency);
  let curConvert = fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/" +
      currency.toLowerCase() +
      ".json"
  ).then((cur) => cur.json());

  console.log(curConvert);
  document.getElementById("results_container").innerText =
    "Capital: " +
    arr[0].capital +
    "\nLandlocked: " +
    arr[0].landlocked +
    "\nArea: " +
    arr[0].area +
    "\nPopulation: " +
    arr[0].population +
    "\nLanguage: " +
    arr[0].languages[language] +
    "\n 1 : USD to ";
  curConvert.then(
    (curConvert) =>
      (document.getElementById("results_container").innerText +=
        " " +
        Math.round(curConvert[currency.toLowerCase()] * 100) / 100 +
        " : " +
        currency)
  );
}

//country cuisine
function getCountryCuisine() {
  let countryFood = document.getElementById("country");
  countryFood = countryFood.options[countryFood.selectedIndex].id;
  let arr = fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + countryFood
  ).then((data) => data.json().then((arr) => countryCuisine(arr)));
}
function countryCuisine(arr) {
  let randNum = Math.floor(Math.random() * arr.meals.length);
  document.getElementById("results_container_meals").innerHTML =
    arr.meals[randNum].strMeal;

  document.getElementById("meal_image").src = arr.meals[randNum].strMealThumb;
  document.getElementById("meal_id").innerHTML = arr.meals[randNum].idMeal;
}

//click image to take you to recipe

function clickImage() {
  let clickableImage = document.getElementById("meal_image");
  var url = "https://www.themealdb.com/meal.php?c=";
  var mealId = document.getElementById("meal_id").innerHTML;
  window.location = url + mealId;
  //console.log("clicked");
}

document.getElementById("meal_image").addEventListener("click", clickImage);

document.getElementById("country").addEventListener("change", getCountryInfo);
