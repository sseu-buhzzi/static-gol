function GetClient() {
    return [(
        window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
    ) - 16, (
        window.innerHeight ||
        document.documentElement.clientHeight
        || document.body.clientHeight
    ) - 256];
}


function GetColorFromNeighborhood(neighbor) {
    switch (neighbor) {
        case 0:
            return `#3F003FFF`;
        case 1:
            return `#00077FFF`;
        case 2:
            return `#007FFFFF`;
        case 3:
            return `#0FFF00FF`;
        case 4:
            return `#FFFF00FF`;
        case 5:
            return `#FF7F00FF`;
        case 6:
            return `#FF0000FF`;
        case 7:
            return `#7F0000FF`;
    }
}


document.addEventListener("mousemove", function(event) {
    
    // isMouseInCellMap = ["grid-container", "grid-item"].includes(event.target.className);
    
    isMouseInCellMap = [event.target?.id, event.target.parentElement?.id].includes("playground")
    if (!isMouseInCellMap) {
        iMouse = null;
        jMouse = null;
        hasMouseMoved = true;
        ShowColors(playground);
    }
})


document.addEventListener("keydown", function(event) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        let iMoved = iMouse ?? Math.floor(vNumb / 2), jMoved = jMouse ?? Math.floor(hNumb / 2);
        // let movedCoord = (iMouse ?? Math.floor(vNumb / 2)) * hNumb + (jMouse ?? Math.floor(hNumb / 2));
        switch (event.code) {
            case "ArrowLeft":
                if (jMoved > 0) {
                    --jMoved;
                }
            break;
            case "ArrowRight":
                if (jMoved < hNumb - 1) {
                    ++jMoved;
                }
            break;
            case "ArrowUp":
                if (iMoved > 0) {
                    --iMoved;
                }
            break;
            case "ArrowDown": 
                if (iMoved < vNumb - 1) {
                    ++iMoved;
                }
        }
        let movedItem = document.querySelectorAll(".grid-item")?.[iMoved * Math.floor(width / size / zoom) + jMoved];
        let movedRect = movedItem?.getBoundingClientRect();
        movedItem?.dispatchEvent(new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: movedRect.left + movedRect.width / 2,
            clientY: movedRect.top + movedRect.height / 2
        }));
    } else if (event.code == "Space") {
        MouseCreate();
    }
});


function MousePreCreate() {
    if (!isMouseInCellMap) {
        return;
    }
    if (iMouse == null || jMouse == null) {
        return;
    }
    
    document.querySelectorAll(".grid-item")[iMouse * Math.floor(width / size / zoom) + jMouse].style["background-color"] = `#fff`;

    hasMouseMoved = false;

    // console.log(iMouse, jMouse);
}


function MouseCreate() {
    if (!isMouseInCellMap) {
        return;
    }
    if (iMouse == null || jMouse == null) {
        return;
    }
    playground.cellMap[iMouse + iShift][jMouse + jShift] ^= 8;

                    // console.log(iMouse + iShift, jMouse + jShift);

    ShowColors(playground);
}


class Cells {
    constructor() {
        this.container = null;
    }
}


// var newCellMap;
function InitColors(scope) {
    let newCellMap = [];
    for (let i = 0; i < vNumb; ++i) {
        newCellMap.push([]);
        for (let j = 0; j < hNumb; ++j) {
            newCellMap[i].push(scope.cellMap?.[i]?.[j] ?? 0);

                                    // console.log(newCellMap);
        }
    }
    scope.cellMap = newCellMap;
                                        // console.log(newCellMap);
    
                        // playgroundContainer = document.querySelector(".grid-container");
    
    // playgroundContainer = document.getElementById("playground");
    playgroundContainer.innerHTML = ``;
    playgroundContainer.style.cssText = `
        width: ${size * hNumb + 1}px;
        height: ${size * vNumb + 1}px;
        display: grid;
        background-color: ${"#444"};
        grid-template-columns: repeat(${Math.floor(width / size / Math.max(zoom, 1))}, ${size * zoom}px);
        grid-template-rows: repeat(${Math.floor(height / size / Math.max(zoom, 1))}, ${size * zoom}px);
    `;
    for (let i = 0; i < Math.floor(height / size / Math.max(zoom, 1)); ++i) {
        for (let j = 0; j < Math.floor(width / size / Math.max(zoom, 1)); ++j) {
            let item = document.createElement("div");
            item.className = "grid-item";
            item.style.cssText = `
                width: ${size * zoom}px;
                height: ${size * zoom}px;
                background-color: ${DEAD_CELL_COLOR};
                border-radius: 37.5%;
                border: 1px solid ${DEAD_CELL_COLOR};
            `;
            item.addEventListener("mousemove", function() {
                if (!isMouseInCellMap) {
                    return;
                }
                if (i == iMouse && j == jMouse) {
                    return;
                }
                iMouse = i;
                jMouse = j;
                hasMouseMoved = true;
                ShowColors(scope);
                MousePreCreate();
            });
            item.addEventListener("click", MouseCreate);
            playgroundContainer.appendChild(item);
        }
    }
}


