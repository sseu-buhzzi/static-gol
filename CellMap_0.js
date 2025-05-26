function GetClient() {
    return [(
        window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
    ) - 32, (
        window.innerHeight ||
        document.documentElement.clientHeight
        || document.body.clientHeight
    ) - 128];
}


function GetColorFromNeighborhood(neighbor) {
    switch (neighbor) {
        case 0:
            return `#3F003F`;
        case 1:
            return `#00077F`;
        case 2:
            return `#007FFF`;
        case 3:
            return `#0FFF00`;
        case 4:
            return `#FFFF00`;
        case 5:
            return `#FF7F00`;
        case 6:
            return `#FF0000`;
        case 7:
            return `#7F0000`;
    }
}


const input_width = document.getElementById("input-width");
const input_height = document.getElementById("input-height");
const input_size = document.getElementById("input-size");
const slider_elapse = document.getElementById("slider-elapse");

const DEAD_CELL_COLOR = `#000`;


var [width, height] = GetClient();
var size = 16;
var hNumb = Math.floor(width / size), vNumb = Math.floor(height / size);
var intervalID, intervalElapse = slider_elapse.value;
var iMouse, jMouse, hasMouseMoved, isMouseInCellMap;

var cellMap;


// var gridStyleClass = document.createElement("style");
// gridStyleClass.innerHTML = `
//     .grid-container {
//         width: ${width}px;
//         height: ${height}px;
//         display: grid;
//         grid-template-columns: repeat(${hNumb}, ${size}px);
//         grid-template-rows: repeat(${vNumb}, ${size}px);
//     }
//     .grid-item {
//         width: ${size}px;
//         height: ${size}px;
//         background-color: #ffffff;
//         border-radius: 37.5%;
//         border: 1px solid #000000;
//     }
// `;
// document.head.appendChild(gridStyleClass);
document.addEventListener("mousemove", function(event) {
    isMouseInCellMap = ["grid-container", "grid-item"].includes(event.target.className);
    if (!isMouseInCellMap) {
        iMouse = null;
        jMouse = null;
        hasMouseMoved = true;
        ShowColors();
    }
    // console.log(iMouse, jMouse);
    //console.log("this");
    // console.log(event.target);
    // console.log(this);
    // console.log(isMouseInCellMap);
})


var gridContainer = document.createElement("div");
gridContainer.className = "grid-container";
gridContainer.style.cssText = `
    width: ${size * hNumb + 1}px;
    height: ${size * vNumb + 1}px;
    display: grid;
    grid-template-columns: repeat(${hNumb}, ${size}px);
    grid-template-rows: repeat(${vNumb}, ${size}px);
`;
document.body.appendChild(gridContainer);


function InitColors() {
    cellMap = [];
    for (let i = 0; i < vNumb; ++i) {
        cellMap.push([]);
        for (let j = 0; j < hNumb; ++j) {
            cellMap[i].push(0);
        }
    }
    gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = ``;
    gridContainer.style.cssText = `
        width: ${size * hNumb + 1}px;
        height: ${size * vNumb + 1}px;
        display: grid;
        background-color: ${DEAD_CELL_COLOR};
        grid-template-columns: repeat(${hNumb}, ${size}px);
        grid-template-rows: repeat(${vNumb}, ${size}px);
    `;

    //console.log(gridContainer);

    for (let i = 0; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
            // 創建格子元素
            let item = document.createElement("div");
            item.className = "grid-item";
            item.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background-color: ${DEAD_CELL_COLOR};
                border-radius: 37.5%;
                border: 1px solid ${DEAD_CELL_COLOR};
            `;
            // // 设置动画
            // item.style.animation = 'grow 4000';

            // // 设置关键帧动画
            // item.style.animationName = 'grow';
            // item.style.animationDuration = '4000';
            // item.style.animationIterationCount = "infinite";

            // // 设置关键帧
            // item.style.animationKeyframes = `
            //     @keyframes grow {
            //         0% {
            //             width: 0;
            //             height: 0;
            //         }
            //         100% {
            //             width: ${size}px;
            //             height: ${size}px;
            //         }
            //     }
            // `;
            // item.style.appendChild(document.createTextNode(growKeyframes));
            item.addEventListener("mousemove", function() {
                //console.log(isMouseInCellMap);
                if (!isMouseInCellMap) {
                    // iMouse = null;
                    // jMouse = null;
                    // hasMouseMoved = true;
                    return;
                }
                if (i == iMouse && j == jMouse) {
                    return;
                }
                iMouse = i;
                jMouse = j;
                hasMouseMoved = true;
                ShowColors();
                mousePreCreate();
            });
            item.addEventListener("click", function() {
                                                        // console.log(event);
                if (!isMouseInCellMap) {
                    return;
                }
                if (iMouse == null || jMouse == null) {
                    return;
                }
                cellMap[iMouse][jMouse] ^= 8;
                ShowColors();
            });
            gridContainer.appendChild(item);
        }
    }
}


