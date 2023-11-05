$(document).ready(function () {
	const amenities = {};

	// attach an event listener to listen to a change in checkboxes
	$("input[type='checkbox']").change(function () {
		const amenityId = $(this).data('name');
		if ($(this).is(':checked'))
			amenities[amenityId] = true;
		else
			delete amenities[amenityId];

		let selectedAmenities = '';
		for (const amenity in amenities) {
			if (selectedAmenities)
				selectedAmenities += ', ' + amenity;
			else
				selectedAmenites += amenity;
		}

		$('div.amenities h4').text(selectedAmenities);
	});
});
