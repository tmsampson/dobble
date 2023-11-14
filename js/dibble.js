const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];

function dibble()
{
	// Grab values
	const numSlots = document.getElementById("num-slots").value;
	const numVariants = document.getElementById("num-variants").value;

	// Ensure we have enough variants to fill the slots
	let permutationsOutputText = document.getElementById("permutations-output-text");
	permutationsOutputText.innerHTML = "";
	if(numVariants < numSlots)
	{
		permutationsOutputText.innerHTML = "Not enough variants to fill all slots.";
		return false;
	}

	// Setup permutations
	let permutations = [];
	let currentPermutation = [];
	for(let i = 0; i < numSlots; ++i)
	{
		currentPermutation.push(0);
	}

	// Calculate permutations
	let running = true;
	while(running)
	{
		// Try the last slot index with each variant
		for(let variant = 0; variant < numVariants; ++variant)
		{
			currentPermutation[numSlots - 1] = variant;

			// Skip if this permutations contains the same value in multiple slots
			const hasDuplicateSlots = (currentPermutation.length !== new Set(currentPermutation).size);
			if(hasDuplicateSlots)
			{
				continue;
			}

			// Convert to alphabet (1,2,3 => A,B,C), and conver to sorted string
			const permutationAlphabetic = currentPermutation.map((slotValue) => alphabet[slotValue]);
			const permutationString = permutationAlphabetic.sort().join();

			// Skip if this permutation has already been stored
			if(permutations.includes(permutationString))
			{
				continue;
			}

			// Store valid permutation
			permutations.push(permutationString);
		}

		running = false;
		for(let nextSlotIndex = numSlots - 1; nextSlotIndex >= 0; --nextSlotIndex)
		{
			if(currentPermutation[nextSlotIndex] < (numVariants - 1))
			{
				currentPermutation[nextSlotIndex]++;
				for(let previousSlotIndex = nextSlotIndex + 1; previousSlotIndex < numSlots; ++previousSlotIndex)
				{
					currentPermutation[previousSlotIndex] = 0;
				}
				running = true;
				break;
			}
		}
	}

	// Print results
	let permutationsOutputList = document.getElementById("permutations-output-list");
	permutationsOutputText.innerHTML += "This configuration generates <b>" + permutations.length + "</b> unique card combinations, as listed below:";
	permutationsOutputList.innerHTML = "";
	const numPermutationDisplayColumns = 7;
	for(let outputIndex = 0; outputIndex < permutations.length; ++outputIndex)
	{
		const permutation = permutations[outputIndex];
		permutationsOutputList.innerHTML += permutation;
		permutationsOutputList.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		if((outputIndex + 1) % numPermutationDisplayColumns == 0)
		{
			permutationsOutputList.innerHTML += "<br/>";
		}
	}
	let permutationsOutputFooter = document.getElementById("permutations-output-footer");
	permutationsOutputFooter.innerHTML = "ℹ: The number of possible combinations can be calculaed as: <b>NumVariants! / (NumVariants - NumSlots)! * NumSlots!</b>";
}

function onInputsChanged()
{
	
}

// Perform initial update
document.addEventListener("DOMContentLoaded", function()
{
	onInputsChanged();
});