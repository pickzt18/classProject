function getCountryInfo() {
  let country = document.getElementById("country").value;
  let countryFood = document.getElementById("country");
  countryFood = countryFood.options[countryFood.selectedIndex].id;
  console.log(countryFood);
  let arr = fetch("https://restcountries.com/v3.1/name/" + country)
    .then((data) => data.json())
    .then((arr) => {
      getCovidData(arr);
    });
}
function getCovidData(arr) {
  /*let covData = fetch(
    "https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=" +
      arr[0].altSpellings[0],
    {
      headers: { Authorization: "Bearer AodByqPd8eMAYbGRH8jYyM2JemKi" },
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
      } else {
        getFlightData();
      }
    });*/
  getFlightData();
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
      headers: { Authorization: "Bearer cFk7B1G2gYXsuENuy94wk1f5uOXg" },
    }
  )
    .then((res) => res.json())
    .then((flight) => {
      console.log(flight.data[0].itineraries[0].segments[0].departure);
      for (let i = 0; i < flight.data[0].itineraries[0].segments.length; i++) {
        document.getElementById("results_container").innerText +=
          "Departure: " +
          flight.data[0].itineraries[0].segments[i].departure.iataCode +
          " at: " +
          flight.data[0].itineraries[0].segments[i].departure.at.toString(
            "en-US"
          ) +
          " Arrival: " +
          flight.data[0].itineraries[0].segments[i].arrival.iataCode +
          " at: " +
          flight.data[0].itineraries[0].segments[i].arrival.at.toString(
            "en-US"
          );
      }
    });
}
function countryData(arr) {
  document.getElementById("results_container").innerText =
    "Capital: " +
    arr[0].capital +
    " Landlocked: " +
    arr[0].landlocked +
    " Area: " +
    arr[0].area +
    " Population " +
    arr[0].population;
}
document.getElementById("country").addEventListener("change", getCountryInfo);

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
}
document
  .getElementById("country")
  .addEventListener("change", getCountryCuisine);
