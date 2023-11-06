$(document).ready(function () {
  let amenitiesList = [];

  // attach an event listener to listen to a change in checkboxes
  $("input[type='checkbox']").change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      const amenity = {
        id: amenityId,
        name: amenityName
      };
      amenitiesList.push(amenity);
    } else {
      amenitiesList = amenitiesList.filter(function (amenity) {
        return amenity.id !== amenityId;
      });
    }

    let selectedAmenities = '';
    for (let i = 0; i < amenitiesList.length; i++) {
      selectedAmenities += amenitiesList[i].name;
      if (i !== amenitiesList.length - 1) {
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
  $('button').on('click', function () {
    placesSearch();
  });
  function placesSearch () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ amenities: amenitiesList }),
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
  }
  placesSearch();
});
