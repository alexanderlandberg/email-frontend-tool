"use strict";

function addToggleBtn() {
    let newBtn = document.createElement("div");
    newBtn.classList.add("control-panel-button");
    newBtn.setAttribute("title", "Open Email Frontend Tool");
    newBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>`
    newBtn.addEventListener("click", showControlPanel);
    document.querySelector("body").appendChild(newBtn);
}
addToggleBtn()

const keysObj = {
    13: "enter",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    65: "a",
    66: "b"
}

const konamiArr = ["up", "down", "left", "right"]
let pressedArr = []

window.addEventListener("keydown", konami);

function konami(e) {
    if (keysObj[e.keyCode] === konamiArr[pressedArr.length]) {
        pressedArr.push(keysObj[e.keyCode]);
        if (konamiArr[pressedArr.length] == pressedArr[konamiArr.length]) {
            window.removeEventListener("keydown", konami);
            showControlPanel()
            // console.log("Control panel opened")
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
            "amount": undefined,
            "toggle": false
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
    7: {
        "name": "Remove content-editable",
        "col": 1,
        "on": false,
        "type": "styling"
    },
    8: {
        "name": "Dark mode",
        "col": 1,
        "on": false,
        "type": "toggle",
        "typeData": {
            "toggleLabel": "Isolate images",
            "toggleOn": "On",
            "toggleOff": "Off",
            "toggle": false,
            "onInput": "isolateImages(this)",
            "checkboxId": "toggle-isolate",
        }
    },
    9: {
        "name": "Selligent dynamic",
        "col": 1,
        "on": false,
        "type": "styling"
    },
    10: {
        "name": "Marketo defaults",
        "col": 1,
        "on": false,
        "type": "toggle",
        "typeData": {
            "toggleLabel": "mktoBoolean",
            "toggleOn": "True value",
            "toggleOff": "False value",
            "toggle": false,
            "onInput": "marketoBooleanToggle(this)",
            "checkboxId": "toggle-marketoBoolean",
        }
    },
    11: {
        "name": "Preview overlay",
        "col": 1,
        "on": false,
        "type": "preview",
        "typeData": {
            "bgImageDesktop": "./example-imgs/example-desktop.png",
            "bgImageMobile": "./example-imgs/example-mobile.png",
            "heightDesktop": 2760,
            "heightMobile": 3996,
            "widthDesktop": 720,
            "widthMobile": 360,
            "topDesktop": 40,
            "topMobile": 40,
            "opacity": 0.5,
            "breakpoint": 500,
        }
    },
}

// Build and show control panel
function showControlPanel() {

    // build panel
    let newOuter = document.createElement("div");
    newOuter.classList.add("control-panel-outer");

    let newInner = document.createElement("div");
    newInner.classList.add("control-panel-inner");
    newInner.style.transform = "translateX(-100%)";

    let newPanel = document.createElement("div");
    newPanel.classList.add("control-panel");
    newInner.appendChild(newPanel);

    for (let i = 0; i < Object.keys(effectObj).length; i++) {

        let newSlot = document.createElement("div");
        newSlot.classList.add(`col_${effectObj[i + 1].col}`);
        newSlot.setAttribute("data-slot", i + 1);
        newSlot.setAttribute("data-type", effectObj[i + 1].type);
        newSlot.addEventListener("mouseleave", (e) => {
            e.target.classList.remove("open");
        })

        if (effectObj[i + 1].on == true) {
            newSlot.classList.add(`on`);
        }

        if (effectObj[i + 1].disabled == true) {
            newSlot.classList.add(`disabled`);
        }

        let newSlotLabel = document.createElement("div");
        newSlotLabel.classList.add("slot-label");
        newSlot.appendChild(newSlotLabel);

        let newP = document.createElement("p");
        newP.innerHTML = (i + 1) + ". " + effectObj[i + 1].name;
        newSlotLabel.appendChild(newP);

        let newAccordionContent;
        newAccordionContent = document.createElement("div");
        newAccordionContent.classList.add("accordion-content");
        if (effectObj[i + 1].type !== "styling") {
            let newAccordionArrow = document.createElement("div");
            newAccordionArrow.classList.add("accordion-arrow");
            newAccordionArrow.addEventListener("mouseover", (e) => {
                e.target.closest("div[data-slot]").classList.add("open");
            })
            newSlotLabel.appendChild(newAccordionArrow);
        }

        // interval
        if (effectObj[i + 1].type == "interval") {
            let newToggle = document.createElement("div");
            newToggle.innerHTML = `
            <div class="toggle-wrapper">
            <span class="toggle-left">Show</span>
                <label for="toggle-interval">
                <input type="checkbox" id="toggle-interval" ${effectObj[i + 1].typeData.toggle ? "checked" : null} oninput="intervalHandler(this)">
                <div class="toggleSlider"></div>
                </label>
                <span class="toggle-right">Hide</span>
            </div>
            `
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
            newAccordionContent.appendChild(newToggle);
            newAccordionContent.appendChild(newInterval);
        }

        // switch
        if (effectObj[i + 1].type == "switch") {
            let newSwitch = document.createElement("div");
            newSwitch.innerHTML = `
                <p class="panel-type-label">Line color</p>
                <div class="switch-wrapper">
                    <input ${(effectObj[i + 1].typeData.value == undefined || effectObj[i + 1].typeData.value == "black") ? "checked" : null} type="radio" id="black" name="borderColor" value="black" onchange="switchHandler(this);" >
                    <label for="black"></label>
                    <input ${effectObj[i + 1].typeData.value == "white" ? "checked" : null} type="radio" id="white" name="borderColor" value="white" onchange="switchHandler(this);">
                    <label for="white"></label>
                    <input ${(effectObj[i + 1].typeData.value == "red") ? "checked" : null} type="radio" id="red" name="borderColor" value="red" onchange="switchHandler(this);" >
                    <label for="red"></label>
                    <input ${effectObj[i + 1].typeData.value == "aqua" ? "checked" : null} type="radio" id="aqua" name="borderColor" value="aqua" onchange="switchHandler(this);">
                    <label for="aqua"></label>
                </div>`;
            newAccordionContent.appendChild(newSwitch);
        }

        // +label
        if (effectObj[i + 1].type.includes("+label")) {
            let newSwitch = document.createElement("div");
            newSwitch.innerHTML = `<p class="panel-type-label">List in console</p>`;
            newAccordionContent.appendChild(newSwitch);
        }
        // toggle
        if (effectObj[i + 1].type == "toggle") {
            let newToggle = document.createElement("div");
            newToggle.innerHTML = `
            <p class="panel-type-label">${effectObj[i + 1].typeData.toggleLabel}</p>
            <div class="toggle-wrapper">
                <span class="toggle-left">${effectObj[i + 1].typeData.toggleOff}</span>
                <label for="${effectObj[i + 1].typeData.checkboxId}">
                <input type="checkbox" id="${effectObj[i + 1].typeData.checkboxId}" ${effectObj[i + 1].typeData.toggle ? "checked" : null} oninput="${effectObj[i + 1].typeData.onInput}">
                <div class="toggleSlider"></div>
                </label>
                <span class="toggle-right">${effectObj[i + 1].typeData.toggleOn}</span>
            </div>
            `
            newAccordionContent.appendChild(newToggle);
        }

        // preview (custom)
        if (effectObj[i + 1].type == "preview") {
            let newInput = document.createElement("div");
            newInput.innerHTML = `
            <p class="panel-type-label">Shared</p>
            <div class="inputs" style="padding-bottom: 10px;">
                <div class="input">
                    <span>Opacity</span>
                    <input type="number" min="0" max="1" step="0.1" oninput="inputHandler(this)" data-typeData="opacity" value="${effectObj[i + 1].typeData.opacity == undefined ? 100 : effectObj[i + 1].typeData.opacity}">
                </div>
                <div class="input">
                    <span class="breakpoint">Breakpoint</span>
                    <input type="number" min="0" oninput="inputHandler(this)" data-typeData="breakpoint" value="${effectObj[i + 1].typeData.breakpoint == undefined ? 100 : effectObj[i + 1].typeData.breakpoint}">
                </div>
            </div>
            <p class="panel-type-label">Desktop</p>
            <div class="inputs" style="padding-bottom: 10px;">
                <div class="input">
                    <span>Height (px)</span>
                    <input type="number" min="1" oninput="inputHandler(this)" data-typeData="heightDesktop" value="${effectObj[i + 1].typeData.heightDesktop == undefined ? 100 : effectObj[i + 1].typeData.heightDesktop}">
                </div>
                <div class="input">
                    <span>Width (px)</span>
                    <input type="number" min="1" oninput="inputHandler(this)" data-typeData="widthDesktop" value="${effectObj[i + 1].typeData.widthDesktop == undefined ? 600 : effectObj[i + 1].typeData.widthDesktop}">
                </div>
                <div class="input">
                    <span>Top (px)</span>
                    <input type="number" oninput="inputHandler(this)" data-typeData="topDesktop" value="${effectObj[i + 1].typeData.topDesktop == undefined ? 0 : effectObj[i + 1].typeData.topDesktop}">
                </div>
                <div class="input">
                    <span>BG image</span>
                    <input type="text" oninput="inputHandler(this)" data-typeData="bgImageDesktop" typeData=bgImageDesktop" value="${effectObj[i + 1].typeData.bgImageDesktop == undefined ? "" : effectObj[i + 1].typeData.bgImageDesktop}">
                </div>
            </div>
            <p class="panel-type-label">Mobile</p>
            <div class="inputs">
                <div class="input">
                    <span>Height (px)</span>
                    <input type="number" min="1" oninput="inputHandler(this)" data-typeData="heightMobile" value="${effectObj[i + 1].typeData.heightMobile == undefined ? 100 : effectObj[i + 1].typeData.heightMobile}">
                </div>
                <div class="input">
                    <span>Width (px)</span>
                    <input type="number" min="1" oninput="inputHandler(this)" data-typeData="widthMobile" value="${effectObj[i + 1].typeData.widthMobile == undefined ? 320 : effectObj[i + 1].typeData.widthMobile}">
                </div>
                <div class="input">
                    <span>Top (px)</span>
                    <input type="number" oninput="inputHandler(this)" data-typeData="topMobile" value="${effectObj[i + 1].typeData.topMobile == undefined ? 0 : effectObj[i + 1].typeData.topMobile}">
                </div>
                <div class="input">
                    <span>BG image</span>
                    <input type="text" oninput="inputHandler(this)" data-typeData="bgImageMobile" value="${effectObj[i + 1].typeData.bgImageMobile == undefined ? "" : effectObj[i + 1].typeData.bgImageMobile}">
                </div>
            </div>
            `;
            newAccordionContent.appendChild(newInput);
        }

        // default
        if (effectObj[i + 1].type !== "styling") {
            newSlot.appendChild(newAccordionContent);
        }
        newPanel.appendChild(newSlot);
    }

    newOuter.appendChild(newInner);
    document.querySelector("body").appendChild(newOuter);
    setTimeout(() => {
        newInner.style.transform = "";
    }, 100);

    // add eventlisteners

    for (let i = 0; i < document.querySelectorAll(`div[data-slot]`).length; i++) {
        document.querySelector(`div[data-slot="${i + 1}"]`).addEventListener("click", handleMouseClick);
    }

    document.querySelector(".control-panel-outer").addEventListener("click", closeControlPanel)

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keydown", eastereggs)

}

function intervalHandler(e) {

    const toggle = document.querySelector("#toggle-interval");

    // get slot number and create wrapper variable
    const slotNum = e.closest("[data-slot]").getAttribute("data-slot");
    const rangeWrapper1 = document.querySelector(`div[data-slot="${slotNum}"] .range-from`)
    const rangeWrapper2 = document.querySelector(`div[data-slot="${slotNum}"] .range-plus`)

    // change max on range 2
    rangeWrapper2.children[1].setAttribute("max", moduleList.length - rangeWrapper1.children[1].value + 1);

    // update number
    rangeWrapper1.children[2].innerHTML = Number(rangeWrapper1.children[1].value);
    rangeWrapper2.children[2].innerHTML = Number(rangeWrapper2.children[1].value);

    // update effectObj
    effectObj[slotNum].typeData.from = Number(rangeWrapper1.children[1].value);
    effectObj[slotNum].typeData.amount = Number(rangeWrapper2.children[1].value);
    effectObj[slotNum].typeData.toggle = toggle.checked;

    // add classes to selected modules
    for (let i = 0; i < moduleList.length; i++) {
        if (i + 2 > Number(rangeWrapper1.children[1].value) && i < (Number(rangeWrapper2.children[1].value) + Number(rangeWrapper1.children[1].value) - 1)) {
            // check show/hide
            !effectObj[slotNum].typeData.toggle ? moduleList[i].classList.remove("interval-hide") : moduleList[i].classList.add("interval-hide")
        } else {
            // check show/hide
            !effectObj[slotNum].typeData.toggle ? moduleList[i].classList.add("interval-hide") : moduleList[i].classList.remove("interval-hide")
        }
    }
}

function switchHandler(e) {

    // get slot number and radio value
    const slotNum = e.closest("[data-slot]").getAttribute("data-slot");
    const selectedColor = e.getAttribute("id");

    // update effectObj
    effectObj[slotNum].typeData.value = selectedColor;

    // console.log(effectObj)

    const moduleWrapper = document.querySelector(getModuleContainerSelector());

    moduleWrapper.setAttribute("grid-color", selectedColor);
}

function inputHandler(e) {
    // get slot number
    const slotNum = e.closest("[data-slot]").getAttribute("data-slot");
    // get data attribute
    const dataAttribute = e.getAttribute("data-typedata");

    // update effectObj
    effectObj[slotNum].typeData[dataAttribute] = e.value;

    // update preview (if input is for preview)
    if (effectObj[slotNum].type === "preview") {
        updatePreviewOverlay();
    }
}

// return module container selector
function getModuleContainerSelector() {

    if (typeof (document.querySelector(".acr-container")) != 'undefined' && document.querySelector(".acr-container") != null) {
        // adobe
        return ".acr-container";
    }

    if (typeof (document.querySelector("div#MASECTION")) != 'undefined' && document.querySelector("div#MASECTION") != null) {
        // selligent
        return "body";
    }

    // default
    return ".min-width";
}

// Handle mouse click
function handleMouseClick(clickTarget) {

    let slotNum = Number(this.getAttribute("data-slot"));
    let slotDOM = this;

    // disabled
    if (slotDOM.classList.contains("disabled")) {
        return;
    }

    let t = clickTarget.target;

    let allSlots = document.querySelectorAll(`div[data-slot]`);
    for (let i = 0; i < allSlots.length; i++) {
        if (allSlots[i] !== t.closest("[data-slot]")) {
            allSlots[i].classList.remove("open");
        }
    }

    if (!t.closest(".accordion-content") && !t.classList.contains("accordion-arrow")) {
        runEffects(slotNum, slotDOM)
    }
}

// Handle key down
function handleKeyDown(e) {

    // ignore if input is selected
    if (e.target.nodeName === "INPUT") {
        return;
    }

    if (Number(e.key) > 0 && Number(e.key) < (Object.keys(effectObj).length + 1)) {
        let slotNum = Number(e.key);
        let slotDOM = document.querySelector(`div[data-slot="${e.key}"]`);

        // disabled
        if (slotDOM.classList.contains("disabled")) {
            return;
        }

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
    if (parm === "Escape" || parm.target === document.querySelector(".control-panel-outer")) {

        // remove eventlisteners
        for (let i = 0; i < document.querySelectorAll(`div[data-slot]`).length; i++) {
            document.querySelector(`div[data-slot="${i + 1}"]`).removeEventListener("click", handleMouseClick);
        }
        document.querySelector(".control-panel-outer").removeEventListener("click", closeControlPanel)
        window.removeEventListener("keydown", handleKeyDown)

        // re-add konami listener
        window.addEventListener("keydown", konami);

        // remove easteregg listener
        window.removeEventListener("keydown", eastereggs);

        // remove panel
        if (parm === "Escape" || parm.target === document.querySelector(".control-panel-outer")) {
            document.querySelector(".control-panel-inner").style.transform = "translateX(-100%)";
            setTimeout(() => {
                document.querySelector(".control-panel-outer").remove()
            }, 200);
        }

        // set local storage
        localStorage.setItem("EmailFrontendTool_DataObj", JSON.stringify(effectObj))

    }
}

// Add effects
function runEffects(slotNum, slotDOM) {
    // console.log("TEST", slotNum, slotDOM)

    const moduleWrapper = document.querySelector(getModuleContainerSelector());

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
    } else if (effectObj[slotNum].name === "Inspector") {
        if (effectObj[slotNum].on) {
            hoverInspect();
        } else {
            hoverInspect("off");
        }
    } else if (effectObj[slotNum].name === "Remove content-editable") {
        if (effectObj[slotNum].on) {
            let editableList = document.querySelectorAll("[contenteditable='true']");
            for (let i = 0; i < editableList.length; i++) {
                editableList[i].setAttribute("contenteditable", "overwrite-disable")
            }
        } else {
            let editableList = document.querySelectorAll("[contenteditable='overwrite-disable']");
            for (let i = 0; i < editableList.length; i++) {
                editableList[i].setAttribute("contenteditable", "true")
            }
        }
    } else if (effectObj[slotNum].name === "Dark mode") {
        if (effectObj[slotNum].on) {
            darkmode()
        } else {
            darkmode("off")
        }
    } else if (effectObj[slotNum].name === "Selligent dynamic") {
        if (effectObj[slotNum].on) {
            selligentDynamic()
        } else {
            selligentDynamic("off")
        }
    } else if (effectObj[slotNum].name === "Marketo defaults") {
        if (effectObj[slotNum].on) {
            marketoDefaultValues(slotNum);
            closeControlPanel("Escape");
            document.querySelector(".control-panel-button").addEventListener("click", showControlPanel);
        } else {
            closeControlPanel("Escape");
            location.reload();
        }
    } else if (effectObj[slotNum].name === "Preview overlay") {
        if (effectObj[slotNum].on) {
            previewOverlay()
        } else {
            previewOverlay("off")
        }
    }

}

// Link list
function getLinklist() {
    const linkList = document.querySelectorAll("a");
    let linkObj = {}
    let linkArr = [];

    let emptyLinksAmount = 0;

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

        linkList[i].href.replace(window.location.href, "") === "#" ? emptyLinksAmount++ : null;
    }
    console.log(`%c Link list: ${Object.keys(linkObj).length} %c Empty Links: ${emptyLinksAmount}`, 'background: #aaca85; color: #000000; padding: 6px; border-radius: 4px; margin-right: 10px;', 'background: #c93737; color: #FFFFFF; padding: 6px; border-radius: 4px;', "\n", linkObj)
}

// Hover Inspect
function hoverInspect(toggle) {
    if (toggle !== "off") {
        window.addEventListener('mouseover', hoverInspect_On, false);
        window.addEventListener('mouseout', hoverInspect_Off, false);
    } else {
        window.removeEventListener('mouseover', hoverInspect_On, false);
        window.removeEventListener('mouseout', hoverInspect_Off, false);
    }

}
function hoverInspect_On(e) {
    if (e.target.closest(".min-width") !== null && !e.target.classList.contains("highlight-info")) {
        hoverInspect_AddHighlight(e.target);
    }
}
function hoverInspect_Off(e) {
    if (e.target.closest(".min-width") !== null && !e.target.classList.contains("highlight-info")) {
        hoverInspect_RemoveHighlight(e.target);
    }
}
function hoverInspect_AddHighlight(e) {
    let targetContainer = e.tagName === "IMG" ? e.parentNode : e;

    targetContainer.classList.add('highlighted');

    if (targetContainer.tagName === "A") {
        targetContainer.style.display = "inline-block";
    }

    let newDiv = document.createElement("div");
    newDiv.classList.add("highlight-info");
    let inner = "";
    let addHighlight = false;

    if (e.getAttribute("class") && e.classList.length > 1) {
        inner += "<b>Class</b><br>";
        inner += e.getAttribute("class").replace("highlighted", "").split(";").join("<br>");
        inner += "<br>"
        addHighlight = true;
    }

    if (e.getAttribute("style")) {
        inner += "<b>Style</b><br>";
        inner += e.getAttribute("style").split(";").join("<br>");
        addHighlight = true;
    }

    if (addHighlight) {
        newDiv.innerHTML = inner;
        targetContainer.appendChild(newDiv);
    }
}
function hoverInspect_RemoveHighlight(e) {

    if (e.tagName !== "IMG") {
        // not image
        if (e.getAttribute("style")) {
            e.querySelector(".highlight-info").remove();
        }
        e.classList.remove('highlighted');

    } else {
        // image
        if (e.parentNode.classList.contains("highlighted")) {
            e.parentNode.querySelector(".highlight-info").remove();
        }
        e.parentNode.classList.remove('highlighted');

    }
}

// Dark Mode 
function darkmode(toggle) {
    if (toggle !== "off") {
        document.querySelector("body").classList.add("darkmode");

        let newDarkmode = document.createElement("div");
        newDarkmode.classList.add("darkmode-feature");

        let newDarkmodeBackground = document.createElement("div");
        newDarkmodeBackground.classList.add("darkmode-background");

        let newDarkmodeLayer = document.createElement("div");
        newDarkmodeLayer.classList.add("darkmode-layer");

        newDarkmode.appendChild(newDarkmodeBackground);
        newDarkmode.appendChild(newDarkmodeLayer);

        // document.body.appendChild(newDarkmode);
        document.body.insertBefore(newDarkmode, document.body.firstChild);

    } else {
        document.querySelector("body").classList.remove("darkmode");
        document.querySelector(".darkmode-feature").remove();
    }
}
function isolateImages(e) {

    // get slot number and radio value
    const slotNum = e.closest("[data-slot]").getAttribute("data-slot");

    // update effectObj
    effectObj[slotNum].typeData.toggle = e.checked;

    if (e.checked === true) {
        document.querySelector("body").classList.add("isolate-img");
    } else {
        document.querySelector("body").classList.remove("isolate-img");
    }
}

// Selligent Dynamic
function selligentDynamic(toggle) {
    if (toggle !== "off") {
        document.querySelector("body").classList.add("selligent-dynamic");

        const macMaxChars = 30;

        const macs = document.querySelectorAll("div#MASECTION, div#MACONTAINER");
        for (let i = 0; i < macs.length; i++) {
            let value = macs[i].getAttribute("maconstraint");

            if (!macs[i].getAttribute("maconstraint") && macs[i].getAttribute("maparameter")) {
                value = macs[i].getAttribute("maparameter");
            }

            if (value === `ATTRIBUTES_3.ATTRIBUTEVALUE = 9`) {
                value = "SOHO"
            } else if (value === `ATTRIBUTES_3.ATTRIBUTEVALUE <> 9`) {
                value = "NON-SOHO"
            } else if (value === `ACCOUNT.HASCLUBCARD = 1`) {
                value = "CLUBCARD"
            } else if (value === `ACCOUNT.HASCLUBCARD <> 1` || value === `ACCOUNT.HASCLUBCARD = 0`) {
                value = "NON-CLUBCARD"
            } else if (value === `ATTRIBUTES_3.ATTRIBUTEVALUE = 9`) {
                value = "SOHO"
            } else {
                value = value.slice(0, macMaxChars) + (value.length > macMaxChars ? "..." : "");
            }

            macs[i].setAttribute("data-before", value)
        }

    } else {
        document.querySelector("body").classList.remove("selligent-dynamic");
    }
}

// Marketo Default Values
function marketoDefaultValues(slotNum) {
    const mktoMetas = document.querySelectorAll(`meta[mktoname]`);
    const htmlWrapper = document.querySelector("body");
    let regex;

    for (let i = 0; i < mktoMetas.length; i++) {
        const meta = mktoMetas[i];
        const id = meta.getAttribute("id");
        let value = meta.getAttribute("default");
        if (meta.getAttribute("units")) {
            value = value + meta.getAttribute("units");
        }
        if (meta.classList.contains("mktoBoolean")) {
            let true_value = meta.getAttribute("true_value");
            let false_value = meta.getAttribute("false_value");
            if (effectObj[slotNum].typeData.toggle) {
                value = true_value;
            } else {
                value = false_value;
            }
        }

        regex = new RegExp(`\\$\\{${id}\\}`, "gi");
        htmlWrapper.innerHTML = htmlWrapper.innerHTML.replace(regex, value);
    }
}

function marketoBooleanToggle(e) {
    // get slot number and radio value
    const slotNum = e.closest("[data-slot]").getAttribute("data-slot");
    // update effectObj
    effectObj[slotNum].typeData.toggle = e.checked;
}

// Add Preview Overlay
function previewOverlay(toggle) {
    let overlay = document.querySelector(".preview-overlay");
    let overlayStyle = document.querySelector(".preview-overlay-style");
    if (toggle !== "off") {
        document.body.classList.add("overlay");
        updatePreviewOverlay()
    } else {
        document.body.classList.remove("overlay");
        overlay ? overlay.remove() : null;
        overlayStyle ? overlayStyle.remove() : null;
    }
}
// Update Preview Overlay
function updatePreviewOverlay() {
    if (!document.body.classList.contains("overlay")) {
        return;
    }
    let overlay = document.querySelector(".preview-overlay");
    let overlayStyle = document.querySelector(".preview-overlay-style");
    // remove current preview overlay
    overlay ? overlay.remove() : null;
    overlayStyle ? overlayStyle.remove() : null;

    let style = `
    .preview-overlay {
        opacity: [opacity];
        background-image: url([bgImageDesktop]);
        height: [heightDesktop]px;
        width: [widthDesktop]px;
        top: [topDesktop]px;
    }
    @media screen and (max-device-width: [breakpoint]px),
    screen and (max-width: [breakpoint]px) {
        .preview-overlay {
            background-image: url([bgImageMobile]);
            height: [heightMobile]px;
            width: [widthMobile]px;
            top: [topMobile]px;
        }
    }`;

    // replace input variables with numbered variables
    const regArr = ["opacity", "breakpoint", "bgImageDesktop", "bgImageMobile", "heightDesktop", "heightMobile", "widthDesktop", "widthMobile", "topDesktop", "topMobile"];
    for (let i = 0; i < regArr.length; i++) {
        let regex = new RegExp(`\\[${regArr[i]}\\]`, "gi");
        style = style.replace(regex, `${effectObj[11].typeData[regArr[i]]}`);
    }

    let newStyle = document.createElement("style");
    newStyle.setAttribute("type", "text/css");
    newStyle.classList.add("preview-overlay-style");
    newStyle.innerHTML = style;

    let newOverlay = document.createElement("div");
    newOverlay.classList.add("preview-overlay");

    document.querySelector("body").appendChild(newStyle);
    document.querySelector("body").appendChild(newOverlay);
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
                effectObj[i + 1].typeData.toggle = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].typeData.toggle;
            }

            // get switch status from localstorage
            if (effectObj[i + 1].type === "switch") {
                effectObj[i + 1].typeData.value = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].typeData.value;
            }

            // get toggle status from localstorage
            if (effectObj[i + 1].type === "toggle") {
                effectObj[i + 1].typeData.toggle = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].typeData.toggle;
            }

            // preview overlay (custom)
            if (effectObj[i + 1].type === "preview") {
                effectObj[i + 1].typeData = JSON.parse(localStorage.getItem("EmailFrontendTool_DataObj"))[i + 1].typeData;
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
                !effectObj[3].typeData.toggle ? moduleList[i].classList.remove("interval-hide") : moduleList[i].classList.add("interval-hide")
            } else {
                !effectObj[3].typeData.toggle ? moduleList[i].classList.add("interval-hide") : moduleList[i].classList.remove("interval-hide")
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

        // if remove contenteditable
        if (effectObj[7] !== undefined && effectObj[7].on) {
            let editableList = document.querySelectorAll("[contenteditable='true']");
            for (let i = 0; i < editableList.length; i++) {
                editableList[i].setAttribute("contenteditable", "overwrite-disable")
            }
        }

        // if darkmode
        if (effectObj[8] !== undefined && effectObj[8].on) {
            darkmode();
            if (effectObj[8].typeData.toggle) {
                document.querySelector("body").classList.add("isolate-img");
            }
        }

        // if selligent dynamic
        if (effectObj[9] !== undefined && effectObj[9].on) {
            selligentDynamic();
        }

        // if marketo defaults
        if (effectObj[10] !== undefined && effectObj[10].on) {
            marketoDefaultValues(10);
            document.querySelector(".control-panel-button").addEventListener("click", showControlPanel);
        }

        // if preview overlay
        if (effectObj[11] !== undefined && effectObj[11].on) {
            previewOverlay()
        }

    } else {
        localStorage.removeItem('EmailFrontendTool_DataObj');
    }
}
addFromLocalStorage()

// EASTER EGG
const policeEgg = [9, 1, 1];
let policePressedArr = []
function eastereggs(e) {
    if (Number(e.key) === policeEgg[policePressedArr.length]) {
        policePressedArr.push(Number(e.key));
        if (policeEgg[policePressedArr.length] == policePressedArr[policeEgg.length]) {
            window.removeEventListener("keydown", eastereggs);
            document.querySelector(".control-panel-outer").classList.add("police");
            policePressedArr = [];
        }
    } else {
        policePressedArr = [];
        if (Number(e.key) === policeEgg[policePressedArr.length]) {
            policePressedArr.push(Number(e.key));
        }
    }
}