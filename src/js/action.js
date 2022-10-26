/*
	appController : Manage app ui
		-> leaderboard : [x]population and [x]creation
*/
let appController = (function(){
	let app = document.querySelector('#app');
	let leaderboard,loader;

	/*
		Main data object.

		props object{
			blendCount: int
			userState: string
			profile: Object{
				username: string
				avatarURL: string
				likedSongs: int
				numberOfPlaylists: int
			},
			data: List[{
				key: int
				imgURL: string
				username: string
				taste: int
			}]
		}
	*/
	return {
	init(props){
		this.clear_page();

		this.create_header({'userState':props.userState});
		this.create_profile(props.profile);
		this.create_blend({'blendCount':props.blendCount});
		this.create_leaderboard();
		this.populate_leaderboard(props);
		this.hide_loader();
	},
	login_page(){
		this.clear_page();

		this.create_header({});
		this.create_login();
		this.hide_loader();
	},
	/*
		User sign in state for the button

		props: Object{
			userState: string
		}
	*/
	create_header(props){
		let text;
		if(props.userState != undefined){
			text = `
				<header class="flex-center [ m-auto ]">
				<img src="./img/spot_ladder_real.svg" class="header__logo [ mr-auto ]">
				<button id="shareBTN" data-type='icon' class="m-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M176,160a39.7,39.7,0,0,0-28.6,12.1l-46.1-29.6a40.3,40.3,0,0,0,0-29l46.1-29.6A40,40,0,1,0,136,56a41,41,0,0,0,2.7,14.5L92.6,100.1a40,40,0,1,0,0,55.8l46.1,29.6A41,41,0,0,0,136,200a40,40,0,1,0,40-40Z"></path></svg>
				</button>
				<button class="header__butt">
				${props.userState}
				</button>
			</header>
			`;
		}
		else{
			text = `
				<header class="flex-center [ m-auto ]">
				<img src="./img/spot_ladder_real.svg" class="header__logo [ mr-auto ]">
			</header>
			`;
		}
		let ele = this.render({'text':text});
		let signOut_btn = ele.querySelector('.header__butt');
		if(signOut_btn != null){
			signOut_btn.addEventListener('click', (e) => {
				e.preventDefault();
				hydrate.logoutUser();
				this.login_page();
			});
		}

		let shareBTN = ele.querySelector('#shareBTN');
		if(shareBTN != null){
			shareBTN.addEventListener('click', async (e) => {
				e.preventDefault();
				await hydrate.share();
			});
		}

		app.append(ele);
	},
	generate_item(props){
		let rankParaClass = '', paraText = '',rankStar = '';
		if(props.key == 1){ rankStar = 'first'; }
		if(props.key == 2){ rankStar = 'second'; }
		if(props.key < 3){
			rankParaClass = 'leaderboard__item--star';
			paraText = `<svg class="leaderboard__item--star" data-type="${rankStar}" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M239.2,97.4A16.4,16.4,0,0,0,224.6,86l-59.4-4.1-22-55.5A16.4,16.4,0,0,0,128,16h0a16.4,16.4,0,0,0-15.2,10.4L90.4,82.2,31.4,86A16.5,16.5,0,0,0,16.8,97.4,16.8,16.8,0,0,0,22,115.5l45.4,38.4L53.9,207a18.5,18.5,0,0,0,7,19.6,18,18,0,0,0,20.1.6l46.9-29.7h.2l50.5,31.9a16.1,16.1,0,0,0,8.7,2.6,16.5,16.5,0,0,0,15.8-20.8l-14.3-58.1L234,115.5A16.8,16.8,0,0,0,239.2,97.4Z"></path></svg>`;
		} else{
			rankParaClass = 'leaderboard__item--rank [ font-1-4 flex-center ]';
			paraText = props.key +'.';
		}
		let text = `
			<div class="leaderboard__item [ flex-center m-auto ]">
				<p class="${rankParaClass}">${paraText}</p>
				<img src="${props.imgURL}" alt="friend at ${props.key} position" class="leaderboard__item--image">
				<p class="leaderboard__item--username [ font-1-4 mr-auto ]">${props.username}</p>
				<p class="leaderboard__item--percentage [ font-1-4 ]">${props.taste}%</p>
			</div>`;
		
		return this.render({'text':text});
	},
	render(props){
		let element = document.createElement('div');
		element.innerHTML = props.text;
		return element.children[0];
	},
	populate_leaderboard(props){
		props.data.forEach(item =>{
			this.leaderboard.append(this.generate_item(item));
		});
	},
	create_leaderboard(props){
		let text = `
			<section class="leaderboard [ flex-col ]">
				<div class="leaderboard__header [ flex-center m-auto ]">
					<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M240,56v64a8,8,0,0,1-4.9,7.4,8.5,8.5,0,0,1-3.1.6,8.3,8.3,0,0,1-5.7-2.3L200,99.3l-58.3,58.4a8.1,8.1,0,0,1-11.4,0L96,123.3,29.7,189.7A8.3,8.3,0,0,1,24,192a8.5,8.5,0,0,1-5.7-2.3,8.1,8.1,0,0,1,0-11.4l72-72a8.1,8.1,0,0,1,11.4,0L136,140.7,188.7,88,162.3,61.7a8.4,8.4,0,0,1-1.7-8.8A8.1,8.1,0,0,1,168,48h64A8,8,0,0,1,240,56Z"></path></svg>
					<p class=" [ mr-auto font-1-4 ml-1-4 ]">Leader Board:</p>
				</div>
		</section>
		`;
		let ele = this.render({'text':text});
		this.leaderboard = ele;
		app.append(ele);
	},
	create_blend(props){
		let text = `
			<section class="blends [ flex-col ]">
			<div class="blends__toprow [ flex-center ]">
				<svg class="[ svg-p m-x-1 ]" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M212.9,25.7a8,8,0,0,0-6.8-1.5l-128,32A8,8,0,0,0,72,64V174.1A36,36,0,1,0,88,204V110.2l112-28v59.9A36,36,0,1,0,216,172V32A7.8,7.8,0,0,0,212.9,25.7Z"></path></svg>
				<p class="blends__info [ mr-auto font-1-4 ml-1-4 ]">Total blends made: ${props.blendCount}</p>
			</div>
			<div class="blends__bottomrow">
				<button>Invite</button>
			</div>
		</section>
		`;
		let ele = this.render({'text':text});
		app.append(ele);
	},
	/*
		Data for crating the user profile.

		props: Object{
			username: string
			avatarURL: string
			numberOfPlaylists: int
			likedSongs: int
		}
	*/
	create_profile(props){
		let text = `
			<section class="profile [ flex-center ]">
			<div class="profile__div [ flex-center ]">
				<img class="profile__image" src="${props.avatarURL}">
				<div class="profile__username [ flex-center flex-col mr-auto ]">
					<div class="[ flex-center ]">
						<svg class="svg-p" xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104.1,104.1,0,0,0,24.1,132.1c2.1,54.7,47,98.8,101.8,99.9a104,104,0,0,0,91.4-50.8,4,4,0,0,0-4.1-6,52.5,52.5,0,0,1-9.2.8c-18.3,0-28.5-8-33.9-14.7a43.9,43.9,0,0,1-3.4-5A48,48,0,1,1,128,80a47.4,47.4,0,0,1,32,12.3v-4a8.2,8.2,0,0,1,7.5-8.3,8,8,0,0,1,8.5,8v40c0,14.6,4.9,32,28,32s27.6-16.2,28-30.5V128A104.1,104.1,0,0,0,128,24Z"></path><circle cx="128" cy="128" r="32"></circle></svg>
						<p class="profile__username--title [ font-1-4 ]">${props.username}</p>
					</div>
					<p class="profile__info [ mx-2 ]">${props.numberOfPlaylists} Playlists</p>
					<p class="profile__info">${props.likedSongs}~ Songs Heard</p>
				</div>
			</div>
		</section>
		`;
		let ele = this.render({'text':text});
		app.append(ele);
	},
	create_loader(props){
		let text = `
			<div class="loader [ flex-center ]">
			<div class="loader__body">
				<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M168,40.7a96,96,0,1,1-80,0" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
			</div>
		</div>
		`;
		let ele = this.render({'text':text});
		loader = ele;
		app.append(ele);
	},
	hide_loader(){
		loader.style.visibility = 'collapse';
	},
	show_loader(){
		loader.style.visibility = 'visible';
	},
	create_login(){
		let text = `
			<div class="login [ m-auto flex-col ]">
			<img src="./img/only_ladder.svg" class="m-auto">
			<p class="login__headline">Create Spotify blend leaderboard with your friends.</p>
			<div class="login__btn [ flex-col ]">
				<p>Paste your profile link in here:</p>
				<form>
					<input id="logIn--inp" type="url" name="userURL" placeholder="here">
					<label for="rememberMe" class="logIn--check switch flex-center m-auto">
						<p class="mr-auto">Remember my profile</p>
						<input id="rememberMe" type="checkbox" name="rememberMe">
						<span class="slider round"></span>
					</label>
					<button id="logIn" type="submit" class="flex-center m-auto">
						<div class="flex-center m-auto">
							<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm28.6,144.7a8,8,0,0,1-10.7,3.5A39.6,39.6,0,0,0,128,168a39.1,39.1,0,0,0-18,4.3,8.6,8.6,0,0,1-3.6.8,8,8,0,0,1-3.6-15.1,55.3,55.3,0,0,1,25.2-6,56.1,56.1,0,0,1,25.1,5.9A8.1,8.1,0,0,1,156.6,168.7Zm14.8-28.3a7.9,7.9,0,0,1-10.7,3.4,72,72,0,0,0-65.4.1,8.4,8.4,0,0,1-3.7.9,7.9,7.9,0,0,1-7.1-4.4A8,8,0,0,1,88,129.6a87.9,87.9,0,0,1,79.9,0A8,8,0,0,1,171.4,140.4ZM186.2,112a7.9,7.9,0,0,1-10.7,3.4A104.3,104.3,0,0,0,128,104a103.2,103.2,0,0,0-47.6,11.5,7.7,7.7,0,0,1-3.6.9,8,8,0,0,1-3.7-15.1,120.2,120.2,0,0,1,109.7-.1A8,8,0,0,1,186.2,112Z"></path></svg>
							<p class="font-1-2">Add</p>
						</div>
					</button>
				</form>
			</div>
		</div>
		`;
		let ele = this.render({'text':text});
		let form = ele.querySelector('form');
		form.addEventListener('submit', (e)=>{
			e.preventDefault();
			this.show_loader();
			const result = (/\/user\/(\w+)\?/gm).exec(form.elements[0].value);
			if(result != null){
				hydrate.loginUser(result[1],form.elements[1].checked);
			}
			e.target.reset();
		});
		app.append(ele);
	},
	create_message(props){
		let mess = app.querySelector('.message');
		if(mess != null){
			mess.outerHTML = '';
		}
		let text = `
			<div class="message flex-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
				<p class="message__text [ mr-auto ]">
					${props.message}
				</p>
			</div>
		`;
		let ele = this.render({'text':text});
		setTimeout(()=>{
			ele.outerHTML = '';
		}, 3000);
		app.append(ele);
	},
	clear_page(){
		while(app.firstChild){
			app.removeChild(app.firstChild);
		}
		this.create_loader();
	}
}
})();

