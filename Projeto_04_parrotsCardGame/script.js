

const cartas = document.querySelectorAll("");

const numCartas = prompt("Quantas Cartas?");
while ( numCartas%2 !== 0 || numCartas < 2 || numCartas > 14 ){
    numCartas = prompt ("Número inválido. Insira num par entre 2 e 14.")
}
const cartasEscolhidas = [];
let i = 0;
let retirar =  6 - numCartas/2;
while ( i <= retirar){
    cartas[i].classList.add("hide");
    cartas[i+7].classList.add("hide");
    i++;    
}



 // cartas = 10
 // preciso retirar = 4 cartas , i até 1;
 // retirar = 6 - 5 = 1;
 // 