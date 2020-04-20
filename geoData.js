// strictly deals with checking, testing, and adjusting size/placement of html elements

const getGeoData = ( element ) => {
	// hard fail if element is missing
	return {
			width: element.offsetWidth,
			height: element.offsetHeight,
			left: element.offsetLeft,
			top: element.offsetTop,
		};
}

const newGeoData = ( oldData = {}, newData = {} ) => { // generally will only receive top and/or left unless resizing
		// always add values (add negative to subtract);
		// can leave both blank to get all zeros as a default
		// this is strictly a way of adding or subtracting values; limit controls will be handled later as they will likely reuse this 
	let out = {};
	['width','height','left','top']
		.forEach( dim => {
			out[dim] = oldData[dim]? oldData[dim] : 0;
			out[dim] = newData[dim]? out[dim] + newData[dim] : out[dim];
		});
	return out;
}

const validateOuterLimits = ( element, proposed ) => { // based on parent
	// intentional hard fail if either arguments are missing
		/// proposed needs existing values which are not going to be changed
	let out = {};
	let parent = getGeoData(element.parentElement);
	
	// width and height are easy: non negative / less than parent
	['width','height']
		.forEach( dim => {
			out[dim] = proposed[dim] >= 0? // not negative ?
				proposed[dim] <= parent[dim]? // bigger than parent ? 
					proposed[dim] : parent[dim]  // fine : compress to max
					: 0; // min 0
		})
	
	// left and top reqire calculated limits based on other values
		// it does seem like their 0 point is their parent's left/top start point (even in absolute positioning)
	let limits = {}; // might include in output for diagnostic and 'closeness detection' 
	[ ['left','width'],['top','height'] ] // need to use multiple dimensions in calculations
		.forEach( dim => {
			limits[ dim[0] ] = parent[ dim[1] ] - out[ dim[1] ]; // difference in size between the two
			out[ dim[0] ] = proposed[ dim[0] ] >= 0? // not less than 0?
				proposed[ dim[0] ] <= limits[ dim[0] ]? // not greater than limits
					proposed[ dim[0] ] : limits[ dim[0] ] // fine : limit-max : limit-min 
						: 0; // limit-min 0
	})	
	
	return {...out,parent,proposed,limits};
}

const setGeoData = ( element, newData = newGeoData(), unit = 'px' ) => {	// this just applies the pre-calculated values and adds 'px' to the end
		// Intentional hard fail if element is missing
		// If no newData; place at 0,0 // use for inital placements? // css min and max vals override 
	['width','height','left','top'] 
		.forEach( dim => {
		element.style[dim] = `${newData[dim]}${unit}`;
	});
}

const moveObj = (target, proposed ) => {
	//hard fail if target is missing
		/// hard fail on proposed missing; can already 0 out with 'setGeoData()'
	let data = getGeoData(target); // start with current
		data = newGeoData( data, proposed ); // tentitively add proposed
		data = validateOuterLimits(target, data); // constrain to limits
	setGeoData(target, data); // apply constrained values
}
