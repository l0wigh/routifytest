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

	import { Card, CardTitle, TextField, Button, Snackbar, MaterialApp } from 'svelte-materialify';
	import { onMount } from 'svelte';
	import { account, connected, linksCompte, api } from '../stores.js';

	let button = false;
	let toast = false;
	let toastBg = "#910d7a";
	let toastMess;
	let infos = JSON.parse(readCookie("cookie"));
	let newPassOne;
	let newPassTwo;
	let oldPass;
	let supprCompte;
	let passSuppr = "";

	onMount(() => {
		if(infos == null) {
			window.location = "/";
		}
		console.log($account);
	});

	async function setInfos() {
		let res = await fetch($api + "modifCompte.php?id="+ infos.id + "&api=" + infos.api + "&firstName=" + infos.firstName + "&name=" + infos.name + "&adress=" + encodeURI(infos.adress)).catch((err) => console.log(err));
		let err = await res.json();
		console.log(err);
		toastMess = err.mess;
		// toastBg = "#00bf60";
		toast = true;
		eraseCookie("cookie");
		createCookie("cookie", JSON.stringify({
			name: infos.name,
			firstName: infos.firstName,
			adress: infos.adress,
			api: infos.api,
			id: infos.id
		}), 7)
		$account = JSON.parse(readCookie("cookie"));
		$linksCompte = $account.name + " " + $account.firstName;
	}

	async function setPass() {
		console.log($api + "changementPassword.php?api=" + infos.api + "&id=" + infos.id + "&oldPass=" + oldPass + "&newPass=" + newPassOne);
		let res = await fetch($api + "changementPassword.php?api=" + infos.api + "&id=" + infos.id + "&oldPass=" + oldPass + "&newPass=" + newPassOne).catch((err) => console.log(err));
		let err = await res.json();
		console.log(err);
		if(err.mess === "Ok mdp changer") {
			toastMess = "Changement réussi";
			// toastBg = "#cf0000";
			toast = true;
		}
		else {
			toastMess = "Erreur de changement";
			// toastBg = "#00cf60";
			toast = true;
		}
	}

	async function suppression() {
		let res = await fetch($api + "suppressionArticle.php?api=" + infos.api + "&id=" + infos.id + "&password=" + passSuppr);
		let err = await res.json();
		if(err.mess === "Supprimer.") {
			eraseCookie("cookie");
			toastMess = err.mess;
			// toastBg = "#00cf60";
			toast = true;
			$connected = false;
			window.location = "/";
		}
		else {
			toastMess = "La suppression n'a pas aboutie.";
			// toastBg = "#cf0000";
			toast = true;
		}
	}

	function deconnexion() {
		eraseCookie("cookie");
		$connected = false;
		$linksCompte = "Compte";
		$account = {};
	}

	$: {
		if(newPassOne === newPassTwo && newPassOne !== "" && oldPass !== "") {
			button = true
		}
		else {
			button = false
		}
	}

</script>

<MaterialApp>
	<main class="container">
		<Card tile raised>
			<CardTitle>Informations générales</CardTitle>
			<form id="form-modification" on:submit|preventDefault={() => setInfos()}>
				<TextField name="name" bind:value={infos.name} class="textbox" color="#910d7a">Nom</TextField>
				<TextField name="firstName" bind:value={infos.firstName} class="textbox" color="#910d7a">Prénom</TextField>
				<TextField name="adress" bind:value={infos.adress} class="textbox" color="#910d7a">Adresse</TextField>
				<Button type="submit" outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}>
					Changer les informations
				</Button>
			</form>
		</Card>
		<br>
		<Card tile raised>
			<CardTitle>Changement de mot de passe</CardTitle>
			<form id="form-password" on:submit|preventDefault={() => {console.log("breakpoint"); setPass()}}>
				<TextField name="password" bind:value={oldPass} class="textbox" color="#910d7a" type="password">Ancien mot de passe</TextField>
				<TextField name="password" bind:value={newPassOne} class="textbox" color="#910d7a" type="password">Nouveau mot de passe</TextField>
				<TextField name="password" bind:value={newPassTwo} class="textbox" color="#910d7a" type="password">Retapez le nouveau mot de passe</TextField>
				{#if button === true}
					<Button type="submit" outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}>
						Changer le mot de passe
					</Button>
				{:else}
					<Button disabled type="submit" outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}>
						Changer le mot de passe
					</Button>
				{/if}
			</form>
		</Card>
		<br>
		<Button outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }} on:click={() => deconnexion()}>
			Me déconnecter
		</Button>
		<Snackbar style="font-size: 20px; background: {toastBg}" class="flex-column" bind:active={toast} bottom center timeout={3000}>
			{toastMess}
		</Snackbar>	
		<!-- <Button on:click={() => supprCompte = true} raised={true} color="primary" class="buttonsErr" title="Supprimer le compte" style="width: 150px;"><i class="fas fa-times"></i></Button> -->
		<!-- <Snackbar bind:visible={toast} bg={toastBg} bottom={true}>
			{toastMess}
			<span slot="action">
				<Button color="#fff" on:click={() => toast = false}><i class="fas fa-times"></i></Button>
			</span>
		</Snackbar> -->

		<!-- <Dialog style="--bg-panel: #262626;" width="500" modal={true} bind:visible={supprCompte}>
			<div slot="title">Suppression de compte</div>
			<p class="textSuppr">
				Êtes vous sûr de vouloir supprimer votre compte ?
				<br>
				Si oui, alors entrez votre mot de passe et cliquez sur "supprimer"
			</p>
			<Textfield
				name="passSuppr"
				class="textfield"	
				type="password"
				autocomplete="off"
				label="Votre mot de passe actuel"
				required
				min-lenght="6"
				bind:value={passSuppr}
			/>
			<Button on:click={() => suppression()} raised={true} color="primary" class="buttonsErr" title="Supprimer le compte" style="width: 150px;"><i class="fas fa-times"></i></Button>
		</Dialog> -->
	</main>
</MaterialApp>

<style>
	.container {
		width: 100%;
		max-width: 700px;
		margin: 10px auto;
	}
	/* :global(.buttonsErr) {
		--primary: #bf0000;
	}
	:global(.modalSuppr) {
		--bg-panel: #303030;
	} */
</style>