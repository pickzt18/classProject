let accessKey = "";
let token = "";
window.addEventListener("load", () => {
  accessKey = fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&client_id=e6dyy1Z0MeNJRIbUQRwTkuUDR4DWsBAp&client_secret=LLpPNQeGMMitf7GV",
  }).then((def) => def.json());
});

function getCountryInfo() {
  let country = document.getElementById("country").value;
  let countryFood = document.getElementById("country");
  document.getElementById("meal_image").src = "";
  document.getElementById("meal_id").innerHTML = "";
  document.getElementById("results_container_meals").innerHTML = "";
  if (country === "China") {
    alert("The API combines data from Macao and mainland China");
  }
  countryFood = countryFood.options[countryFood.selectedIndex].id;
  let arr = fetch("https://restcountries.com/v3.1/name/" + country)
    .then((data) => data.json())
    .then((arr) => {
      accessKey.then((value) => {
        token = value.access_token;
        getCovidData(arr);
      });
    });
}
function getCovidData(arr) {
  countryData(arr);
  let covData = fetch(
    "https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=" +
      arr[0].altSpellings[0],
    {
      headers: { Authorization: "Bearer " + token },
    }
  )
    .then((def) => def.json())
    .then((covData) => {
      let risk = document.getElementById("results_title");
      risk.innerHTML = "Covid Risk Level";
      if (
        covData.data.diseaseRiskLevel === "Extreme" ||
        covData.data.diseaseRiskLevel === "High"
      ) {
        risk.className = "results_title-active";
        risk.innerHTML += ":\n" + covData.data.diseaseRiskLevel;
        getCountryCuisine();
      } else if (
        covData.data.diseaseRiskLevel === "Medium" ||
        covData.data.diseaseRiskLevel === "Low"
      ) {
        risk.className = "text-success";
        risk.innerHTML += ":\n" + covData.data.diseaseRiskLevel;
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
      headers: { Authorization: "Bearer " + token },
    }
  )
    .then((res) => res.json())
    .then((flight) => {
      let depTime, arrTime;
      for (let i = 0; i < flight.data[0].itineraries[0].segments.length; i++) {
        depTime = moment(
          flight.data[0].itineraries[0].segments[i].departure.at
        ).format("MM/DD/YYYY h:mm a");
        arrTime = moment(
          flight.data[0].itineraries[0].segments[i].departure.at
        ).format("MM/DD/YYYY h:mm a");
        console.log(typeof depTime);
        document.getElementById("flight_info").innerText +=
          "\nDeparture: " +
          flight.data[0].itineraries[0].segments[i].departure.iataCode +
          "\nat: " +
          depTime +
          "\nArrival: " +
          flight.data[0].itineraries[0].segments[i].arrival.iataCode +
          "\nat: " +
          arrTime;
      }
      document.getElementById("flight_info").innerText +=
        "\nPrice: $" + flight.data[0].price.total;
    });
}

function countryData(arr) {
  let langKeys = Object.keys(arr[0].languages);
  let curKeys = Object.keys(arr[0].currencies);
  let currency = curKeys[0];
  let language = langKeys[0];
  let curConvert = fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/" +
      currency.toLowerCase() +
      ".json"
  ).then((cur) => cur.json());
  document.getElementById("country_info").innerText =
    "Capital: " +
    arr[0].capital +
    "\nLandlocked: " +
    arr[0].landlocked +
    "\nArea: " +
    arr[0].area +
    "\nPopulation: " +
    arr[0].population +
    "\nLanguage: " +
    arr[0].languages[language];
  curConvert.then(
    (curConvert) =>
      (document.getElementById("currency_info").innerText +=
        "\n1 : USD to " +
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
function clickImage() {
  let clickableImage = document.getElementById("meal_image");
  var url = "https://www.themealdb.com/meal.php?c=";
  var mealId = document.getElementById("meal_id").innerHTML;
  window.location = url + mealId;
}

document.getElementById("meal_image").addEventListener("click", clickImage);

document.getElementById("country").addEventListener("change", getCountryInfo);
