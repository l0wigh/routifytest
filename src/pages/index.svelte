<script>
	import { ready } from '@roxi/routify'
	import { page, toast, api } from "../stores.js";
	import { Card, CardText, CardActions, Button, Snackbar } from "svelte-materialify";
	let heroProd = [];
	$page = 0;
	async function getHeroArticles(){
		let req = await fetch($api + "articlesAccueil.php");
		heroProd = await req.json();
		console.log(heroProd);
		$ready();
	}
</script>

<main class="container">
	{#await getHeroArticles()}
		<span>Chargement...</span>
	{:then}
		{#each heroProd as produit}
			<Card hover outlined shaped style="max-width: 300px;" class="cards">
				<div class="pl-4 pr-4 pt-3">
					<span class="text-overline title">{produit.label}</span>
					<br>
					<img src="../images/produits/intersex.png" alt="Chaud'sette Intersex">
					<br>
					<span class="text-h5-mb2 underTitle">{produit.products}</span>
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
	{/await}
</main>

<style>
	.container {
		max-width: 1350px;
		width: 100%;
		margin: 25px auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 50px;
		justify-items: center;
	}
	:global(.cards) {
		/* color: #000000; */
		background: #910d7b26;
		max-width: 300px;
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
	img {
		width: 100%;
		height: 250px;
		object-fit: cover;
	}
</style>