function ShowColors(scope) {
    for (let i = 0; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
            if (scope.cellMap[i][j] & 8) {
                for (let di = i - 1; di < i + 2; ++di) {
                    for (let dj = j - 1; dj < j + 2; ++dj) {
                        if (di == i && dj == j) continue;
                        if (scope.cellMap?.[di]?.[dj] == null) {
                            continue;
                        }
                        (scope.cellMap[di][dj] & 7) != 7 ?
                        ++scope.cellMap[di][dj] :
                        scope.cellMap[di][dj] &= 8;
                    }
                }
            }
        }
    }

                // console.log(cellMap);

    let items = document.querySelectorAll(".grid-item");
    for (let i = 0/* , color */; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
            if (scope.cellMap?.[i]?.[j] == null) {
                continue;
            }
            if (
                i >= iShift && j >= jShift
                && i < iShift + Math.floor(height / size / zoom) && j < jShift + Math.floor(width / size / zoom)
            ) {
                items[(i - iShift) * Math.floor(width / size /  zoom) + j - jShift].style["background-color"] = scope.cellMap[i][j] & 8 ?
                GetColorFromNeighborhood(scope.cellMap[i][j] & 7) :
                DEAD_CELL_COLOR;
            }
            // color = cellMap[i][j] & 8 ?
            // GetColorFromNeighborhood(cellMap[i][j] & 7) :
            // DEAD_CELL_COLOR;
            scope.cellMap[i][j] &= 8;
            // items[i * Math.floor(width / size / zoom) + j].style["background-color"] = color;
        }
    }
    MousePreCreate();
}


function Involve(scope) {
                // console.log("StartInvolve\n___\n___\n___");

    for (let i = 0; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
            if (scope.cellMap[i][j] & 8) {
                for (let di = i - 1; di < i + 2; ++di) {
                    for (let dj = j - 1; dj < j + 2; ++dj) {
                        if (di == i && dj == j) continue;
                        if (scope.cellMap?.[di]?.[dj] == null) {
                            continue;
                        }
                        (scope.cellMap[di][dj] & 7) != 7 ?
                        ++scope.cellMap[di][dj] :
                        scope.cellMap[di][dj] &= 8;
                    }
                }
            }
                // console.log(scope.cellMap[i][j]);
        }
    }

                // console.log(scope.cellMap);

    for (let i = 0, j; i < vNumb; ++i) {
        for (j = 0; j < hNumb; ++j) {
            switch (scope.cellMap[i][j] & 7) {
                case 2:
                    scope.cellMap[i][j] &= 8;
                    break;
                case 3:
                    scope.cellMap[i][j] = 8;
                    break;
                default:
                    scope.cellMap[i][j] = 0;
            }
        }
    }
    ShowColors(scope);

                // console.log("EndInvolve\n^^^\n^^^\n^^^");
}


function FitScreen(para = null, scope = playground) {
    let [new_width, new_height] = GetClient(), new_size = size;
    if (para != null) {
        if (para != 0) {
            new_width = width;
        }
        if (para != 1) {
            new_height = height;
        }
    }
                            // console.log(para);
                            // console.log((para ?? 0), para ?? 1, para ?? 2);
    let match;
    if ((para ?? 0) == 0) {
        if (match = input_width.value.match(/^\s*(\d+)\s*(px)?\s*$/)) {
            new_width = parseInt(match[1], 10);
        } else if (match = input_width.value.match(/^\s*(\d+)\s*%\s*$/)) {
            new_width *= parseInt(match[1], 10) / 100;
        } else {
            input_width.value = `${new_width}px`;
        }
    }
    if ((para ?? 1) == 1) {
        if (match = input_height.value.match(/^\s*(\d+)\s*(px)?\s*$/)) {
            new_height = parseInt(match[1], 10);
        } else if (match = input_width.value.match(/^\s*(\d+)\s*%\s*$/)) {
            new_height *= parseInt(match[1], 10) / 100;
        } else {
            input_height.value = `${new_height}px`;
        }
    }
    if ((para ?? 2) == 2) {
        if (match = input_size.value.match(/^\s*(\d+)\s*(px)?\s*$/)) {
            new_size = parseInt(match[0], 10);
        } else if (match = input_size.value.match(/^\s*(\d+)\s*%\s*$/)) {
            new_size = Math.min(new_width, new_height) * parseInt(match[1], 10) / 100;
        } else {
            input_size.value = `${new_size}px`;
        }
    }
    
    if (new_width != width || new_height != height || new_size != size) {
        width = new_width;
        height = new_height;
        size = new_size;
        hNumb = Math.floor(width / size);
        vNumb = Math.floor(height / size);

        // console.log(size);

        InitColors(scope);
    }
    ShowColors(scope);

}


