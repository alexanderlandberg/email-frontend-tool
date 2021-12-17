"use strict";

const keysObj = {
    13: "enter",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    65: "a",
    66: "b"
}

// const konamiArr = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a",]
const konamiArr = ["up", "down", "left", "right"]
// const konamiArr = ["a"]
let pressedArr = []

window.addEventListener("keydown", konami);

function konami(e) {
    if (keysObj[e.keyCode] === konamiArr[pressedArr.length]) {
        pressedArr.push(keysObj[e.keyCode]);
        if (konamiArr[pressedArr.length] == pressedArr[konamiArr.length]) {
            window.removeEventListener("keydown", konami);
            showControlPanel()
            console.log("Control panel opened")
            pressedArr = [];
        }
    } else {
        pressedArr = [];
        if (keysObj[e.keyCode] === konamiArr[pressedArr.length]) {
            pressedArr.push(keysObj[e.keyCode]);
        }
    }
}

const moduleList = document.querySelectorAll(`${getModuleContainerSelector()}>*`);
console.log(moduleList)

let effectObj = {
    1: {
        "name": "Border",
        "col": 1,
        "on": false,
        "type": "styling"
    },
    2: {
        "name": "Margin",
        "col": 1,
        "on": false,
        "type": "styling"
    },
    3: {
        "name": "Interval",
        "col": 1,
        "on": false,
        "type": "interval",
        "typeData": {
            "from": undefined,
            "amount": undefined
        }
    },
    4: {
        "name": "Grid",
        "col": 1,
        "on": false,
        "type": "switch",
        "typeData": {
            "value": "black"
        }
    },
    5: {
        "name": "Scrollbar",
        "col": 1,
        "on": false,
        "type": "styling"
    },
    6: {
        "name": "Link list",
        "col": 1,
        "on": false,
        "type": "styling+label"
    },
}


// Build and show control panel
function showControlPanel() {

    // build panel
    let newWrapper = document.createElement("div");
    newWrapper.classList.add("control-panel-wrapper");

    let newPanel = document.createElement("div");
    newPanel.classList.add("control-panel");
    newWrapper.appendChild(newPanel);

    for (let i = 0; i < Object.keys(effectObj).length; i++) {

        let newSlot = document.createElement("div");
        newSlot.classList.add(`col_${effectObj[i + 1].col}`);
        newSlot.setAttribute("data-slot", i + 1);
        newSlot.setAttribute("data-type", effectObj[i + 1].type);

        if (effectObj[i + 1].on == true) {
            newSlot.classList.add(`on`);
        }

        let newSpan = document.createElement("span");
        newSpan.innerHTML = i + 1;
        newSlot.appendChild(newSpan);

        let newP = document.createElement("p");
        newP.innerHTML = effectObj[i + 1].name;
        newSlot.appendChild(newP);

        if (effectObj[i + 1].type == "interval") {
            let newInterval = document.createElement("div");
            newInterval.innerHTML = `
            <div class="range-wrapper">
            <div class="range-from">
                <span>From</span>
                <input type="range" min="1" max="${moduleList.length}" value="${effectObj[i + 1].typeData.from == undefined ? 1 : effectObj[i + 1].typeData.from}" class="slider_from" oninput="intervalHandler(this)">
                <span>${effectObj[i + 1].typeData.from == undefined ? 1 : effectObj[i + 1].typeData.from}</span>
            </div>
            <div class="range-plus">
                <span>Amount</span>
                <input type="range" min="1" max="${effectObj[i + 1].typeData.amount == undefined ? moduleList.length : moduleList.length - effectObj[i + 1].typeData.from + 1}" value="${effectObj[i + 1].typeData.amount == undefined ? 1 : effectObj[i + 1].typeData.amount}" class="slider_to" oninput="intervalHandler(this)">
                <span>${effectObj[i + 1].typeData.amount == undefined ? 1 : effectObj[i + 1].typeData.amount}</span>
            </div>
        </div>`;
            newSlot.appendChild(newInterval);
        }

        if (effectObj[i + 1].type == "switch") {
            let newSwitch = document.createElement("div");
            newSwitch.innerHTML = `
                <p class="panel-type-label">Line color</p>
                <div class="switch-wrapper">
                    <input ${(effectObj[i + 1].typeData.value == undefined || effectObj[i + 1].typeData.value == "black") ? "checked" : null} type="radio" id="black" name="borderColor" value="black" onchange="switchHandler(this);" >
                    <label for="black" style="background-color: black;"></label>
                    <input ${effectObj[i + 1].typeData.value == "white" ? "checked" : null} type="radio" id="white" name="borderColor" value="white" onchange="switchHandler(this);">
                    <label for="white" style="background-color: white;"></label>
                    <input ${(effectObj[i + 1].typeData.value == "red") ? "checked" : null} type="radio" id="red" name="borderColor" value="red" onchange="switchHandler(this);" >
                    <label for="red" style="background-color: red;"></label>
                    <input ${effectObj[i + 1].typeData.value == "aqua" ? "checked" : null} type="radio" id="aqua" name="borderColor" value="aqua" onchange="switchHandler(this);">
                    <label for="aqua" style="background-color: aqua;"></label>
                </div>`;
            newSlot.appendChild(newSwitch);
        }

        if (effectObj[i + 1].type.includes("+label")) {
            let newSwitch = document.createElement("div");
            newSwitch.innerHTML = `<p class="panel-type-label">List in console</p>`;
            newSlot.appendChild(newSwitch);
        }

        newPanel.appendChild(newSlot);
    }

    document.querySelector("body").appendChild(newWrapper);

    // add eventlisteners

    for (let i = 0; i < document.querySelectorAll(`div[data-slot]`).length; i++) {
        document.querySelector(`div[data-slot="${i + 1}"]`).addEventListener("click", handleMouseClick);
    }

    document.querySelector(".control-panel-wrapper").addEventListener("click", closeControlPanel)

    window.addEventListener("keydown", handleKeyDown)

}