/*
	{
    	"access_token": "BQDckDnmGIEB6IuxAp9H477xIK5t77vQiVn4I9B1qNsRA5n9dFxcwutOyhA_dGqThuU4IwNwn2tQu0tnZ-CbENZ8DzPuFxySiYBrekcio8IzwNaI1Nc",
	    "token_type": "Bearer",
	    "expires_in": 3600
	}

	userId = nwo0j3ix1j5mbwl0l3anytu29
*/
const spotify = (function(){
	const client_id = '62bb3f339be64b24bc12603fd53fbd2d';
    const client_secret = '4a847bb1511644fea51fd78f61acdfc1';
    const base_url = 'https://api.spotify.com/v1';

    const _getToken = async () =>{
    	const result = await fetch('https://accounts.spotify.com/api/token',{
    		method: 'POST',
    		headers: {
    			'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
    		},
    		body: 'grant_type=client_credentials'
    	});

    	const data = await result.json();
    	return data;
    };

    const _setToken = async () => {
    	if(!_cookieToken()){
    		const data = await _getToken();
    		document.cookie = `token=${data['access_token']}; max-age=${data['expires_in']}`;
    		return true;
    	}
    	return false;
    };

    const _cookieToken = () =>{
    	let token = document.cookie;
    	if(token.length === 0)
    		return  undefined;
    	token = token.substring(6);
    	return token;
    };

    const _getUser = async function(token,userID){
    	const result = await fetch(`${base_url}/users/${userID}` , {
    		headers: { 'Authorization' : 'Bearer ' + token}
    	})

    	const data = await result.json();
    	return data;
    };

    const _getUserPlaylists = async function(token,userID){
    	const result = await fetch(`${base_url}/users/${userID}/playlists` , {
    		headers: { 'Authorization' : 'Bearer ' + token}
    	})

    	const data = await result.json();
    	return data;
    };

    return{
    	getToken(){
    		return _getToken();
    	},
    	setToken(){
    		return _setToken();
    	},
    	cookieToken(){
    		return _cookieToken();
    	},
    	getUser(token,userID){
    		return _getUser(token,userID);
    	},
    	getUserPlaylists(token,userID){
    		return _getUserPlaylists(token,userID);
    	},
    }
}());

