$(document).ready(function () {
  let amenities = [];

  // attach an event listener to listen to a change in checkboxes
  $("input[type='checkbox']").change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      const amenity = {
        id: amenityId,
        name: amenityName
      };
      amenities.push(amenity);
    } else {
      amenities = amenities.filter(function (amenity) {
        return amenity.id !== amenityId;
      });
    }

    let selectedAmenities = '';
    for (let i = 0; i < amenities.length; i++) {
      selectedAmenities += amenities[i].name;
      if (i !== amenities.length - 1) {
        selectedAmenities += ', ';
      }
      if (i === 1) {
        selectedAmenities += '...';
        break;
      }
    }

    $('div.amenities h4').text(selectedAmenities);
  });

  // check api status
  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });

  // fetch places
  const dataPosted = {
    states: '',
    cities: '',
    amenities: ''
  };
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ dataPosted }),
    success: function (places) {
      $('section.places').empty();
      $.each(places, function (index, place) {
        const placeSection = '<artcle>' +
          '<div class="title_box">' +
          '<h2>' + place.name + '</h2>' +
          '<div class="price_by_night">' + place.price_by_night +
          '</div>' + '</div>' +
          '<div class="information">' +
          '<div class="max_guest">' + place.max_guest +
          ' Guest(s)' + '</div>' +
          '<div class="number_rooms">' + place.number_rooms +
          ' Bedroom(s)' + '</div>' +
          '<div class="number_bathrooms">' + place.number_bathrooms +
          ' Bathroom(s)' + '</div>' + '</div>' +
          '<div class=description">' + place.description +
          '</div>' +
          '</article>';
        $('section.places').append(placeSection);
      });
    }
  });
	// Event listener for the filter button
  $('#filter-button').click(function () {
    const amenityIds = amenities.map(amenity => amenity.id);

    // Send a POST request with the list of checked amenity IDs
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: amenityIds }),
      success: function (places) {
        // Clear the existing places
        $('section.places').empty();

        // Loop through the places and create article tags
        places.forEach(function (place) {
          const article = document.createElement('article');
          article.innerHTML = `<h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div>`;
          $('section.places').append(article);
        });
      },
      error: function (error) {
        console.error('Error loading places:', error);
      }
    });
  });
	// Listen to changes on each input checkbox tag
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const selectedStates = new Set();
const selectedCities = new Set();

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');

        if (this.checked) {
            if (this.parentNode.parentNode.id === 'states') {
                selectedStates.add(id);
            } else if (this.parentNode.parentNode.id === 'cities') {
                selectedCities.add(id);
            }
        } else {
            if (this.parentNode.parentNode.id === 'states') {
                selectedStates.delete(id);
            } else if (this.parentNode.parentNode.id === 'cities') {
                selectedCities.delete(id);
            }
        }

        updateLocationText();
    });
});

function updateLocationText() {
    const locationText = document.querySelector('#Locations h4');
    locationText.innerHTML = 'Locations: ' + [...selectedStates, ...selectedCities].join(', ');
}

// When the button tag is clicked, make a new POST request to places_search
const searchButton = document.querySelector('#searchButton');
searchButton.addEventListener('click', function () {
    const amenities = getSelectedAmenities(); // Implement this function to get selected amenities
    const selectedStatesArray = [...selectedStates];
    const selectedCitiesArray = [...selectedCities];

    // Make the POST request to places_search with selected amenities, states, and cities
    // You can use a library like Axios or fetch to make the request.
    // Example using fetch:
    fetch('/places_search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amenities: amenities,
            states: selectedStatesArray,
            cities: selectedCitiesArray,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Handle the response data as needed
        })
        .catch((error) => {
            console.error('Error:', error);
   });
});
