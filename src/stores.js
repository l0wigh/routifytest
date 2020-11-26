import { writable } from "svelte/store";
import { readable } from "svelte/store";

export const page = writable();
export const panier = writable([]);
export const toast = writable(false);
export const connected = writable(false);
export const account = writable(false);
export const linksCompte = writable("Compte")
export const api = readable("https://ozipek.fr/thomas/");