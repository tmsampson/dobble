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

	// Setup slots
	let slots = [];
	for(let i = 0; i < numSlots; ++i)
	{
		slots.push(0);
	}

	// Calculate permutations
	let running = true;
	while(running)
	{
		for(let variant = 0; variant < numVariants; ++variant)
		{
			slots[numSlots - 1] = variant;

			// print
			slots.forEach(function(entry) { addResult(entry); }); addResult("<br/>");
		}

		running = false;
		for(let i = 1; i < numSlots; ++i)
		{
			if(slots[numSlots - 1 - i] < (numVariants - 1))
			{
				slots[numSlots - 1 - i]++;

				for(let j = numSlots - i; j < numSlots; ++j)
				{
					slots[j] = 0;
				}
				running = true;
				break;
			}
		}
	}
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