function getCountryInfo() {
  let country = document.getElementById("country").value;
  let countryFood = document.getElementById("country");
  countryFood = countryFood.options[countryFood.selectedIndex].id;
  console.log(countryFood);
  let arr = fetch("https://restcountries.com/v3.1/name/" + country)
    .then((data) => data.json())
    .then((arr) => {
      getCovidData(arr);
      countryData(arr);
    });
}
function getCovidData(arr) {
  let covData = fetch(
    "https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=" +
      arr[0].altSpellings[0],
    {
      headers: { Authorization: "Bearer gQidbFmEFXBfrcUiGekqfGLPyMwA" },
    }
  )
    .then((def) => def.json())
    .then((covData) => {
      if (
        covData.diseaseRiskLevel === "High" ||
        covData.diseaseRiskLevel === "Extreme"
      ) {
        getCountryCuisine();
      } else {
        countryData();
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
