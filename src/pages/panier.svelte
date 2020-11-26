<script>
    import { page, panier } from "../stores.js";
	import { Card, CardText, CardActions, Button, Snackbar, MaterialApp } from "svelte-materialify";
	$page = 2;
	console.log($panier);
	let totalPrice;
	$: {
		totalPrice = 0;
		for(let elem in $panier) {
			totalPrice = totalPrice + (parseInt($panier[elem].tvaRate) / 100 * parseInt($panier[elem].priceHT) + parseInt($panier[elem].priceHT))*$panier[elem].quantity;
		}
	}
	function delOne(idArticle) {
		let index = 0;
		for(let item in $panier) {
			if(idArticle == parseInt($panier[item].id)) {
				$panier[item].quantity--;
				if($panier[item].quantity === 0){
					$panier.splice(index, 1);
					$panier = $panier;
				}
				break;
			}
			index++;
		}
		window.localStorage.setItem("panier", JSON.stringify($panier));
	}
	function savePanier() {
		window.localStorage.setItem("panier", JSON.stringify($panier));
	}
</script>

<MaterialApp>
	<div class="container">
		{#each $panier as produit, id}
			<Card hover outlined shaped style="max-width: 300px;" class="cards">
				<div class="pl-4 pr-4 pt-3">
					<span class="text-overline title">{produit.label}</span>
					<br>
					<img src="../images/produits/intersex.png" alt="Chaud'sette Intersex">
					<br>
					<span class="text-h5-mb2 underTitle">{produit.name}</span>
					<br>
				</div>
				<!-- <CardText class="cardText">{produit.description}</CardText> -->
				<CardActions>
					<button class="quantityBtn" on:click={() => {$panier[id].quantity++; savePanier()}}><i class="far fa-plus-square"></i></button>
					{produit.quantity}
					<button class="quantityBtn" on:click={() => {$panier[id].quantity--; if($panier[id].quantity === 0){$panier.splice(id, 1); $panier = $panier}; savePanier()}}><i class="far fa-minus-square"></i></button>
					<span style="margin: 0 auto;">{parseInt(produit.tvaRate) / 100 * parseInt(produit.priceHT) + parseInt(produit.priceHT)}€</span>
					<button class="quantityBtn" on:click={() => {$panier.splice(id, 1); $panier = $panier; savePanier()}}><i class="fas fa-times"></i></button>
				</CardActions>
			</Card>
		{/each}
	</div>
	<div>
		{#if totalPrice > 0}
			Prix total (sans livraison): {totalPrice}€
		{:else}
			Votre panier est vide
		{/if}
	</div>
</MaterialApp>

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
</style>