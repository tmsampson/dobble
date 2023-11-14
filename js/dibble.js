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

	// Setup results
	let results = [];

	// Setup permutation
	let permutation = [];
	for(let i = 0; i < numSlots; ++i)
	{
		permutation.push(0);
	}

	// Calculate permutations
	let running = true;
	while(running)
	{
		for(let variant = 0; variant < numVariants; ++variant)
		{
			permutation[numSlots - 1] = variant;
			results.push(permutation.slice());
		}

		running = false;
		for(let i = 1; i < numSlots; ++i)
		{
			let nextSlotIndex = numSlots - i - 1;
			if(permutation[nextSlotIndex] < (numVariants - 1))
			{
				permutation[nextSlotIndex]++;

				for(let j = numSlots - i; j < numSlots; ++j)
				{
					permutation[j] = 0;
				}
				running = true;
				break;
			}
		}
	}

	// Print results
	results.forEach(function(permutation)
	{
		permutation.forEach(function(entry) { addResult(alphabet[entry]); });
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