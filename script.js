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
	// small utility: Caesar cipher (reusable for multiple pages)
	function caesarCipher(str,shift){
		return str.replace(/[a-z]/gi,function(c){
			const base=c>='a'&&c<='z'?97:65;
			return String.fromCharCode(((c.charCodeAt(0)-base+shift)%26)+base);
		});
	}

	if(page==='3.html'){
		// mark that user visited 3.html now (store timestamp in minutes-long cookie)
		setCookie('visited-3', now, 60); // keep for 60 minutes

		const texto="Era uma casa muito engraçada não tinha         não tinha nada";
		const shift = Math.floor(Math.random()*25)+1;
		const h1=document.querySelector('h1');
		const cipherDiv=document.getElementById('ciphered-text');
		if(h1) h1.textContent=shift;
		if(cipherDiv) cipherDiv.textContent=caesarCipher(texto,shift);
	}

	// page 4 should be accessible only after ~60 seconds have passed since visiting 3.html
	if(page==='4.html'){
		const visited3 = getCookie('visited-3');
		const content = document.getElementById('secret-content');
		const waitMsg = document.getElementById('wait-message');
		const countdown = document.getElementById('countdown');
		const nowMs = Date.now();
		let allowed = false;
		if(visited3){
			const t = parseInt(visited3,10);
			if(!isNaN(t) && (nowMs - t) >= 60*1000) allowed = true;
		}

		// verification helpers for the input puzzle
		const expectedWords = ['ansiedade','reclinar','pico','largura'].map(function(w){
			return w.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase();
		});
		function normalize(s){
			return String(s||'').trim().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase();
		}

		function updateFormUI(){
			let allGood = true;
			for(let i=0;i<4;i++){
				const input = document.getElementById('input'+(i+1));
				const status = document.getElementById('status'+(i+1));
				if(!input || !status) { allGood = false; continue; }
				const val = normalize(input.value);
				if(val === expectedWords[i]){
					status.textContent = ' ✓';
					status.style.color='green';
				}else{
					status.textContent = '';
					allGood = false;
				}
			}
			const go = document.getElementById('go5');
			if(go) go.style.display = allGood ? 'inline-block' : 'none';
		}

		function bindForm(){
			for(let i=0;i<4;i++){
				const input = document.getElementById('input'+(i+1));
				if(!input) continue;
				input.addEventListener('input', updateFormUI);
			}
			const go = document.getElementById('go5');
			if(go) go.addEventListener('click', function(){
				window.location.href = '5.html';
			});
			// initial check in case of prefilled values
			updateFormUI();
		}
		if(allowed){
			if(waitMsg) waitMsg.style.display='none';
			if(content) content.style.display='block';
			// enable the input puzzle when content is visible
			bindForm();
		}else{
			if(content) content.style.display='none';
			if(waitMsg) waitMsg.style.display='block';
			// show countdown seconds until allowed (approx)
			function updateCountdown(){
				const visited = getCookie('visited-3');
				if(!visited) return;
				const then = parseInt(visited,10);
				const diff = Math.max(0, 60 - Math.floor((Date.now() - then)/1000));
				if(countdown) countdown.textContent = diff.toString();
				if(diff<=0){
					location.reload();
				}
			}
			updateCountdown();
			setInterval(updateCountdown,1000);
		}
	}
});
