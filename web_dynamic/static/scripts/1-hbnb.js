$(document).ready(function () {
  const amenities = [];

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
        return amenity[id] !== amenityId;
      });
    }

    let selectedAmenities = '';
    for (let i = 0; i < amenities.length; i++) {
      selectedAmenities += amenities[i].name;
      if (i !== amenities.length - 1) {
        selectedAmenities += ', ';
      }
      if (i == 1) {
        selectedAmenities += '...';
        break;
      }
    }

    $('div.amenities h4').text(selectedAmenities);
  });
});
