// Récupération des éléments HTML nécessaires
// Getting required HTML elements
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

let isError = false; // Indique si une erreur est survenue / Indicates if an input error occurred

// Nettoie la chaîne en supprimant les +, - et les espaces
// Cleans the input string by removing +, - and whitespace
function cleanInputString(str) {
	const regex = /[+-\s]/g;
	return str.replace(regex, "");
}

// Vérifie si la chaîne contient une notation scientifique (ex: 1e3)
// Checks if the string contains scientific notation (e.g. 1e3)
function isInvalidInput(str) {
	const regex = /\d+e\d+/i;
	return str.match(regex);
}

// Ajoute dynamiquement une nouvelle entrée (Nom + Calories) à la catégorie sélectionnée
// Dynamically adds a new entry (Name + Calories) to the selected category
function addEntry() {
	// Sélectionne le conteneur d'inputs pour la catégorie choisie
	// Selects the input container of the selected category
	const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);

	// Détermine le numéro de l'entrée à ajouter
	// Determines the entry number for labeling and IDs
	const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

	// Génére le HTML de la nouvelle entrée
	// Generates the HTML string for the new entry
	const HTMLString = `
<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
<input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"/>
<label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
<input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"/>
`;

	// Insère le HTML dans le conteneur
	// Inserts the HTML into the container
	targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// Gère le calcul des calories lorsque le formulaire est soumis
// Handles calorie calculation when the form is submitted
function calculeCalories(e) {
	e.preventDefault(); // Empêche le rechargement de la page / Prevents page reload
	isError = false;    // Réinitialise le flag d'erreur / Reset error flag

	// Sélection de tous les inputs numériques par catégorie
	// Selects all number inputs per category
	const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
	const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
	const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
	const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
	const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

	// Calcul des calories par catégorie
	// Calculate calories per category
	const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
	const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
	const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
	const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
	const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
	const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

	// Si une erreur est survenue, arrêter l'exécution
	// If an input error occurred, stop execution
	if (isError) {
		return;
	}

	// Total des calories consommées
	// Total consumed calories
	const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;

	// Calcul des calories restantes
	// Calculate remaining calories
	const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

	// Détermine s'il y a un excédent ou un déficit
	// Determines if it's a surplus or deficit
	const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

	// Affiche les résultats
	// Display the results
	output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
<hr>
<p>${budgetCalories} Calories Budgeted</p>
<p>${consumedCalories} Calories Consumed</p>
<p>${exerciseCalories} Calories Burned</p>
`;
	output.classList.remove("hide"); // Affiche le bloc résultat / Show the output block
}

// Calcule la somme des calories d'une liste d'inputs
// Calculates the total calories from a list of inputs
function getCaloriesFromInputs(list) {
	let calories = 0;
	for (const item of list) {
		const currVal = cleanInputString(item.value); // Nettoie l'entrée / Clean input
		const invalidInputMatch = isInvalidInput(currVal); // Vérifie la validité / Check validity

		if (invalidInputMatch) {
			alert(`Invalid Input: ${invalidInputMatch[0]}`); // Affiche une alerte / Show an alert
			isError = true;
			return null;
		}
		calories += Number(currVal); // Convertit et ajoute / Convert and add
	}
	return calories;
}

// Réinitialise le formulaire
// Resets the entire form
function clearForm() {
	const inputContainers = Array.from(document.querySelectorAll('.input-container'));

	for (const container of inputContainers) {
		container.innerHTML = ""; // Vide le HTML de chaque conteneur / Clears each container
	}

	budgetNumberInput.value = ""; // Réinitialise le budget / Reset the budget input
	output.innerText = "";        // Vide la sortie / Clear output display
	output.classList.add('hide'); // Cache le résultat / Hide output block
}

// Attache les événements aux boutons et au formulaire
// Attach events to buttons and form
clearButton.addEventListener('click', clearForm);
addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculeCalories);