// https://math.stackexchange.com/questions/36798/what-is-the-math-behind-the-game-spot-it
const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];

function tryIt(ipc, il)
{
	document.getElementById("num-slots").value = ipc;
	document.getElementById("num-variants").value = il;
	dobble();
}

function dobble()
{
	// Grab values
	const numSlots = parseInt(document.getElementById("num-slots").value);
	const numVariants = parseInt(document.getElementById("num-variants").value);

	// Ensure we have enough variants to fill the slots
	let combinationsOutputText = document.getElementById("combinations-output-text");
	combinationsOutputText.innerHTML = "";
	if(numVariants < numSlots)
	{
		combinationsOutputText.innerHTML = "Not enough variants to fill all slots.";
		return false;
	}

	// Setup combinations
	let combinations = [];
	let currentcombination = [];
	for(let i = 0; i < numSlots; ++i)
	{
		currentcombination.push(0);
	}

	// Calculate combinations
	let running = true;
	while(running)
	{
		// Try the last slot index with each variant
		for(let variant = 0; variant < numVariants; ++variant)
		{
			currentcombination[numSlots - 1] = variant;

			// Skip if this combinations contains the same value in multiple slots
			const hasDuplicateSlots = (currentcombination.length !== new Set(currentcombination).size);
			if(hasDuplicateSlots)
			{
				continue;
			}

			// Convert to alphabet (1,2,3 => A,B,C), and conver to sorted string
			const combinationAlphabetic = currentcombination.map((slotValue) => alphabet[slotValue]);
			const combinationstring = combinationAlphabetic.sort().join();

			// Skip if this combination has already been stored
			if(combinations.includes(combinationstring))
			{
				continue;
			}

			// Store valid combination
			combinations.push(combinationstring);
		}

		running = false;
		for(let nextSlotIndex = numSlots - 1; nextSlotIndex >= 0; --nextSlotIndex)
		{
			if(currentcombination[nextSlotIndex] < (numVariants - 1))
			{
				currentcombination[nextSlotIndex]++;
				for(let previousSlotIndex = nextSlotIndex + 1; previousSlotIndex < numSlots; ++previousSlotIndex)
				{
					currentcombination[previousSlotIndex] = 0;
				}
				running = true;
				break;
			}
		}
	}

	// Print combinations
	let combinationsOutputList = document.getElementById("combinations-output-list");
	combinationsOutputText.innerHTML += "This configuration generates <b>" + combinations.length + "</b> unique card combinations, as listed below:";
	combinationsOutputList.innerHTML = "";
	const numcombinationDisplayColumns = 7;
	for(let outputIndex = 0; outputIndex < combinations.length; ++outputIndex)
	{
		const combination = combinations[outputIndex];
		combinationsOutputList.innerHTML += combination;
		combinationsOutputList.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		if((outputIndex + 1) % numcombinationDisplayColumns == 0)
		{
			combinationsOutputList.innerHTML += "<br/>";
		}
	}
	let combinationsOutputFooter = document.getElementById("combinations-output-footer");
	combinationsOutputFooter.innerHTML = "ℹ The number of unique card combinations can be calculaed as: <b>NumVariants! / (NumVariants - NumSlots)! * NumSlots!</b>";

	// Print intersections
	let intersectionsTable = document.getElementById("intersections-output-table");
	let tableHtml = "";
	for(let rowIndex = 0; rowIndex <= combinations.length; ++rowIndex)
	{
		tableHtml += "<tr>";
		const rowCombination = combinations[rowIndex - 1];
		for(let columnIndex = 0; columnIndex <= combinations.length; ++columnIndex)
		{
			if(rowIndex == 0 && columnIndex == 0)
			{
				tableHtml += "<th></th>";
			}
			else
			{
				const colCombination = combinations[columnIndex - 1];
				if(rowIndex == 0)
				{
					tableHtml += "<th>" + colCombination + "</th>";
				}
				else if(columnIndex == 0)
				{
					tableHtml += "<td><b>" + rowCombination + "</b></td>";
				}
				else
				{
					// Actual value
					if(rowCombination == colCombination)
					{
						tableHtml += "<td class='intersection-ignore'>X</td>";
					}
					else
					{
						const rowCombinationSplit = new Set(rowCombination.split(","));
						const colCombinationSplit = new Set(colCombination.split(","));
						const intersection = new Set([...rowCombinationSplit].filter(x => colCombinationSplit.has(x)));
						const cssClass = (intersection.size > 0)? "intersection-valid" : "intersection-none";
						tableHtml += "<td class='" + cssClass + "'>" + intersection.size + "</td>";
					}
				}
			}
		}
		tableHtml += "</tr>";
	}
	tableHtml += "</tr>";
	intersectionsTable.innerHTML = tableHtml;
}

function pyMod(n, m)
{
	return (n < 0)? m + n : (((n % m) + m) % m);
}

function dobble2()
{
let p = 7;

let cards = Array.from({ length: p ** 2 + p + 1 }, () => []);

    cards[0].push(0);

    for (let i = 0; i <= p; i++) {
        for (let j = 0; j < p; j++) {
			if((1 + i * p + j) == 9)
			{
				//alert("here");
			}
            cards[1 + i * p + j].push(i);
			if(i == 9)
			{
				//alert("here");
			}
            cards[i].push(1 + i * p + j);
        }
    }

    for (let i = 0; i < p; i++) {
        for (let j = 0; j < p; j++) {
            for (let k = 0; k < p; k++) {
				if((1 + p + i * p + k) == 9)
				{
					//alert("here");
				}
                cards[1 + p + i * p + k].push(1 + p + j*p + pyMod(i*j - k, p));
            }
        }
    }

	// Output
	let output = "";
	for(let i = 0; i < cards.length; ++i)
	{
		output += "[";
		for(let j = 0; j <= p; ++j)
		{
			output += cards[i][j];
			if(j < p)
			{
				output += ", ";
			}
		}
		output += "]";
		if(i < cards.length - 1)
		{
			output += "\n";
		}
	}
	document.getElementById("d2output").value = output;
}