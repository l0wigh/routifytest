<script>
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
	import { Tabs, Tab } from "svelte-materialify";
	import { page, linksCompte, account, connected, panier } from '../stores.js';
	import { onMount } from "svelte";
	let links = [
		"/",
		"/articles",
		"/panier",
		"/compte"
	]

	onMount(() => {
		if(document.cookie !== "") {
			$connected = true;
			$account = JSON.parse(readCookie("cookie"))
			console.log($account.name + " " + $account.firstName);
			$linksCompte = $account.name + " " + $account.firstName;
		}
		else {
			$connected = false;
			$account = {};
			$linksCompte = "Compte";
		}
		if(JSON.parse(window.localStorage.getItem("panier")) !== null) {
			for(let item in JSON.parse(window.localStorage.getItem("panier"))) {
				$panier = [...$panier, JSON.parse(window.localStorage.getItem("panier"))[item]];
			}
		}
	})
</script>

<div class="banniere">
	<span>Jomelle Yarns</span>
</div>
<Tabs grow value={$page} class="test-couleur">
	<div slot="tabs">
		<Tab><a href="/">Accueil</a></Tab>
		<Tab><a href="/articles">Articles</a></Tab>
		<Tab><a href="/panier">Panier</a></Tab>
		<Tab><a href="/compte">{$linksCompte}</a></Tab>
	</div>
</Tabs>

<slot/>

<style>
	@font-face {
		font-family: "banniere";
		src: url(../fonts/font.ttf) format("truetype");
	}
    :global(body) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
	:global(body::-webkit-scrollbar) {
		width: 5px;
	}
	:global(body::-webkit-scrollbar-thumb) {
		background: rgb(145, 13, 122);
		border-radius: 25px;
	}
	.banniere {
		background-image: url("../images/banniere2.png");
		background-size: 500px auto;
		background-repeat: repeat-x;
		width: 100%;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.banniere > span {
		font-size: 40px;
		font-family: banniere;
		color: rgb(145, 13, 122);
		background: rgba(255, 255, 255, 0.575);
		width: 100%;
		height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 5px;
	}
	:global(.test-couleur) {
		color:rgb(145, 13, 122);
		background:white;
		border: none;
	}
	a, a:visited, a:hover {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		color:rgb(145, 13, 122);
		text-decoration: none;
	}
	:global(.textbox) {
		margin-bottom: 10px;
		color:rgb(145, 13, 122);
	}
	:global(.buttons) {
		color: #910d7a;
	}
	:global(.s-card) {
		padding: 15px;
	}
</style>