function ClearColors(scope = playground) {
    input_width.value = "";
    input_height.value = "";
    input_size.value = "";
    for (let i = 0; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
            // cellMap[i][j] = 0;
            scope.cellMap[i][j] = 0;
        }
    }
    ShowColors(scope);
}


function RandomColors(scope = playground) {
    for (let i = 0, j; i < vNumb; ++i) {
        for (j = 0; j < hNumb; ++j) {
            // cellMap[i][j] = 8 * (Math.random() < 0.5);
            
            scope.cellMap[i][j] = 8 * (Math.random() < 0.5);
        }
    }
    ShowColors(scope);
}


function GenerateColors(scope = playground) {
    Involve(scope);
}


function UpdateColors(scope = playground) {
    if (intervalID ?? false) {
        document.getElementById("button-steps").classList.remove("pressed");
        clearInterval(intervalID);
        intervalID = null;
    } else {
        document.getElementById("button-steps").classList.add("pressed");
        intervalID = setInterval(Involve, intervalElapse, scope);
    }
}


function ChangeElapse() {
    intervalElapse = slider_elapse.value;
    slider_elapse.parentElement.querySelector("label").innerText = `${intervalElapse / 1000}s`;
    if (intervalID == null) {
        return;
    }
    clearInterval(intervalID);
    intervalID = setInterval(Involve, intervalElapse);
}


function ZoomInOrOut(mode) {
    let zoom_rate = 1 + 1 / 64;
    let new_zoom;
    switch (mode) {
        case 0:
            new_zoom = 1;
            break;
        case 1:
            new_zoom = zoom * zoom_rate;
            break;
        case 2:
            new_zoom = zoom / zoom_rate;
            if (new_zoom < 1) {
                new_zoom = 1;
            }
    }
    iShift += Math.floor((width / size / zoom - width / size / new_zoom) / 2);
    jShift += Math.floor((height / size / zoom - height / size / new_zoom) / 2);
    zoom = new_zoom;

    if (zoom == 1 || iShift < 0) {
        iShift = 0;
    }
    if (zoom == 1 || jShift < 0) {
        jShift = 0;
    }

                // console.log(iShift, jShift, zoom);

    if (zoom >= 0.01 && zoom <= 100) {
        zoom_info.parentElement.querySelector("label").innerText = `${(zoom * 100).toFixed(2)}%`;
    } else {
        zoom_info.parentElement.querySelector("label").innerText = `${(zoom * 100).toExponential(2)}%`;
    }
    InitColors(playground);
    ShowColors(playground);
}


function VisionShift(direction) {
    switch (direction) {
        case 0:
            iShift = Math.floor((height / size - height / size / zoom) / 2);
            jShift = Math.floor((width / size - width / size / zoom) / 2);
            break;
        case 1:
            if (jShift > 0) {
                --jShift;
            }
            break;
        case 2:
            if (iShift > 0) {
                --iShift;
            }
            break;
        case 3:
            if (jShift < hNumb - Math.floor(width / size / zoom)) {
                ++jShift;
            }
            break;
        case 4:
            if (iShift < vNumb - Math.floor(height / size / zoom)) {
                ++iShift;
            }
    }
    ShowColors(playground);

    // console.log(iShift, jShift);
}


