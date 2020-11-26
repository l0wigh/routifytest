<script>
	import { ready } from '@roxi/routify'
	import { page, api } from "../../stores.js";
	import { TextField, Radio, Select, Button, MaterialApp } from "svelte-materialify"
	import { Card, CardText, CardActions, Snackbar } from "svelte-materialify";
	import { panierFunctions } from "../Functions.svelte";

	$page = 1;

	let filtreRadio = "id desc";
	let allArticles;
	let categories = [];
	let listeCateg;
	let selectedCateg;
	let categID = 0;

	$: for(let categ in categories) {if(categories[categ].value === selectedCateg){categID = categories[categ].id}}

	async function getArticles() {
		let res = await fetch($api + "articles.php?").catch((err) => console.log(err.message));
		allArticles = await res.json();
	}

	async function filtrer() {
		console.log($api + "articles.php?tri=" + filtreRadio + "&categID=" + categID);
		let res = await fetch($api + "articles.php?tri=" + filtreRadio + "&categID=" + categID).catch((err) => console.log(err.message));
		allArticles = await res.json();
		console.log(allArticles);
	}

	async function getCateg() {
		let req = await fetch($api + "envoiLesCategories.php");
		listeCateg = await req.json();
		for(let elem in listeCateg) {
			categories = [...categories, {name: listeCateg[elem].label, value: listeCateg[elem].label, id: listeCateg[elem].id}]
		}
		console.log(categories);
	}

	async function start() {
		await getArticles();
		await getCateg();
		$ready();
	}

</script>

<MaterialApp>
	{#await start()}
		<span>Chargement...</span>
	{:then}
		<div class="filtrage">
			<TextField class="textbox">Rechercher</TextField>
			<spacer></spacer>
			<div class="filtres">
				<Radio bind:group={filtreRadio} value="priceProduct asc" style="grid-area: radioA">Prix croissant</Radio>
				<Radio bind:group={filtreRadio} value="priceProduct desc" style="grid-area: radioB">Prix décroissant</Radio>
				<Radio bind:group={filtreRadio} value="id asc" style="grid-area: radioC">Plus anciens</Radio>
				<Radio bind:group={filtreRadio} value="id desc" style="grid-area: radioD">Plus récent</Radio>
				<Select items={categories} bind:value={selectedCateg} class="selectGrid">Catégories</Select>
				<Button outlined style="grid-area: buttonOne" class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }} on:click={() => filtrer()}>
					Filtrer
				</Button>
				<Button outlined style="grid-area: buttonTwo" class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}
				on:click={() => {getArticles(); filtreRadio = "id desc"; selectedCateg = ""; categID = 0;}}>
					Supprimer les Filtres
				</Button>
			</div>
		</div>
		<div class="container">
			{#each allArticles as produit}
				<Card hover outlined shaped style="max-width: 300px;" class="cards">
					<div class="pl-4 pr-4 pt-3">
						<span class="text-overline title">{produit.products}</span>
						<br>
						<img src="../images/produits/intersex.png" alt="Chaud'sette Intersex">
						<br>
						<span class="text-h5-mb2 underTitle">Intersex</span>
						<br>
					</div>
					<CardText class="cardText">{produit.descriptions}</CardText>
					<CardActions>
						<Button on:click={() => window.location = "/articles/" + produit.id} outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}>
							Voir le produit
						</Button>
						<span style="margin: 0 auto;">{parseInt(produit.rate) / 100 * parseInt(produit.priceProduct) + parseInt(produit.priceProduct)}€</span>
					</CardActions>
				</Card>
			{/each}
		</div>
	{/await}
</MaterialApp>

<style>
	.filtrage {
		margin: 25px auto;
		width: 100%;
		max-width: 1350px;
	}
	.filtres {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 50px);
		grid-template-areas: 
			'radioA radioB select select'
			'radioC radioD buttonOne buttonTwo';
		grid-gap: 10px;
	}
	img {
		width: 100%;
		height: 250px;
		object-fit: cover;
	}
	.container {
		width: 100%;
		max-width: 1350px;
		margin: 10px auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 25px;
		justify-items: center;
	}
	:global(.selectGrid) {
		grid-area: select;
		cursor: pointer;
	}
	spacer {
		margin-bottom: 5px;
	}
	:global(.cards) {
		/* color: #000000; */
		background: #910d7b26;
		max-width: 425px;
	}
	:global(.title) {
		color: #910d7a;
	}
	:global(.underTitle) {
		text-decoration: underline;
	}
	:global(.cardText) {
		color: #f18c03;
	}
	@media only screen and (max-width: 900px) {
		.filtres {
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(4, 50px);
			grid-template-areas:
				"radioA radioB" 
				"radioC radioD"
				"select select"
				"buttonOne buttonTwo";
		}
	}
	@media only screen and (max-width: 380px) {
		:global(Button.s-btn.size-default.buttons.depressed.outlined.s-ripple-container) {
			font-size: 3.5vw;
		}
	}
</style>