aos();





// ______funcs________


function aos(){
	AOS.init({
	  // Global settings:
	  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
	  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
	  initClassName: 'aos-init', // class applied after initialization
	  animatedClassName: 'aos-animate', // class applied on animation
	  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
	  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
	  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
	  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


	  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
	  offset: 120, // offset (in px) from the original trigger point
	  delay: 0, // values from 0 to 3000, with step 50ms
	  duration: 400, // values from 0 to 3000, with step 50ms
	  easing: 'ease', // default easing for AOS animations
	  once: false, // whether animation should happen only once - while scrolling down
	  mirror: false, // whether elements should animate out while scrolling past them
	  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

	});

	window.addEventListener('load', AOS.refresh)
}

// road-map


function train_roadmap(){
	const main_block = document.querySelector('.train-roadmap');
	const road = main_block.querySelectorAll('.road');

	road.forEach((item, i) => {
	 let btn = item.querySelector('.roadmap-popup-btn');
	 btn.onclick = ()=>{
		 item.classList.toggle('_active');
	 }
	});

}


train_roadmap();



// Login
function login_game(){
	const login_btn = document.querySelector('#login-btn');
	const main_block = document.querySelector('.game-sec');
	const sec = document.querySelector('.s_game-first');

	login_btn.onclick = ()=>{
		console.log('login');
		login()
			.then(wax=>{
				sec.classList.add('_load');

				// let body = {
				// 	name: 'hpd34.wam',
				// 	collection_name: 'farmingtales'
				// }

				let body = {
					waxName: `${wax[0]}`
				}

				sendRequest('POST', '/api/login', body).then(res=>{
					console.log(res);
				})


		createUnityInstance(document.querySelector("#unity-canvas"), {
			dataUrl: "Build/Pandemonium.data",
			frameworkUrl: "Build/Pandemonium.framework.js",
			codeUrl: "Build/Pandemonium.wasm",
			streamingAssetsUrl: "StreamingAssets",
			companyName: "DefaultCompany",
			productName: "prototype-nft-lun",
			productVersion: "0.1",
			// matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
			// devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
		})
		.then(res=>{
			console.log('______________________s');
			let game_data = `${wax[0]} ${window.location.origin}/`;
			console.log(game_data);
			res.SendMessage( 'DataProvider', 'GetPlayerDataFromSite' , game_data);
		})
		.then(res=>{
			main_block.classList.add('_game');
			sec.classList.remove('_load');
		})
		.catch(err=>{console.log(err); sec.classList.remove('_load')})

	})
}

}

login_game();


const wax = new waxjs.WaxJS({
		rpcEndpoint: 'https://wax.greymass.com'
});
//automatically check for credentials
// autoLogin();

//checks if autologin is available
async function autoLogin() {
		let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
		if (isAutoLoginAvailable) {
				let userAccount = wax.userAccount;
				let pubKeys = wax.pubKeys;

				console.log(pubKeys, userAccount);
				// let str = 'AutoLogin enabled for account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1]
				// document.getElementById('autologin').insertAdjacentHTML('beforeend', str);
		}
		else {
				// document.getElementById('autologin').insertAdjacentHTML('beforeend', 'Not auto-logged in');
		}
}

//normal login. Triggers a popup for non-whitelisted dapps
async function login() {
	try {
			//if autologged in, this simply returns the userAccount w/no popup

			let userAccount = await wax.login();
			let pubKeys = wax.pubKeys;
			console.log(userAccount);
			return [userAccount, pubKeys];

			// let str = 'Account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1]
			// document.getElementById('loginresponse').insertAdjacentHTML('beforeend', str);
	} catch (e) {
			// document.getElementById('loginresponse').append(e.message);
	}

}

async function sign() {
if(!wax.api) {
		console.log('aaaaaa');
		// return document.getElementById('response').append('* Login first *');
}

try {
		const result = await wax.api.transact({
		actions: [{
				account: 'eosio',
				name: 'delegatebw',
				authorization: [{
				actor: wax.userAccount,
				permission: 'active',
				}],
				data: {
				from: wax.userAccount,
				receiver: wax.userAccount,
				stake_net_quantity: '0.00000001 WAX',
				stake_cpu_quantity: '0.00000000 WAX',
				transfer: false,
				memo: 'This is a WaxJS/Cloud Wallet Demo.'
				},
		}]
		}, {
		blocksBehind: 3,
		expireSeconds: 30
		});
		console.log(result);
		// document.getElementById('response').append(JSON.stringify(result, null, 2))
} catch(e) {
	console.log(e);
		// document.getElementById('response').append(e.message);
}
}



function sendRequest(method, url, body = null){
  return new Promise((resolve, reject)=>{
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onload = () =>{
      if(xhr.status >= 400){
        reject(xhr.response);
      }else{
        resolve(xhr.response);
      }
    }

    xhr.onerror = () =>{
      reject(xhr.response);
    }


    xhr.send(JSON.stringify(body));
  })
}
