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

	import { page, connected, account, linksCompte, api } from "../stores.js";
	import { Button, TextField, MaterialApp } from "svelte-materialify";
	import { Card, CardTitle } from 'svelte-materialify';
	import ModifsCompte from "./ModifsCompte.svelte";

	$page = 3;
	let insName;
	let insFirstName;
	let insAdress;
	let insEmail;
	let insPass;

	let coEmail;
	let coPass;


	async function inscription() {
		let res = await fetch($api + "inscription.php", {
			method: "POST",
			body: new FormData(document.getElementById('form-inscription'))
		}).catch((err) => console.log(err.message));
		//console.log(res.data);
		let err = await res.json();
		if(err.codeErr === 1) {
			console.log("Failed...")
			// toastMess = err.mess;
			// toastBg = "#cf0000";
			// toast = true;
		}
		else{
			console.log("Inscription réussie.")
			// toastMess = "Inscription réussie.";
			// toastBg = "#00cf60";
			// toast = true;
		}
	}

	async function connexion() {
		let res = await fetch($api + "connexion.php", {
			method: "POST",
			body: new FormData(document.getElementById('form-connexion'))
		}).catch((err) => console.log(err.message));
		console.log(res);
		let err = await res.json();
		if(err.codeErr === 1) {
			// toastMess = err.mess;
			// toastBg = "#cf0000";
			// toast = true;
			console.log(err.mess);
		}
		else{
			// // toastMess = "Connexion réussie.";
			// // toastBg = "#00cf60";
			// // toast = true;
			createCookie("cookie", JSON.stringify({
				name: err.name,
				firstName: err.firstName,
				adress: err.adress,
				api: err.api,
				id: err.id
			}), 7);
			$account = JSON.parse(readCookie("cookie"));
			coEmail = "";
			coPass = "";
			$connected = true;
			$linksCompte = $account.name + " " + $account.firstName;
		}
	}

	const passwordRules = [
		(v) => !!v || 'Requis',
		(v) => v.length >= 8
	]
	const emailRules = [
		(v) => !!v || 'Requis',
		(v) => {
		const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return pattern.test(v) || 'Email invalide.';
		},
	];
</script>

<MaterialApp>
	{#if $connected}
		<ModifsCompte/>
	{:else}
		<div class="container">
			<Card tile raised>
				<CardTitle>Inscription</CardTitle>
				<form id="form-inscription" on:submit|preventDefault={() => inscription()}>
					<TextField name="name" bind:value={insName} class="textbox" color="#910d7a">Nom</TextField>
					<TextField name="firstName" bind:value={insFirstName} class="textbox" color="#910d7a">Prénom</TextField>
					<TextField name="adress" bind:value={insAdress} class="textbox" color="#910d7a">Adresse</TextField>
					<TextField name="email" bind:value={insEmail} class="textbox" color="#910d7a" type="email" rules={emailRules}>Email</TextField>
					<TextField name="password" bind:value={insPass} class="textbox" color="#910d7a" type="password" minlength="8">Mot de Passe</TextField>
					<Button type="submit" outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}>
						S'inscrire
					</Button>
				</form>
			</Card>
			<Card tile raised>
				<CardTitle>Connexion</CardTitle>
				<form id="form-connexion" on:submit|preventDefault={() => connexion()}>
					<TextField name="email" bind:value={coEmail} class="textbox" color="#910d7a" rules={emailRules}>Email</TextField>
					<TextField name="password" bind:value={coPass} class="textbox" color="#910d7a" type="password">Mot de Passe</TextField>
					<Button type="submit" outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}>
						Se connecter
					</Button>
				</form>
				<!-- Ajouter la possibilité de reset le mdp -->
			</Card>
		</div>
	{/if}
</MaterialApp>

<style>
	.container {
		width: 100%;
		max-width: 1350px;
		height: 100%;
		margin: 25px auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(650px, 1fr));
		grid-gap: 50px;
	}
</style>