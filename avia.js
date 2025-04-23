let token = JSON.parse(localStorage.getItem("token"));
console.log(token);
let accessToken = token?.accessToken;
let tokenExpirationTime = token?.tokenExpirationTime;

// Function to get a new access token
async function fetchAccessToken() {
  try {
    // Manually construct the request body as a string
    const requestBody = `grant_type=client_credentials&client_id=xAjtyxGX0gI1GEbkTwqJXiSFA6FhgJSh&client_secret=aI2GcuCDXLGlGZwl`;

    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Required header
        },
      }
    );

    console.log(response.data);



    // Save the token and its expiration time
    accessToken = response.data.access_token;

    const expiresIn = response.data.expires_in; // Expiration time in seconds
    tokenExpirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(
      "token",
      JSON.stringify({ accessToken, tokenExpirationTime })
    );
    console.log(new Date(tokenExpirationTime));
  } catch (error) {
    console.error(
      "Failed to fetch access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Middleware to check and refresh token if needed
async function ensureValidToken() {
  if (!accessToken || Date.now() >= tokenExpirationTime) {
    await fetchAccessToken();
  }
}

document.getElementById("get-flights-btn").addEventListener("submit", (e) => {
  getFlights(e);

});

async function getFlights(e) {
  e.preventDefault();

  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const departDate = document.getElementById("depart-date").value;
  const passengers = document.getElementById("passengers").value;

  await ensureValidToken();

  axios
    .get("https://test.api.amadeus.com/v2/shopping/flight-offers", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        originLocationCode: from,
        destinationLocationCode: to,
        departureDate: departDate,
        adults: parseInt(passengers),
        nonStop: false,
        max: 250,
      },
    })
    .then((response) => {
      console.log(response.data);
      
    sessionStorage.setItem("flights", JSON.stringify(response.data));
    window.location.href = "avia2.html";
    })
    .catch((error) => {
      console.log(error);
    });
}


document.getElementById("get-flights-btn").addEventListener("click", (e) => {
  getFlights(e);
});