InitColors();


document.addEventListener("keydown", function(event) {
        // console.log(event);
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        let movedCoord = (iMouse ?? Math.floor(vNumb / 2)) * hNumb + (jMouse ?? Math.floor(hNumb / 2));
        switch (event.code) {
            case "ArrowLeft":
                if (jMouse > 0) {
                    --movedCoord;
                }
            break;
            case "ArrowRight":
                if (jMouse < hNumb - 1) {
                    ++movedCoord;
                }
            break;
            case "ArrowUp":
                if (iMouse > 0) {
                    movedCoord -= hNumb;
                }
            break;
            case "ArrowDown": 
                if (iMouse < vNumb - 1) {
                    movedCoord += hNumb;
                }
        }
            // console.log(movedCoord);
        let movedItem = document.querySelectorAll(".grid-item")?.[movedCoord];
        let movedRect = movedItem?.getBoundingClientRect();
        movedItem?.dispatchEvent(new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: movedRect.left + movedRect.width / 2,
            clientY: movedRect.top + movedRect.height / 2
        }));
    } else if (event.code == "Space") {
        if (!isMouseInCellMap) {
            return;
        }
        if (iMouse == null || jMouse == null) {
            return;
        }
        cellMap[iMouse][jMouse] ^= 8;
        ShowColors();
    }
});

//console.log(cellMap);
// var cellMap = [];
// for (let i = 0, j; i < vNumb; ++i) {
//     cellMap.push([]);
//     for (j = 0; j < hNumb; ++j) {
//         cellMap[i].push(0);
//     }
// }


// for (let i = 0; i < vNumb; i++) {
//     for (let j = 0; j < hNumb; j++) {
//         let color = cellMap[i][j] & 8 ?
//         GetColorFromNeighborhood(cellMap[i][j] & 7) :
//         `#000`;
//         // 創建格子元素
//         let item = document.createElement('div');
//         item.className = 'grid-item';
//         item.style.backgroundColor = color;
//         document.querySelector('.grid-container').appendChild(item);
//     }
// }


function ShowColors() {
    for (let i = 0; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
            if (cellMap[i][j] & 8) {
                for (let di = i - 1; di < i + 2; ++di) {
                    for (let dj = j - 1; dj < j + 2; ++dj) {
                        if (di == i && dj == j) continue;
                        if (cellMap?.[di]?.[dj] !== undefined) {
                            (cellMap[di][dj] & 7) != 7 ?
                            ++cellMap[di][dj] :
                            cellMap[di][dj] &= 8;
                        }
                    }
                }
            }
        }
    }
    let items = document.querySelectorAll(".grid-item");
    for (let i = 0, j, color; i < vNumb; ++i) {
        for (j = 0; j < hNumb; ++j) {
            color = cellMap[i][j] & 8 ?
            GetColorFromNeighborhood(cellMap[i][j] & 7) :
            DEAD_CELL_COLOR;
            cellMap[i][j] &= 8;
            items[i * hNumb + j].style["background-color"] = color;
            // if (i == iMouse && j == jMouse) {
            //     items[i * hNumb + j].style["background-color"] = `#000`;
            // }
        }
    }
    mousePreCreate();
}


function Involve() {
    for (let i = 0; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
//console.log(`[${i}][${j}]: ${cellMap[i][j] & 8}`);
            if (cellMap[i][j] & 8) {
                for (let di = i - 1; di < i + 2; ++di) {
                    for (let dj = j - 1; dj < j + 2; ++dj) {
                        if (di == i && dj == j) continue;
        //console.log(cellMap[i], di, dj);
    //console.log(`[${di}][${dj}]: ${cellMap?.[di]?.[dj]}`);
                        if (cellMap?.[di]?.[dj] !== undefined) {
                            (cellMap[di][dj] & 7) != 7 ?
                            ++cellMap[di][dj] :
                            cellMap[di][dj] &= 8;
                        }
                    }
                }
            }
//console.log(cellMap[i][j]);
        }
    }
    for (let i = 0, j; i < vNumb; ++i) {
        for (j = 0; j < hNumb; ++j) {
//console.log("i, 94: ", i, cellMap[0], cellMap[0]);
            switch (cellMap[i][j] & 7) {
                case 2:
                    cellMap[i][j] &= 8;
                    break;
                case 3:
                    cellMap[i][j] = 8;
    //console.log(i, j);
                    break;
                default:
                    cellMap[i][j] = 0;
            }
//console.log(`[${i}][${j}]: ${cellMap[i][j] & 7}`);
        }
    }
    ShowColors();
}

