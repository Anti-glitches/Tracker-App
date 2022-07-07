import { start, pause, reset, addTime, reduceTime } from "./stopwatch.js";
import { txtDownload, expandTxtArea, shrinkTxtArea } from "./textarea.js";

const generateButton = document.querySelector("#generate");
const container = document.querySelector("#main-container");

let count = 0;

export function createBox() {
    const input = document.querySelector("#inputText");

    // if 'Task Name' is empty
    if (isEmptyOrSpaces()) {
        const errMsgBox = document.querySelector("#errMsgBox");
        const closeErrMsg = document.querySelector("#errCloseButton");

        errMsg.innerHTML = `Please give your 'Task' a name and 'start task' ⌛`;
        errMsgBox.style.visibility = "visible";

        closeErrMsg.addEventListener("click", () => {
            errMsg.innerHTML = "";
            errMsgBox.style.visibility = "hidden";
        });
    } else {
        //create task and its features
        const accordianItem = document.createElement("div");
        accordianItem.classList.add("accordian-item");
        accordianItem.innerHTML = `
                <div class="accordian-item-head">
                    <div class="circle-emoji" data-id="${count}">🔎</div>
                    <div class="item-head-display">
                        <h1>${input.value}</h1>
                        <p>time tracked: <span class="saved" data-id="${count}">00:00:00</span> <span class="circle"></p> 
                    </div>
                    <div class="item-head-toggle">
                        <i class="fas fa-caret-down item-head-arrow"></i>
                        <p>open</p>  
                    </div>    
                </div>
                <div class="accordian-item-body">
                    <div class="accordian-body-display">
                        <div class="item-body-stopwatch">
                            <span class="display" data-id="${count}">00:00:00</span>
                            <div class="stopwatch-buttons">
                                <button class='playPauseButton' data-id="${count}">start</button>
                                <button class='resetButton' data-id="${count}">save</button>
                            </div>
                        </div>
                        <div class="item-body-textarea">
                            <div class="textarea-overlay txtarea-overlay-hidden" data-id="${count}">
                                <h1 data-id="${count}" class="textarea-overlay-title textarea-overlay-title-hidden">${input.value} | notes</h1>
                                <textarea class="textarea" data-id="text-val${count}" cols="55" rows="8" placeholder="📄 Write notes here"
                                onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'    '+v.substring(e);this.selectionStart=this.selectionEnd=s+4;return false;}"
                                ></textarea>
                                <button class="exp-btn" data-id="${count}"><i class="fa-solid fa-maximize"></i></button>
                                <button class="shrk-btn btn-hidden" data-id="${count}"><i class="fa-solid fa-minimize"></i></button>
                                <button class="dwn-btn" data-id="${count}"><i class="fa-solid fa-download"></i></button>
                            </div>
                            
                        </div>
                    </div>
                    <div class="delete">
                        <i title="Please don't delete me"class="fas fa-trash delete-icon" data-id="${count}"></i>
                    </div>
                </div>`;
        container.prepend(accordianItem);

        //clear the text input (task name)
        input.value = "";

        //remove the message text
        document.querySelector("#instructionWhenNoTask").style.display = "none";

        //this is testing the local storage
        if (typeof Storage !== "undefined") {
            // Store
            localStorage.setItem("stopwatch_name", input.value);
        }

        allStuff();
    }
}

//----------------Testing---------------------
function emojiPicker(count) {
    const emojiCircle = document.querySelector(
        `.circle-emoji[data-id="${count}"]`
    );
    let chosenEmoji = "🔎";

    emojiCircle.addEventListener("mouseenter", () => {
        const emojiMenu = document.createElement("div");
        emojiMenu.classList.add("emoji-menu");
        emojiMenu.innerHTML = `
            <div>👨‍💼<span>Work</span></div>
            <div>💻<span>Code</span></div>
            <div>🏀<span>Exercise</span></div>
            <div>🎮<span>Break</span></div>
            <div>🧹<span>Chore</span></div>
        `;

        emojiCircle.append(emojiMenu);

        [...emojiMenu.children].forEach((e) => {
            e.addEventListener("mouseover", () => {
                // console.log(e.firstChild);
                // console.log(emojiCircle.firstChild.textContent);
                emojiCircle.firstChild.textContent = e.firstChild.textContent;
                chosenEmoji = e.firstChild.textContent;
            });
        });
    });

    emojiCircle.addEventListener("mouseleave", () => {
        emojiCircle.innerHTML = chosenEmoji;
    });
}
//----------------Testing Until here----------

function isEmptyOrSpaces() {
    const input = document.querySelector("#inputText");

    return (
        input.value.length === 0 ||
        input.value == null ||
        input.value.trim() === ""
    );
}