function InitShowcase() {
    playgroundContainer = document.getElementById("showcase");
    playgroundContainer.innerHTML = ``;
    playgroundContainer.style.cssText = `
        width: ${size * hNumb + 1}px;
        height: ${size * vNumb + 1}px;
        display: grid;
        background-color: ${"#444"};
        grid-template-columns: repeat(${Math.floor(width / size / Math.max(zoom, 1))}, ${size * zoom}px);
        grid-template-rows: repeat(${Math.floor(height / size / Math.max(zoom, 1))}, ${size * zoom}px);
    `;
    for (let i = 0; i < Math.floor(height / size / Math.max(zoom, 1)); ++i) {
        for (let j = 0; j < Math.floor(width / size / Math.max(zoom, 1)); ++j) {
            let item = document.createElement("div");
            item.className = "grid-item";
            item.style.cssText = `
                width: ${size * zoom}px;
                height: ${size * zoom}px;
                background-color: ${DEAD_CELL_COLOR};
                border-radius: 37.5%;
                border: 1px solid ${DEAD_CELL_COLOR};
            `;
            item.addEventListener("mousemove", function() {
                if (!isMouseInCellMap) {
                    return;
                }
                if (i == iMouse && j == jMouse) {
                    return;
                }
                iMouse = i;
                jMouse = j;
                hasMouseMoved = true;
                ShowColors(scope);
                MousePreCreate();
            });
            item.addEventListener("click", MouseCreate);
            playgroundContainer.appendChild(item);
        }
    }
}


const input_width = document.getElementById("input-width");
const input_height = document.getElementById("input-height");
const input_size = document.getElementById("input-size");
const slider_elapse = document.getElementById("slider-elapse");
const zoom_info = document.getElementById("rezoom");

const DEAD_CELL_COLOR = `#000`;


var [width, height] = GetClient();
var size = 8;
var hNumb = Math.floor(width / size), vNumb = Math.floor(height / size);
var intervalID, intervalElapse = slider_elapse.value;
var zoom = 1, iShift = 0, jShift = 0;
var iMouse, jMouse, hasMouseMoved, isMouseInCellMap;

var showcaseContainer = document.createElement("div");
showcaseContainer.id = "showcase";
showcaseContainer.className = "grid-container";
document.getElementById("showcase-settings").appendChild(showcaseContainer)

// var cellMap;
var playgroundContainer = document.createElement("div");
playgroundContainer.id = "playground"
playgroundContainer.className = "grid-container";
// playgroundContainer.style.cssText = `
//     width: ${size * hNumb + 1}px;
//     height: ${size * vNumb + 1}px;
//     display: grid;
//     grid-template-columns: repeat(${hNumb}, ${size}px);
//     grid-template-rows: repeat(${vNumb}, ${size}px);
// `;
document.body.appendChild(playgroundContainer);

InitColors(playground);


class Cells {
    constructor(appendPos, id, className) {
        this.container = document.createElement("div");
        this.container.id = id;
        this.container.className = className;
        appendPos.appendChild(this.container);
    }
    InitColors() {
        let newCellMap = [];
        for (let i = 0; i < vNumb; ++i) {
            newCellMap.push([]);
            for (let j = 0; j < hNumb; ++j) {
                newCellMap[i].push(this.cellMap?.[i]?.[j] ?? 0);
    
                                        // console.log(newCellMap);
            }
        }
        this.cellMap = newCellMap;
                                            // console.log(newCellMap);
        
                            // playgroundContainer = document.querySelector(".grid-container");
        
        // playgroundContainer = document.getElementById("playground");
        this.container.innerHTML = ``;
        this.container.style.cssText = `
            width: ${size * hNumb + 1}px;
            height: ${size * vNumb + 1}px;
            display: grid;
            background-color: ${"#444"};
            grid-template-columns: repeat(${Math.floor(width / size / Math.max(zoom, 1))}, ${size * zoom}px);
            grid-template-rows: repeat(${Math.floor(height / size / Math.max(zoom, 1))}, ${size * zoom}px);
        `;
        for (let i = 0; i < Math.floor(height / size / Math.max(zoom, 1)); ++i) {
            for (let j = 0; j < Math.floor(width / size / Math.max(zoom, 1)); ++j) {
                let item = document.createElement("div");
                item.className = "grid-item";
                item.style.cssText = `
                    width: ${size * zoom}px;
                    height: ${size * zoom}px;
                    background-color: ${DEAD_CELL_COLOR};
                    border-radius: 37.5%;
                    border: 1px solid ${DEAD_CELL_COLOR};
                `;
                item.addEventListener("mousemove", function() {
                    if (!isMouseInCellMap) {
                        return;
                    }
                    if (i == iMouse && j == jMouse) {
                        return;
                    }
                    iMouse = i;
                    jMouse = j;
                    hasMouseMoved = true;
                    ShowColors(scope);
                    MousePreCreate();
                });
                item.addEventListener("click", MouseCreate);
                playgroundContainer.appendChild(item);
            }
        }
    }
}