function GenerateColors() {
    Involve();
}

function UpdateColors() {
    if (intervalID ?? false) {
        document.getElementById("button-steps").classList.remove("pressed");
        clearInterval(intervalID);
        intervalID = null;
    } else {
        document.getElementById("button-steps").classList.add("pressed");
        intervalID = setInterval(Involve, intervalElapse);
    }
    //setInterval(Involve, 0);
    /* return;
    let items = document.querySelectorAll('.grid-item');
    let intervalId = setInterval(function() {
        for (let i = 0; i < items.length; i++) {
            let color = GetColorFromNeighborhood((i * Math.random()) & 7);
            items[i].style.backgroundColor = color;
        }
    }, 1000); */
}


function ClearColors() {
            //console.log("pressed");

    let [new_width, new_height] = GetClient(), new_size = size;
    let match;
    if (match = input_width.value.match(/^\s*(\d+)\s*(px)?\s*$/)) {
        new_width = parseInt(match[1], 10);
    } else if (match = input_width.value.match(/^\s*(\d+)\s*%\s*$/)) {
        new_width *= parseInt(match[1], 10) / 100;
    } else {
        input_width.value = `${new_width}px`;
    }
    if (match = input_height.value.match(/^\s*(\d+)\s*(px)?\s*$/)) {
        new_height = parseInt(match[1], 10);
    } else if (match = input_width.value.match(/^\s*(\d+)\s*%\s*$/)) {
        new_height *= parseInt(match[1], 10) / 100;
    } else {
        input_height.value = `${new_height}px`;
    }
    if (match = input_size.value.match(/^\s*(\d+)\s*(px)?\s*$/)) {
        new_size = parseInt(match[0], 10);
    } else if (match = input_size.value.match(/^\s*(\d+)\s*%\s*$/)) {
        new_size = Math.min(new_width, new_height) * parseInt(match[1], 10) / 100;
    } else {
        input_size.value = `${new_size}px`;
    }
            
        //  console.log("w: " + width);
        //  console.log("h: " + height);
        //  console.log("s: " + size);

    if (new_width != width || new_height != height || new_size != size) {
        width = new_width;
        height = new_height;
        size = new_size;
        hNumb = Math.floor(width / size);
        vNumb = Math.floor(height / size);
        //  console.log("w: " + width);
        //  console.log("h: " + height);
        //  console.log("s: " + size);
        InitColors();
    }
    if (slider_elapse.value != intervalElapse) {
        clearInterval(intervalID);
        intervalID = setInterval(Involve, intervalElapse = slider_elapse.value);
    }
    for (let i = 0; i < vNumb; ++i) {
        for (let j = 0; j < hNumb; ++j) {
            cellMap[i][j] = 0;
        }
    }
    ShowColors();
}


function RandomColors() {
    for (let i = 0, j; i < vNumb; ++i) {
        for (j = 0; j < hNumb; ++j) {
            cellMap[i][j] = 8 * (Math.random() < 0.5);
        }
    }
    ShowColors();
}


function mousePreCreate() {
    // let label = document.querySelector("#label");
    // label.innerHTML = `Row: ${iMouse}<br>COl: ${jMouse}`;
                //console.log(hasMouseMoved);
    // if (!hasMouseMoved) {
    //     return;
    // }
    //ShowColors();  // 新的問題：ShowColors似乎在滑動條改變後一直執行
                        // console.log("show colors");
                        // console.log(isMouseInCellMap);  // 問題：isMouseInCellMap恆爲true
    if (!isMouseInCellMap) {
        return;
    }
    if (iMouse == null || jMouse == null) {
        return;
    }
    
    document.querySelectorAll(".grid-item")[iMouse * hNumb + jMouse].style["background-color"] = `#fff`;

    hasMouseMoved = false;
}


// function mouseCreate() {
//     if (!isMouseInCellMap) {
//         return;
//     }
//     if (iMouse == null || jMouse == null) {
//         return;
//     }

//     cellMap[iMouse][jMouse] ^= 8;
//     ShowColors();
// }


//var mouseIntervalID = setInterval(mousePreCreate, intervalElapse);


function ChangeElapse() {
    intervalElapse = slider_elapse.value;
    slider_elapse.parentElement.querySelector("label").innerText = `${intervalElapse / 1000}s`;
    clearInterval(intervalID);
    //clearInterval(mouseIntervalID);
    intervalID = setInterval(Involve, intervalElapse);
    //mouseIntervalID = setInterval(mousePreCreate, intervalElapse);
}