function intervalHandler(e) {

    // get slot number and create wrapper variable
    const slotNum = e.parentNode.parentNode.parentNode.parentNode.getAttribute("data-slot");
    const rangeWrapper1 = document.querySelector(`div[data-slot="${slotNum}"] .range-from`)
    const rangeWrapper2 = document.querySelector(`div[data-slot="${slotNum}"] .range-plus`)

    // change max on range 2
    rangeWrapper2.children[1].setAttribute("max", moduleList.length - rangeWrapper1.children[1].value + 1);

    // update number
    rangeWrapper1.children[2].innerHTML = Number(rangeWrapper1.children[1].value);
    rangeWrapper2.children[2].innerHTML = Number(rangeWrapper2.children[1].value);
    effectObj[slotNum].typeData.from = Number(rangeWrapper1.children[1].value);
    effectObj[slotNum].typeData.amount = Number(rangeWrapper2.children[1].value);

    // add classes to selected modules
    for (let i = 0; i < moduleList.length; i++) {
        if (i + 2 > Number(rangeWrapper1.children[1].value) && i < (Number(rangeWrapper2.children[1].value) + Number(rangeWrapper1.children[1].value) - 1)) {
            moduleList[i].classList.remove("interval-hide");
        } else {
            moduleList[i].classList.add("interval-hide");
        }
    }
}

function switchHandler(e) {

    // get slot number and radio value
    const slotNum = e.parentNode.parentNode.parentNode.getAttribute("data-slot");
    const selectedColor = e.getAttribute("id");

    // update effectObj
    effectObj[slotNum].typeData.value = selectedColor;

    // console.log(effectObj)

    const moduleWrapper = document.querySelector(getModuleContainerSelector());

    moduleWrapper.setAttribute("grid-color", selectedColor);
}

// return module container selector
function getModuleContainerSelector() {

    if (typeof (document.querySelector(".acr-container")) != 'undefined' && document.querySelector(".acr-container") != null) {
        // adobe
        return ".acr-container";
    } else {
        // default
        return ".min-width";
    }
}

// Handle mouse click
function handleMouseClick(clickTarget) {

    let slotNum = Number(this.getAttribute("data-slot"));
    let slotDOM = this;

    let targetTag = clickTarget.target.tagName.toLowerCase();

    if (targetTag !== "input" && targetTag !== "label") {
        runEffects(slotNum, slotDOM)
    }
}

// Handle key down
function handleKeyDown(e) {

    if (Number(e.key) > 0 && Number(e.key) < (Object.keys(effectObj).length + 1)) {
        let slotNum = Number(e.key);
        let slotDOM = document.querySelector(`div[data-slot="${e.key}"]`);

        // console.log(slotNum, slotDOM)
        runEffects(slotNum, slotDOM)
    }

    // close panel
    if (e.key === "Escape") {
        closeControlPanel("Escape");
    }

}

// Close control panel
function closeControlPanel(parm) {
    if (parm === "Escape" || parm.target === document.querySelector(".control-panel-wrapper")) {

        // remove eventlisteners
        for (let i = 0; i < document.querySelectorAll(`div[data-slot]`).length; i++) {
            document.querySelector(`div[data-slot="${i + 1}"]`).removeEventListener("click", handleMouseClick);
        }
        document.querySelector(".control-panel-wrapper").removeEventListener("click", closeControlPanel)
        window.removeEventListener("keydown", handleKeyDown)

        // re-add konami listener
        window.addEventListener("keydown", konami);

        // remove panel
        if (parm === "Escape") {
            document.querySelector(".control-panel-wrapper").remove()
        } else if (parm.target === document.querySelector(".control-panel-wrapper")) {
            document.querySelector(".control-panel-wrapper").remove()
        }

        // set local storage
        localStorage.setItem("EmailFrontendTool_DataObj", JSON.stringify(effectObj))

    }
}