/*
let data = {
	'blendCount':3,
	'userState':'leave',
	'profile':{
		'username':'AshishK',
		'avatarURL':'./img/Standard Photo.jpg',
		'likedSongs':500,
		'numberOfPlaylists':12
	},
	'data':[
	{key:1,imgURL:'./img/friend.png',username:'Princess',taste:92},
	{key:2,imgURL:'./img/friend.png',username:'Princess',taste:86},
	{key:3,imgURL:'./img/friend.png',username:'Princess',taste:75},
]};

	user hash : #userID=h8zu46arv6ihi6ocuagg2wblq

*/
const hydrate = (function(spot,app){

	let user = '';

	const _loginUser =(async function(userID,rememberState){
		user = userID;
		await spot.setToken();
		let token = spot.cookieToken();
		let userdata = await spot.getUser(token,userID);
		
		let avatarURL = './img/user-circle-fill.svg';
		if(userdata.images.length > 0){
			avatarURL = userdata.images[0].url;
		}

		let userPlaylists = await spot.getUserPlaylists(token,userID);
		let track_count = 0;
		userPlaylists.items.forEach(item => {
			track_count += item.tracks.total;
		});
		let payload = {
				'blendCount':0,
				'userState':'leave',
				'profile':{
					'username':userdata['display_name'],
					'avatarURL':avatarURL,
					'likedSongs':track_count,
					'numberOfPlaylists':userPlaylists.total,
				},
				'data':[]};
		app.init(payload);

		if(rememberState){
			localStorage.setItem('userID',userID);
		}
	});

	const _logoutUser = () => {
		localStorage.removeItem('userID');
	};

	const _share = async () => {
		const shareData = {
			text: 'Check out my spot ladder profile!',
			url: window.location.host + '/#userID=' + user
		};
		navigator.clipboard.writeText(shareData['text']+' '+shareData['url']).then(() => {
			app.create_message({'message':'copied successfully.'});
			}, () => {
			app.create_message({'message':'error occured.'});
		});
	};

	const _init = () => {
		const hash = window.location.hash;
		if(hash.length > 0){
			_loginUser(hash.substring(hash.indexOf('=')+1),false);
		}
		else if(localStorage.getItem('userID') != null){
			const userID = localStorage.getItem('userID');
			_loginUser(userID,false);
		} else {
			app.login_page();
		}
	};

	return {
		loginUser(userID,rememberState){
			return _loginUser(userID,rememberState);
		},
		logoutUser(){
			return _logoutUser();
		},
		share(){
			return _share();
		},
		init(){
			return _init();
		}
	};
}(spotify,appController));


/* initial logic goes here. */
window.addEventListener('hashchange', (e) => {
	e.preventDefault();
	hydrate.init();
});
hydrate.init();


// ashuzon = localhost:8080/#userID=nwo0j3ix1j5mbwl0l3anytu29
// aastha  = localhost:8080/#userID=h8zu46arv6ihi6ocuagg2wblq
// yash    = localhost:8080/#userID=31jxihudg5sohyltalv2yeauzewi
// akshat  = localhost:8080/#userID=kj90oqx05h1j7ckrp8tsggdit