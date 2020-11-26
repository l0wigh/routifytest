<script>
	import { panier } from ".././stores.js";
	function addPanier() {
		let inTab = false
		// for(let item in $panier) {
		// 	if(idArticle == parseInt($panier[item].id)) {
		// 		$panier[item].quantity++;
		// 		inTab = true;
		// 		break;
		// 	}
		// }
		if(!inTab) {
			// console.log(product[0]);
			$panier = [...$panier, {id: idArticle, name: product[0].products, priceHT: product[0].priceProduct, quantity: 1, tvaRate: product[0].rate}];
		}
		// window.localStorage.setItem("panier", JSON.stringify($panier));
		// console.log(window.localStorage.getItem("panier"));
	}
</script>

<script context="module">
	export function panierFunctions(funcSelect, arg) {
		switch(funcSelect){
			case 1:
				addPanier(arg);
				break;
			case 2:
				break;
			default:
				console.log("Pas les bons arguments")
				break;
		}
	}
</script>
