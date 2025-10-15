// script.js
// Save a 'last-access' cookie and show navbar if >2min since last visit

function setCookie(name, value, minutes) {
	const d = new Date();
	d.setTime(d.getTime() + (minutes*60*1000));
	const expires = "expires=" + d.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
	const cname = name + "=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1);
		if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
	}
	return "";
}

window.addEventListener('DOMContentLoaded', function() {
	const now = Date.now();
	const lastAccess = getCookie('last-access');
	const navbar = document.getElementById('about-navbar');
	if (lastAccess) {
		const last = parseInt(lastAccess, 10);
		if (!isNaN(last) && (now - last) > 2*60*1000) {
			// More than 2 minutes since last access, and not first time
			if (navbar) navbar.style.display = 'block';
		}
	}
	setCookie('last-access', now, 60*24); // 1 day expiry

});
