function getCountryInfo() {
  let country = document.getElementById("country").value;
  let arr = fetch("https://restcountries.com/v3.1/name/" + country)
    .then((data) => data.json())
    .then((arr) => countryData(arr));
}
function countryData(arr) {
  document.getElementById("results_title").innerText =
    "Capital: " +
    arr[0].capital +
    " Landlocked: " +
    arr[0].landlocked +
    " Area: " +
    arr[0].area +
    " Population " +
    arr[0].population;
  let a = console.log(
    fetch(
      "https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=" +
        arr[0].altSpellings[0],
      {
        headers: { Authorization: "Bearer e6dyy1Z0MeNJRIbUQRwTkuUDR4DWsBAp" },
      }
    ).then((def) => def.json())
  );
}
document.getElementById("country").addEventListener("change", getCountryInfo);
