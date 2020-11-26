<script>
	import { ready } from '@roxi/routify'
	import { MaterialApp, Card, CardText, CardActions, Button, Snackbar } from "svelte-materialify";
	import { page, panier, api } from "../../stores.js";

	let product = undefined;
	let prixTTC;
	export let idArticle;
	$page = 1;
	let quantityUser = 1;

	async function getArticle() {
		let res = await fetch($api + "pageSeulArticle.php?id=" + idArticle).catch((err) => console.log(err.message));
		product = await res.json();
		console.log(product)
		prixTTC = product[0].rate / 100 * product[0].priceProduct + parseInt(product[0].priceProduct);
		prixTTC = prixTTC.toFixed(2);
		console.log(prixTTC);
		$ready();
	}

	function addPanier() {
		let inTab = false
		for(let item in $panier) {
			if(idArticle == parseInt($panier[item].id)) {
				$panier[item].quantity = $panier[item].quantity + quantityUser;
				inTab = true;
				break;
			}
		}
		if(!inTab) {
			console.log(product[0]);
			$panier = [...$panier, {id: idArticle, name: product[0].products, label: product[0].label, priceHT: product[0].priceProduct, quantity: quantityUser, tvaRate: product[0].rate}];
		}
		window.localStorage.setItem("panier", JSON.stringify($panier));
		console.log($panier);
	}

</script>

<MaterialApp>
	{#await getArticle()}
		Chargement...
	{:then} 
		<div class="container">
			<Card hover outlined shaped class="cards">
				<div class="pl-4 pr-4 pt-3">
					<span class="text-overline title">{product[0].label}</span>
					<br>
					<img src="../images/produits/intersex.png" alt="Chaud'sette Intersex">
					<br>
					<span class="text-h5-mb2 underTitle">{product[0].products}</span>
					<br>
				</div>
				<CardText class="cardText">{product[0].descriptions}</CardText>
				<CardActions>
					<button class="quantityBtn" on:click={() => {quantityUser++}}><i class="far fa-plus-square"></i></button>
					{quantityUser}
					<button class="quantityBtn" on:click={() => {quantityUser--; if(quantityUser === 0){quantityUser = 1}}}><i class="far fa-minus-square"></i></button>
					<span style="margin: 0 auto;">{(parseInt(product[0].rate) / 100 * parseInt(product[0].priceProduct) + parseInt(product[0].priceProduct)) * quantityUser}€</span>
					<Button on:click={() => addPanier()} outlined class="buttons" ripple={{ color: "#910d7a", opacity: 0.3 }}>
						<i class="fas fa-cart-plus"></i>
					</Button>
				</CardActions>
			</Card>
		</div>
	{/await}
</MaterialApp>

<style>
	.container {
		display: flex;
		max-width: 1000px;
		width: 100%;
		margin: 10px auto;
		text-align: center;
		justify-content: center;
	}
	img {
		width: 100%;
		height: 250px;
		object-fit: cover;
	}
	.quantityBtn {
		margin: 10px;
		font-size: 25px;
		color: #910f7a;
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
</style>