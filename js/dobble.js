// https://math.stackexchange.com/questions/36798/what-is-the-math-behind-the-game-spot-it
const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
const imagePositions = [ [1.0000, 0.0000], [0.6235, 0.7818], [-0.2225, 0.9749], [-0.9010, 0.4339], [-0.9010, -0.4339], [-0.2225, -0.9749], [0.6235, -0.7818] ];

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

function loadImage(file)
{
	return new Promise((resolve, reject) =>
	{
		let fileReader = new FileReader();
		fileReader.onload = function()
		{
			return resolve({ data:fileReader.result, name:file.name, size: file.size, type: file.type });
		}
		fileReader.readAsDataURL(file);
	});
} 

let loadedImages = [];
async function uploadImages(event)
{
	// Clear previous output
	const imageContainer = document.getElementById("image-preview-container");
	imageContainer.innerHTML = "";

	// Load images
	let files = [...event.target.files];
	loadedImages = await Promise.all(files.map(f => { return loadImage(f); }));

	// Generate preview images
	for(let i = 0; i < loadedImages.length; ++i)
	{
		let file = loadedImages[i];
		let img = document.createElement("img");
		img.src = file.data;
		img.className = "image-preview";
		imageContainer.appendChild(img);
	}
}

async function dobble2(event)
{
	// Setup inputs
	let p = 7;
	let numCards = (p * p) + p + 1;

	// Setup cards
	let cards = [];
	for(let i = 0; i < numCards; ++i)
	{
		cards.push([]);
	}

	// Populate cards
	cards[0].push(0);
	for (let i = 0; i <= p; ++i)
	{
		for (let j = 0; j < p; ++j)
		{
			let index = 1 + i * p + j;
			cards[index].push(i);
			cards[i].push(index);
		}
	}

	for (let i = 0; i < p; ++i)
	{
		for (let j = 0; j < p; ++j)
		{
			for (let k = 0; k < p; ++k)
			{
				let index = 1 + p + i * p + k;
				let value = 1 + p + j * p + pyMod(i * j - k, p);
				cards[index].push(value);
			}
		}
	}

	// Raw output
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

	// Clear previous output
	const cardContainer = document.getElementById("card-container");
	cardContainer.innerHTML = "";

	// Generate cards
	const cardDiameter = parseInt(document.getElementById("card-diameter").value);
	const cardSpacing = parseInt(document.getElementById("card-spacing").value);
	const imageSize = cardDiameter * 0.2;
	const cardHalfSize = cardDiameter * 0.5;
	const imageRadius = cardDiameter * 0.3;

	// Function for adding images to card
	const addImage = function(container, x, y, w, h, src)
	{
		const halfWidth = w * 0.5;
		const halfHeight = h * 0.5;
		let img = document.createElement("img");
		img.className = "cardImage";
		img.src = src;
		img.style.minWidth = w + "px";
		img.style.minHeight = h + "px";
		img.style.left = (x - halfWidth) + "px";
		img.style.top = (y - halfHeight) + "px";
		container.appendChild(img);
	};

	for(let i = 0; i < cards.length; ++i)
	{
		const card = cards[i];

		// Card background
		let cardBackground = document.createElement("div");
		cardBackground.className = "card";
		cardBackground.style.minWidth = cardDiameter + "px";
		cardBackground.style.maxWidth = cardDiameter + "px";
		cardBackground.style.minHeight += cardDiameter + "px";
		cardBackground.style.maxHeight += cardDiameter + "px";
		cardBackground.style.margin = cardSpacing + "px";
		cardContainer.appendChild(cardBackground);

		// Card images
		addImage(cardBackground, cardHalfSize, cardHalfSize, imageSize, imageSize, loadedImages[card[0]].data);
		for(let j = 0; j < 7; ++j)
		{
			const x = cardHalfSize + (imagePositions[j][0] * imageRadius);
			const y = cardHalfSize + (imagePositions[j][1] * imageRadius);
			addImage(cardBackground, x, y, imageSize, imageSize, loadedImages[card[j + 1]].data);
		}
	}
}

function printDiv(id)
{
	var divContents = document.getElementById(id).innerHTML;
	var a = window.open('', '', '');
	a.document.write("<html><link rel='stylesheet' href='css/dobble.css'><body>");
	a.document.write(divContents);
	a.document.write('</body></html>');
	a.document.close();
} 