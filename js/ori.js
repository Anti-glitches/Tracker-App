import { accordian } from "./accordian.js";
import { start, pause, reset, addTime, reduceTime } from "./stopwatch.js";
import { txtDownload, expandTxtArea, shrinkTxtArea } from "./textarea.js";

const generateButton = document.querySelector("#generate");
const container = document.querySelector(".main-container");

let count = 0;

export function createBox() {
    const accordianItem = document.createElement("div");
    const input = document.querySelector("#inputText");

    // if there is nothing in the input
    if (input.value.length === 0) {
        const errMsgBox = document.querySelector("#errMsgBox");
        const closeErrMsg = document.querySelector("#errCloseButton");
        errMsg.innerHTML =
            "Your stopwatch begs you to give it a name as it cries in despair. &#128557";
        errMsgBox.style.visibility = "visible";

        closeErrMsg.addEventListener("click", () => {
            errMsg.innerHTML = "";
            errMsgBox.style.visibility = "hidden";
        });
    } else {
        //remove the message text
        if (container.firstElementChild.tagName == "H4") {
            container.firstElementChild.style.display = "none";
        }
        //below is the original

        accordianItem.classList.add("accordian-item");

        //this is testing the local storage
        if (typeof Storage !== "undefined") {
            // Store
            localStorage.setItem("stopwatch_name", input.value);
        }

        accordianItem.innerHTML = `
                <div class="accordian-item-head">
                    <div class="item-head-display">
                        <h1>${input.value}</h1>
                        <p>time tracked: <span class="saved savedDisplay${count}">00:00:00</span> <span class="circle"></p> 
                    </div>
                    <div class="item-head-toggle">
                        <i class="fas fa-caret-down item-head-arrow"></i>
                        <p>open</p>  
                    </div>    
                </div>
                <div class="accordian-item-body">
                    <div class="accordian-body-display">
                        <div class="item-body-stopwatch">
                            <span class='display display${count}'>00:00:00</span>
                            <div class="stopwatch-buttons">
                                <button class='playPauseButton playPause${count}'>start</button>
                                <button class='resetButton reset${count}'>save</button>
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
                        <i title="Please don't delete me"class="fas fa-trash delete-icon delete${count}"></i>
                    </div>
                </div>`;

        input.value = ""; //clear the input in the text
        container.prepend(accordianItem);

        allStuff();
    }
}

function stopwatch(playPauseNum, resetNum, displayNum, savedDisplayNum) {
    let display = document.querySelector(`.${displayNum}`);
    let playPauseButton = document.querySelector(`.${playPauseNum}`);
    let savedDisplay = document.querySelector(`.${savedDisplayNum}`);

    document.querySelector(`.${playPauseNum}`).addEventListener("click", () => {
        display.classList.toggle("active");

        if (display.classList.contains("active")) {
            display.style.backgroundColor = "#ffc2c2"; // red background
            playPauseButton.style.backgroundColor = "#F44B59"; // red button
            playPauseButton.innerHTML = "pause";
            savedDisplay.nextElementSibling.style.backgroundColor = "#F44B59"; //red dot
            start(`.${displayNum}`, `${displayNum}`.slice(-1));
        } else {
            display.style.backgroundColor = "#c7ffc2"; // green background
            playPauseButton.style.backgroundColor = "#59F44B"; // green button
            playPauseButton.innerHTML = "start";
            savedDisplay.nextElementSibling.style.backgroundColor = "#59F44B"; //green dot
            pause(`${displayNum}`.slice(-1));
        }
    });
    document.querySelector(`.${resetNum}`).addEventListener("click", () => {
        if (display.classList.contains("active")) {
            display.classList.toggle("active");
            display.style.backgroundColor = "#fffec2"; // yellow commit background
            playPauseButton.style.backgroundColor = "#59F44B"; // green button
            playPauseButton.innerHTML = "start";
            savedDisplay.nextElementSibling.style.backgroundColor = "#59F44B"; //green dot
            reset(
                `.${displayNum}`,
                `.${savedDisplayNum}`,
                `${displayNum}`.slice(-1)
            );
        } else {
            reset(
                `.${displayNum}`,
                `.${savedDisplayNum}`,
                `${displayNum}`.slice(-1)
            );
            display.style.backgroundColor = "#fffec2";
        }
    });
}

function disableButton() {
    const accordianItem = document.querySelectorAll(".accordian-item");
    if (accordianItem.length > 7) {
        generateButton.disabled = true;
        generateButton.style.backgroundColor = "lightgrey";
    } else {
        generateButton.disabled = false;
        generateButton.style.backgroundColor = "white";
    }
}

function deleteaccordianItem(displayNum, savedDisplayNum, deleteNum) {
    let deleteIcon = document.querySelector(`.${deleteNum}`);
    deleteIcon.addEventListener("click", () => {
        let shouldDelete = confirm("Do you want to delete this task?");

        if (shouldDelete) {
            deleteIcon.parentElement.parentElement.parentElement.remove();
            generateButton.style.backgroundColor = "white";
            generateButton.disabled = false;
            reset(
                `.${displayNum}`,
                `.${savedDisplayNum}`,
                `${displayNum}`.slice(-1)
            );
        }

        //print the instruction if all is deleted
        if (container.firstElementChild.tagName == "H4") {
            container.firstElementChild.style.display = "block";
        }
    });
}

function allStuff() {
    stopwatch(
        `playPause${count}`,
        `reset${count}`,
        `display${count}`,
        `savedDisplay${count}`
    );
    // console.log(`playPause${count}`,`reset${count}`, `display${count}`, `savedDisplay${count}`)

    disableButton();

    deleteaccordianItem(
        `display${count}`,
        `savedDisplay${count}`,
        `delete${count}`
    );

    changeColor();

    rightClickMenu();

    //start text download
    txtDownload(count);

    //experiment for expand txtarea
    expandTxtArea(count);
    shrinkTxtArea(count);
    //until here

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
                positionNum = parseInt(pointer.children[0].className.slice(-1));
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
            let tempPointer;

            if (
                typeof pointer === "object" &&
                pointer.classList.value !== "circle"
            ) {
                tempPointer = pointer.children[0].className.split(" ").pop();
            } else {
                console.log("Pointer is undefined");
            }

            let tempClass = document.querySelector(`.${tempPointer}`);

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