function setCookie(name, value, minutes) {
	const d = new Date();
	d.setTime(d.getTime() + minutes*60*1000);
	document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
	const cname = name + "=";
	const ca = decodeURIComponent(document.cookie).split(';');
	for(let i=0;i<ca.length;i++){
		let c=ca[i];
		while(c.charAt(0)===' ') c=c.substring(1);
		if(c.indexOf(cname)===0) return c.substring(cname.length,c.length);
	}
	return "";
}

window.addEventListener('DOMContentLoaded',function(){
	const now = Date.now();
	const lastAccess = getCookie('last-access');
	const navbar = document.getElementById('about-navbar');
	if(lastAccess){
		const last = parseInt(lastAccess,10);
		if(!isNaN(last)&&(now-last)>2*60*1000) if(navbar) navbar.style.display='block';
	}
	setCookie('last-access',now,60*24);
	
	const page = window.location.pathname.split('/').pop();
	if(page==='3.html'){
		function caesarCipher(str,shift){
			return str.replace(/[a-z]/gi,function(c){
				const base=c>='a'&&c<='z'?97:65;
				return String.fromCharCode(((c.charCodeAt(0)-base+shift)%26)+base);
			});
		}
	
		const lorem="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet dictum, massa erat ultricies enim, nec dictum ex enim eu sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.";
		const shift = Math.floor(Math.random()*25)+1;
		const h1=document.querySelector('h1');
		const cipherDiv=document.getElementById('ciphered-text');
		if(h1) h1.textContent=shift;
		if(cipherDiv) cipherDiv.textContent=caesarCipher(lorem,shift);
		document.title=shift;
	}
});
