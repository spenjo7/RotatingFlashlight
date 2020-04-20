// global mouse press tracking
let pressedMouseButtons = 0;
let logButtons = (event) =>  {
	pressedMouseButtons = event.buttons;
}

document.addEventListener('mouseup', logButtons);
document.addEventListener('mousedown', logButtons);

// scroll events 

let lastScrollTime = Date.now();

const getAngle = (opp , adj) => {
    return Math.atan(opp/adj) * (180/Math.PI);
}


const addMouseMover = (target, callback, refreshRate = 50) => {

	target.addEventListener('mousemove', (event)=> {

		let now = Date.now();
		let elapsed = (now - lastScrollTime); /* will use later to enforce refresh rate*/
		/* need the actual offset and the descendant offsets */
		let pos = { /* Starts with 0 and can go negative on margins or psudo elements/*/
			x: (event.pageX - target.offsetLeft),
			y: (event.pageY - target.offsetTop),
			sub:{ // if over a child element, this gives the position relative to to the child element
				x: event.offsetX,
				y: event.offsetY
			},
			bounds:{
				X: target.offsetWidth, 
				Y: target.offsetHeight
			}
		}
		pos.left = pos.x; pos.top = pos.y; /* provide both formats incase one is easier to use than the other*/
		pos.centerAngle = Math.atan2(pos.y - (target.offsetWidth/2), pos.x - (target.offsetHeight/2) ) * 180 / Math.PI;
		
		pos.sub.isChild = ( target !== event.target);
		pos.inbounds = ( pos.x > 0 && pos.y > 0); // if on a margin or psudoelement
		pos.inbounds = ( pos.x <= target.offsetWidth &&  pos.y <= target.offsetHeight )? pos.inbounds : false;

			/* Enforce Refresh*/
		if( now - lastScrollTime > refreshRate ){
			lastScrollTime = Date.now(); // set new lastScrollTime
			callback(pos, event);  
		}
	})
	
}