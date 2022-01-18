function getCountryInfo() {
  let country = document.getElementById("country").value;
  let arr = fetch("https://restcountries.com/v3.1/name/" + country).then(
    (data) => data.json().then((arr) => countryData(arr))
  );
}
function countryData(arr) {
  document.getElementById("results_container").innerText =
    "Capital: " +
    arr[0].capital +
    "Languages: " +
    arr[0].languages +
    "Landlocked: " +
    arr[0].landlocked +
    "Area: " +
    arr[0].area +
    "Population " +
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
//

//Math.floor.(mathrand)meals.length
//* arr.meals.length
//name of meal, picture that links to website
