const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];

function dibble()
{
	// Clear previous results
	clearResults();

	// Grab values
	let numSlots = document.getElementById("num-slots").value;
	let numVariants = document.getElementById("num-variants").value;

	// Ensure we have enough variants to fill the slots
	if(numVariants < numSlots)
	{
		addResult("Not enough variants to fill all slots.");
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
			let permutationAlphabetic = currentPermutation.map((slotValue) => alphabet[slotValue]);
			let permutationString = permutationAlphabetic.sort().join();

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
	permutations.forEach(function(permutation)
	{
		addResult(permutation);
		addResult("<br/>");
	});
}

function onInputsChanged()
{
	document.getElementById("num-permutations").value = 100;
}

function clearResults()
{
	document.getElementById("results").innerHTML = "";
}

function addResult(result)
{
	document.getElementById("results").innerHTML += result;
}

// Perform initial update
document.addEventListener("DOMContentLoaded", function()
{
	onInputsChanged();
});