// Add effects
function runEffects(slotNum, slotDOM) {
    // console.log("TEST", slotNum, slotDOM)

    const moduleWrapper = document.querySelector(getModuleContainerSelector());
    console.log(moduleWrapper)

    if (!slotDOM.classList.contains("on")) {
        slotDOM.classList.add("on")
        effectObj[slotNum].on = true;
    } else {
        slotDOM.classList.remove("on")
        effectObj[slotNum].on = false;
    }

    if (effectObj[slotNum].name === "Border") {
        if (effectObj[slotNum].on) {
            moduleWrapper.classList.add("border-bottom");
        } else {
            moduleWrapper.classList.remove("border-bottom");
        }
    } else if (effectObj[slotNum].name === "Margin") {
        if (effectObj[slotNum].on) {
            moduleWrapper.classList.add("margin");
        } else {
            moduleWrapper.classList.remove("margin");
        }
    } else if (effectObj[slotNum].name === "Interval") {
        if (effectObj[slotNum].on) {
            moduleWrapper.classList.add("interval");

            if (effectObj[slotNum].typeData.from === undefined) {
                for (let i = 0; i < moduleList.length; i++) {
                    if (i === 0) {
                        moduleList[i].classList.remove("interval-hide");
                    } else {
                        moduleList[i].classList.add("interval-hide");
                    }
                }
                effectObj[slotNum].typeData.from = 1;
                effectObj[slotNum].typeData.amount = 1;
            }

        } else {
            moduleWrapper.classList.remove("interval");
        }
    } else if (effectObj[slotNum].name === "Grid") {
        if (effectObj[slotNum].on) {
            moduleWrapper.classList.add("grid");
            moduleWrapper.setAttribute("grid-color", effectObj[4].typeData.value);
        } else {
            moduleWrapper.classList.remove("grid");
        }
    } else if (effectObj[slotNum].name === "Scrollbar") {
        if (effectObj[slotNum].on) {
            document.querySelector("body").classList.add("hide-scrollbar");
        } else {
            document.querySelector("body").classList.remove("hide-scrollbar");
        }
    } else if (effectObj[slotNum].name === "Link list") {
        if (effectObj[slotNum].on) {
            getLinklist()
        }
    }

}

function getLinklist() {
    const linkList = document.querySelectorAll("a");
    let linkObj = {}
    let linkArr = [];

    for (let i = 0; i < linkList.length; i++) {

        let newlink = {};

        newlink["url"] = linkList[i].getAttribute("href");

        let currentInner = linkList[i].innerHTML.trim();

        if (currentInner.includes("<img")) {
            newlink["img"] = linkList[i].querySelector("img").getAttribute("src");
        } else if (currentInner.length > 20) {
            newlink["text"] = currentInner.substring(0, 19).trim() + "...";
        } else {
            newlink["text"] = currentInner;
        }

        newlink["DOM"] = linkList[i];

        linkObj[i] = newlink;
        linkArr.push(linkList[i].href)

    }
    console.log(`%c Link list: ${Object.keys(linkObj).length} `, 'background: #aaca85; color: #000000; padding: 6px; border-radius: 4px;', "\n", linkObj)
}

// Add styles from local storage data
function addFromLocalStorage() {

    if (localStorage.getItem("EmailFrontendTool_DataObj") !== null && Object.keys(effectObj).length === Object.keys(JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))).length) {

        // Get data from localstorage
        for (let i = 0; i < Object.keys(effectObj).length; i++) {
            // get on/off status from localstorage
            effectObj[i + 1].on = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].on;

            // get range status from localstorage
            if (effectObj[i + 1].type === "interval") {
                effectObj[i + 1].typeData.from = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].typeData.from;
                effectObj[i + 1].typeData.amount = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].typeData.amount;
            }

            // get switch status from localstorage
            if (effectObj[i + 1].type === "switch") {
                effectObj[i + 1].typeData.value = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].typeData.value;
            }
        }


        const moduleWrapper = document.querySelector(getModuleContainerSelector());

        // if border
        if (effectObj[1] !== undefined && effectObj[1].on) {
            moduleWrapper.classList.add("border-bottom");
        }

        // if margin
        if (effectObj[2] !== undefined && effectObj[2].on) {
            moduleWrapper.classList.add("margin");
        }

        // if range
        if (effectObj[3] !== undefined && effectObj[3].on) {
            moduleWrapper.classList.add("interval");
        }

        for (let i = 0; i < moduleList.length; i++) {
            moduleList[i].classList.add("interval-hide");
            if (i + 1 >= effectObj[3].typeData.from && i + 2 <= (effectObj[3].typeData.from + effectObj[3].typeData.amount)) {
                moduleList[i].classList.remove("interval-hide");
                // console.log(i, "shown")
            }
        }

        // if grid
        if (effectObj[4] !== undefined && effectObj[4].on) {
            moduleWrapper.classList.add("grid");
            moduleWrapper.setAttribute("grid-color", effectObj[4].typeData.value);
        }

        // if scrollbar
        if (effectObj[5] !== undefined && effectObj[5].on) {
            document.querySelector("body").classList.add("hide-scrollbar");
        }

        // if link list
        if (effectObj[6] !== undefined && effectObj[6].on) {
            getLinklist();
        }


    } else {
        localStorage.removeItem('EmailFrontendTool_DataObj');
    }
}
addFromLocalStorage()