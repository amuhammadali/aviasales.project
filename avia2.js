const flights = JSON.parse(sessionStorage.getItem("flights")).data;
console.log(flights);

const flightContainer = document.querySelector(".flights-container");

flights.map((flight) => {
  flightContainer.innerHTML += `
    <div>
    <span>${flight.itineraries[0].segments[0].departure.iataCode}   =>   </span>
    <span>${
      flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1]
        .arrival.iataCode} Code </span>
    <span>${flight.price.total} Price</span>
    <span>${flight.itineraries[0].segments[0].arrival.at} Go </span>
    <span>${flight.itineraries[0].segments[0].departure.at} Come</span>
    </div>
  `;
});
