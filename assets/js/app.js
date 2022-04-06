// Diseño: Patrón módulo
// (() => {
//     'use strict' // Javascript ejecuta el código de manera estricta
// })(); // Función anónima autoinvocada

const myGame = (() => {
    'use strict'

    // Variables
    let deck = [];
    const typeCards = ['C', 'D', 'H', 'S'], letterCards = ['A', 'J', 'Q', 'K'];
    //let playerScore = 0, computerScore = 0;
    let playersPoints = [];

    // HTML Referencias
    const btnHit = document.querySelector('#btnHit'),
          btnStay = document.querySelector('#btnStay'),
          btnNewGame = document.querySelector('#btnNewGame'),
          smallScores = document.querySelectorAll('small'),
          divCards = document.querySelectorAll('.divCards');

    // Función para iniciar el juego
    const startGame = (numPlayers = 2) => {
        deck = createDeck();

        playersPoints = [];

        for (let i = 0; i < numPlayers; i++) {
            playersPoints.push(0);
        }
        
        // Reiniciamos valores a 0
        smallScores.forEach(elem => elem.innerText = 0);
        divCards.forEach(elem => elem.innerHTML = '');

        // Habilitamos botones para jugar
        btnHit.disabled = false;
        btnStay.disabled = false;
    };

    // Función para crear mazo
    const createDeck = () => {
        // Reiniciamos el deck antes de crearlo
        deck = [];

        // Añadimos cartas numéricas
        for(let i = 2; i <= 10; i++){
            for (let typeCard of typeCards) {
                deck.push(i + typeCard);
            }
        }
        // Añadimos cartas con letra
        for(let typeCard of typeCards){
            for(let letterCard of letterCards){
                deck.push(letterCard + typeCard);
            }
        }
        
        // Devuelve el mazo mezclado 
        return _.shuffle(deck);
    }

    // Función sacar carta
    const hitCard = () =>{
        // Comprueba si el deck tiene cartas
        if(deck.length === 0){
            throw 'Deck is empty';
        }

        // Saca la primera carta del mazo
        return deck.shift();
    }

    // Función valor de carta
    const cardValue = (card) => {
        const value = card.substring(0, card.length - 1);
        // Ejercicio: Reducir la expresión de arriba al mínimo.
            return (isNaN(value)) ? 
                    (value === 'A') ? 11 : 10
                    : value * 1;
        // Ejercicio realizado normal.
        // let points = 0;
        // if(isNaN(value)){ // isNan es una función que comprueba si es un número o no.
        //     points = (value === 'A') ? 11 : 10;
        // }else{
        //     points = value * 1; // Multiplicamos por uno para devolver la versión del valor en num.
        // }
    }

    // Función para acumular puntos
    // Turn: 0 = first player, lastItem = computer
    const scorePoints = (card, turn) =>{
        playersPoints[turn] = playersPoints[turn] + cardValue(card);
        smallScores[turn].innerText = playersPoints[turn];
        return playersPoints[turn];
    }

    // Función para crear la carta y mostrarla
    const createCard = (card, turn) =>{
        const imgCard = document.createElement('img');
        imgCard.src = `assets/cards/${card}.png`;
        imgCard.classList.add('card-game');
        divCards[turn].append(imgCard);
    }

    // Función turno de la máquina
    const computerTurn = (minPoints) => {

        let computerScore = 0;

        do{
            // Saca la carta del mazo
            const card = hitCard();

            // Suma los puntos
            computerScore = scorePoints(card, playersPoints.length - 1);

            // Crea y muestra la carta
            createCard(card, playersPoints.length -1);
        }while((minPoints > computerScore) && (minPoints <= 21));

        whoWin();
    }

    // Función que determina el ganador
    const whoWin = () =>{

        const [minPoints, computerScore] = playersPoints;

        setTimeout(() => {
            // Condición de victoria
            if((computerScore >= minPoints) && (computerScore <= 21)){
                alert('Lo siento, has perdido :(');
                console.warn('Lo siento, gana la máquina');
            }else if(minPoints > 21){
                alert('Lo siento, has perdido :(');
                console.warn('Lo siento, gana la máquina');
            }else{
                alert('¡Enhorabuena, has ganado!');
                console.warn('¡Enhorabuena, has ganado!');
            }
            }, 120);
    }

    // Eventos
    btnHit.addEventListener('click', () => {
        // Saca la carta del mazo
        const card = hitCard();
        
        // Crea y muestra la carta
        createCard(card, 0);

        // Suma los puntos
        const playerScore = scorePoints(card, 0);

        // Condición de juego para poder seguir pidiendo cartas
        if(playerScore > 21){
            // Desabilita botones
            btnHit.disabled = true;
            btnStay.disabled = true;

            // Inicia turno de la máquina
            computerTurn(playerScore);
        }else if(playerScore === 21){
            // Desabilita botones
            btnHit.disabled = true;
            btnStay.disabled = true;

            // Inicia turno de la máquina
            computerTurn(playerScore);
        }
    });

    btnStay.addEventListener('click', () =>{
        // Desabilita la posibilidad de volver a pedir carta
        btnHit.disabled = true;

        // Desabilita la posibilidad de volver a darle a stay
        btnStay.disabled = true;

        // Inicia turno de la máquina
        computerTurn(playersPoints[0]);
    });

    btnNewGame.addEventListener('click', () =>{
        // Limpiamos consola
        console.clear();

        // Inicializa el juego
        startGame();
    });

    return {
        newGame: startGame
    };
})();