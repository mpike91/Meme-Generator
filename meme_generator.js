// Grab the form containing the inputs
const form = document.querySelector("form");
// Grab the meme container where all the meme div elements will go
const memeContainer = document.querySelector("#memeContainer")
// Grab the delete button
const deleteButton = document.querySelector(".delete");

// memeJSON will be the array of objects saving each meme's data. The 0th element will be an ID counter, so each object contains a unique ID upon generation by which it may be easily deleted form the array when a user deletes a meme.
const memeJSON = JSON.parse(localStorage.getItem("memeJSON")) || [];
// If no data exists beyond the 0th index, set the ID counter to 0;
if (!memeJSON[1]) memeJSON[0] = 0;
// Run through each object in the array, starting with index 1 (as 0 is just an ID counter), and generate the Meme
for (let i = 1; i < memeJSON.length; i++) {
    let meme = memeJSON[i];
    generateMeme(meme.id, meme.img, meme.top, meme.bot, false);
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll("input");
    let imgLink = inputs[0].value;
    let topText = inputs[1].value;
    let botText = inputs[2].value;
    generateMeme(null, imgLink, topText, botText, true);
    for (let val of inputs) val.value = null;
})

// Setup the Delete button toggle
deleteButton.addEventListener("click", function(event) {
    deleteButton.classList.toggle("deleteActive");
    if (deleteButton.classList.contains("deleteActive")) {
        memeContainer.addEventListener("click", deleteMeme)
    } else {
        memeContainer.removeEventListener("click", deleteMeme)
    }
})

// Delete the meme that was clicked on. Make sure to select the div if the span (top text / bot text) was clicked on, using parentELement.
function deleteMeme (event) {
    let meme;
    if (event.target.parentElement.classList.contains("meme")) {
        meme = event.target.parentElement;
    } else {
        meme = event.target;
    }
    // Delete the meme from the localstorage
    deleteMemeJSON(meme);
    // Delete the meme
    meme.remove();
}

function deleteMemeJSON (meme) {
    // iterate through localstorage array (memeJSON), find the meme whose ID matches the meme ID element that is being deleted.
    for (let i = 1; i < memeJSON.length; i++) {
        // Use '==' as the dataset.id will be a number and the memeJSON.id will be a string
        if (meme.dataset.id == (memeJSON[i].id)) {
            memeJSON.splice([i], 1);
            localStorage.setItem("memeJSON", JSON.stringify(memeJSON));
            return;
        }
    }
}

// Generate meme. Pass in memeID to attach the the new meme, the img url, the top text, the bot text, and an updateJSON boolean - if true, update the localstorage with the new meme; if false, just create the meme (such as when the page first loads).
function generateMeme(memeID, img, top, bot, updateJSON) {
    const meme = document.createElement("div");
    const memeTop = document.createElement("span");
    const memeBot = document.createElement("span");

    meme.classList.add("meme");
    meme.style.background = `url("${img}")`;
    meme.style.backgroundPosition = "center";
    meme.style.backgroundRepeat = "no-repeat";
    meme.style.backgroundSize = "cover";

    memeTop.classList.add("text", "top");
    memeTop.style.width = "400px";
    memeTop.innerText = top;

    memeBot.classList.add("text", "bot");
    memeBot.style.width = "400px";
    memeBot.innerText = bot;

    memeContainer.append(meme);
    meme.append(memeTop);
    meme.append(memeBot);
    document.querySelector("input").focus();

    // If true was passed, then it is a brand new meme being submitted. Increment the memeJSON[0] id generator, push the new meme into the array, set the meme's dataset.id, and update the localstorage. If false was passed, ignore this and just set the meme datatset id to the passed memeID (as when the page first loads and the "saved" memes are being generated).
    if (updateJSON) {
        memeJSON[0]++;
        memeJSON.push({
            "id" : memeJSON[0],
            "img" : img,
            "top" : top,
            "bot" : bot
        })
        meme.dataset.id = memeJSON[0];
        localStorage.setItem("memeJSON", JSON.stringify(memeJSON));
    } else {
        meme.dataset.id = memeID;
    }
}