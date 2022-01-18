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