function stopwatch(count) {
    let display = document.querySelector(`.display[data-id="${count}"]`);
    let playPauseButton = document.querySelector(
        `.playPauseButton[data-id="${count}"]`
    );
    let savedDisplay = document.querySelector(`.saved[data-id="${count}"]`);
    let resetButton = document.querySelector(
        `.resetButton[data-id="${count}"]`
    );

    playPauseButton.addEventListener("click", () => {
        display.classList.toggle("active");

        if (display.classList.contains("active")) {
            display.style.backgroundColor = "#ffc2c2"; // red commit background
            playPauseButton.style.backgroundColor = "#F44B59"; // red button
            playPauseButton.innerHTML = "pause";
            savedDisplay.nextElementSibling.style.backgroundColor = "#F44B59"; //red square marker
            start(display, count);
        } else {
            display.style.backgroundColor = "#c7ffc2"; // green commit background
            playPauseButton.style.backgroundColor = "#59F44B"; // green button
            playPauseButton.innerHTML = "start";
            savedDisplay.nextElementSibling.style.backgroundColor = "#59F44B"; //green square marker
            pause(count);
        }
    });
    resetButton.addEventListener("click", () => {
        if (display.classList.contains("active")) {
            playPauseButton.style.backgroundColor = "#59F44B"; // green button
            playPauseButton.innerHTML = "start";
            savedDisplay.nextElementSibling.style.backgroundColor = "#59F44B"; //green square marker
            display.classList.toggle("active");
        }
        reset(display, savedDisplay, count);
        display.style.backgroundColor = "#fffec2"; // yellow commit background
    });
}

function disableButton() {
    const accordianItem = document.querySelectorAll(".accordian-item");

    // "Task" account max length 🚀🚀
    if (accordianItem.length > 7) {
        generateButton.disabled = true;
        generateButton.style.cssText = `background: lightgrey; cursor: not-allowed;`;
    } else {
        generateButton.disabled = false;
        generateButton.style.cssText = `background: white; cursor: pointer;`;
    }
}

function deleteaccordianItem(count) {
    let deleteIcon = document.querySelector(`.delete-icon[data-id="${count}"]`);
    let display = document.querySelector(`.display[data-id="${count}"]`);
    let savedDisplay = document.querySelector(`.saved[data-id="${count}"]`);

    deleteIcon.addEventListener("click", () => {
        let shouldDelete = confirm("Do you want to delete this task?");

        if (shouldDelete) {
            deleteIcon.parentElement.parentElement.parentElement.remove();
            disableButton();
            reset(display, savedDisplay, count);
        }

        //print the instruction if all 'task' is deleted
        document.querySelector("#instructionWhenNoTask").style.display =
            "block";
    });
}

// ----------- Edited Until here ---------------- 🍀🍀🍀

function allStuff() {
    stopwatch(count);

    disableButton();

    deleteaccordianItem(count);

    changeColor();

    rightClickMenu();

    //start text download
    txtDownload(count);

    //Textarea
    expandTxtArea(count);
    shrinkTxtArea(count);

    //----------------Testing---------------------
    emojiPicker(count);
    //----------------Testing Until here----------

    count++;
}

function changeColor() {
    let colorCount = document.querySelector(".item-head-display");

    let colorArr = [255, 233];
    let randnum = Math.floor(Math.random() * 23 + 233);
    colorArr.push(randnum);

    shuffle(colorArr);
    // console.log(colorArr)

    colorCount.style.backgroundColor = `rgb(${colorArr[0]}, ${colorArr[1]}, ${colorArr[2]})`;
    colorArr = [];
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

function rightClickMenu() {
    //experiment right menu
    document
        .querySelector(".item-head-display")
        .addEventListener("contextmenu", (e) => {
            e.preventDefault();
            let menu = document.createElement("div");
            menu.className = "unselectable";
            menu.id = "ctxmenu";
            menu.style = `top:${e.pageY - 10}px;left:${e.pageX - 40}px`;
            menu.onmouseleave = () => (ctxmenu.outerHTML = "");

            // console.log(document.getElementById("ctxmenu"));

            menu.innerHTML = `
                    <p id="subTime"><span>Reduce</span><span>-15min</span></p>
                    <p id="addTime"><span>Add</span><span>+15min</span></p>
                    <p id="rename">Rename</p>`;
            document.body.appendChild(menu);

            //try to get the class num for specific display
            let pointer = e.target.children[1];
            let positionNum;

            if (
                typeof pointer === "object" &&
                pointer.classList.value !== "circle"
            ) {
                positionNum = pointer.firstElementChild.getAttribute("data-id");
            } else {
                console.log("Pointer is undefined");
            }

            //experiment add 15min from right click menu
            document.querySelector("#addTime").addEventListener("click", () => {
                addTime(positionNum); //add time from func in stopwatcth.js
            });

            document.querySelector("#subTime").addEventListener("click", () => {
                reduceTime(positionNum); //reduce time from func in stopwatcth.js
            });

            //trying to get the class savedDisplay class so we can
            // go the <h1> for innner HTML

            let tempClass = document.querySelector(
                `.saved[data-id="${positionNum}"]`
            );

            //try to rename
            document.querySelector("#rename").addEventListener("click", () => {
                let newName = prompt("Enter new name for your task: ");

                if (newName !== null) {
                    //rename on the head
                    tempClass.parentElement.previousElementSibling.innerHTML =
                        newName;
                    //rename on Expanded Textbox Overlay (This need to be fucking fixed man')
                    tempClass.parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.innerHTML =
                        newName;
                }
            });
        });
}
