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


class Cells {
    constructor(appendPos, id, className) {
        this.container = document.createElement("div");
        this.container.id = id;
        this.container.className = className;
        appendPos.appendChild(this.container);
        this.intervalElapse = slider_elapse.value;
        this.cursor_tissue = {
            data: [[1]],
            left: 0,
            right: 1,
            top: 0,
            bottom: 1
        };
        this.user_select = true;
    }

    ShowColors() {
        for (let i = 0; i < this.vNumb; ++i) {
            for (let j = 0; j < this.hNumb; ++j) {
                if (this.cellMap[i][j] & 8) {
                    for (let di = i - 1; di < i + 2; ++di) {
                        for (let dj = j - 1; dj < j + 2; ++dj) {
                            if (di == i && dj == j) continue;
                            if (this.cellMap?.[di]?.[dj] == null) {
                                continue;
                            }
                            (this.cellMap[di][dj] & 7) != 7 ?
                            ++this.cellMap[di][dj] :
                            this.cellMap[di][dj] &= 8;
                        }
                    }
                }
            }
        }
        let items = document.querySelectorAll(`.${this.container.id}-item`);
        for (let i = 0; i < this.vNumb; ++i) {
            for (let j = 0; j < this.hNumb; ++j) {
                if (this.cellMap?.[i]?.[j] == null) {
                    continue;
                }
                if (
                    i >= iShift && j >= jShift
                    && i < iShift + Math.floor(this.height / this.size / zoom) && j < jShift + Math.floor(this.width / this.size / zoom)
                ) {
                    items[(i - iShift) * Math.floor(this.width / this.size /  zoom) + j - jShift].style["background-color"] = this.cellMap[i][j] & 8 ?
                    GetColorFromNeighborhood(this.cellMap[i][j] & 7) :
                    DEAD_CELL_COLOR;
                }
                this.cellMap[i][j] &= 8;
            }
        }
    }

    InitColors(width, height, size) {
        if (width != null) {
            this.width = width;
        }
        if (height != null) {
            this.height = height;
        }
        if (size != null) {
            this.size = size;
        }
        if (width != null || height != null || size != null) {
            this.hNumb = Math.floor(this.width / this.size);
            this.vNumb = Math.floor(this.height / this.size);
        }
        let newCellMap = [];
        for (let i = 0; i < this.vNumb; ++i) {
            newCellMap.push([]);
            for (let j = 0; j < this.hNumb; ++j) {
                newCellMap[i].push(this.cellMap?.[i]?.[j] ?? 0);
            }
        }
        this.cellMap = newCellMap;
        this.container.innerHTML = ``;
        this.container.style.cssText = `
            width: ${this.size * this.hNumb + 1}px;
            height: ${this.size * this.vNumb + 1}px;
            display: grid;
            background-color: ${"#444"};
            border-radius: 4px;
            grid-template-columns: repeat(${Math.floor(this.width / this.size / Math.max(zoom, 1))}, ${this.size * zoom}px);
            grid-template-rows: repeat(${Math.floor(this.height / this.size / Math.max(zoom, 1))}, ${this.size * zoom}px);
        `;
        for (let i = 0; i < Math.floor(this.height / this.size / Math.max(zoom, 1)); ++i) {
            for (let j = 0; j < Math.floor(this.width / this.size / Math.max(zoom, 1)); ++j) {
                let item = document.createElement("div");
                item.className = `${this.container.id}-item`;
                item.style.cssText = `
                    width: ${this.size * zoom}px;
                    height: ${this.size * zoom}px;
                    background-color: ${DEAD_CELL_COLOR};
                    border-radius: 37.5%;
                    border: 1px solid ${DEAD_CELL_COLOR};
                    cursor: ${this.user_select ? "none" : "crosshair"};
                `;
                item.addEventListener("mousemove", () => {
                    if (!isMouseInPlayground) {
                        return;
                    }
                    if (i == iMouse && j == jMouse) {
                        return;
                    }
                    iMouse = i;
                    jMouse = j;
                    hasMouseMoved = true;
                    this.ShowColors();
                    this.MousePreCreate();
                });
                item.addEventListener("click", () => {
                    this.MouseCreate();
                });
                this.container.appendChild(item);
            }
        }
    }

    Involve() {
        for (let i = 0; i < this.vNumb; ++i) {
            for (let j = 0; j < this.hNumb; ++j) {
                if (this.cellMap[i][j] & 8) {
                    for (let di = i - 1; di < i + 2; ++di) {
                        for (let dj = j - 1; dj < j + 2; ++dj) {
                            if (di == i && dj == j) continue;
                            if (this.cellMap?.[di]?.[dj] == null) {
                                continue;
                            }
                            (this.cellMap[di][dj] & 7) != 7 ?
                            ++this.cellMap[di][dj] :
                            this.cellMap[di][dj] &= 8;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < this.vNumb; ++i) {
            for (let j = 0; j < this.hNumb; ++j) {
                switch (this.cellMap[i][j] & 7) {
                    case 2:
                        this.cellMap[i][j] &= 8;
                        break;
                    case 3:
                        this.cellMap[i][j] = 8;
                        break;
                    default:
                        this.cellMap[i][j] = 0;
                }
            }
        }
        this.ShowColors();
    }

    FitScreen(para = null) {
        let [new_width, new_height] = GetClient(), new_size = this.size;
        if (para != null) {
            if (para != 0) {
                new_width = this.width;
            }
            if (para != 1) {
                new_height = this.height;
            }
        }
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
        if (new_width != this.width || new_height != this.height || new_size != this.size) {
            this.InitColors(new_width, new_height, new_size);
        }
        this.ShowColors();
    }

    ClearColors() {
        input_width.value = "";
        input_height.value = "";
        input_size.value = "";
        for (let i = 0; i < this.vNumb; ++i) {
            for (let j = 0; j < this.hNumb; ++j) {
                this.cellMap[i][j] = 0;
            }
        }
        this.ShowColors();
    }

    RandomColors() {
        for (let i = 0; i < this.vNumb; ++i) {
            for (let j = 0; j < this.hNumb; ++j) {
                this.cellMap[i][j] = 8 * (Math.random() < 0.5);
            }
        }
        this.ShowColors();
    }

    GenerateColors() {
        this.Involve();
    }

    UpdateColors() {
        if (this.intervalID ?? false) {
            document.getElementById("button-steps").classList.remove("pressed");
            clearInterval(this.intervalID);
            this.intervalID = null;
        } else {
            document.getElementById("button-steps").classList.add("pressed");
            this.intervalID = setInterval(() => {
                this.Involve();
                this.MousePreCreate();
            }, this.intervalElapse);
        }
    }

    MousePreCreate() {
        if (!this.user_select) {
            return;
        }
        if (!isMouseInPlayground) {
            return;
        }
        if (iMouse == null || jMouse == null) {
            return;
        }
        let items = document.querySelectorAll(`.${this.container.id}-item`);
        for (let i = this.cursor_tissue.apex[0][0]; i < this.cursor_tissue.apex[1][0]; ++i) {
            for (let j = this.cursor_tissue.apex[0][1]; j < this.cursor_tissue.apex[1][1]; ++j) {
                if (
                    iMouse + i < 0 || iMouse + i >= Math.floor(this.height / this.size / zoom)
                    || jMouse + j < 0 || jMouse + j >= Math.floor(this.width / this.size / zoom)
                ) {
                    continue;
                }
                if (this.cursor_tissue.data
                    ?.[i - this.cursor_tissue.apex[0][0]]
                    ?.[j - this.cursor_tissue.apex[0][1]]
                    ?? 0
                ) {
                    items[(iMouse + i) * Math.floor(this.width / this.size / zoom) + jMouse + j].style["background-color"] = "#fff";
                }
            }
        }
        hasMouseMoved = false;
    }

    MouseCreate() {
        if (!this.user_select) {
            return;
        }
        if (!isMouseInPlayground) {
            return;
        }
        if (iMouse == null || jMouse == null) {
            return;
        }
        for (let i = this.cursor_tissue.apex[0][0]; i < this.cursor_tissue.apex[1][0]; ++i) {
            for (let j = this.cursor_tissue.apex[0][1]; j < this.cursor_tissue.apex[1][1]; ++j) {
                if (
                    iMouse + i < 0 || iMouse + i >= this.vNumb
                    || jMouse + j < 0 || jMouse + j >= this.hNumb
                ) {
                    continue;
                }
                this.cellMap[iMouse + i][jMouse + j] ^= 8 * this.cursor_tissue.data
                    ?.[i - this.cursor_tissue.apex[0][0]]
                    ?.[j - this.cursor_tissue.apex[0][1]]
                    ?? 0
                ;
            }
        }
        this.ShowColors();
    }
}


function ChangeElapse() {
    playground.intervalElapse = slider_elapse.value;
    slider_elapse.parentElement.querySelector("label").innerText = `${playground.intervalElapse / 1000}s`;
    if (playground.intervalID == null) {
        return;
    }
    clearInterval(playground.intervalID);
    playground.intervalID = setInterval(() => {
        playground.Involve();
        playground.MousePreCreate();
    }, playground.intervalElapse);
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
    iShift += Math.floor((playground.width / playground.size / zoom - playground.width / playground.size / new_zoom) / 2);
    jShift += Math.floor((playground.height / playground.size / zoom - playground.height / playground.size / new_zoom) / 2);
    zoom = new_zoom;
    if (zoom == 1 || iShift < 0) {
        iShift = 0;
    }
    if (zoom == 1 || jShift < 0) {
        jShift = 0;
    }
    if (zoom >= 0.01 && zoom <= 100) {
        zoom_info.parentElement.querySelector("label").innerText = `${(zoom * 100).toFixed(2)}%`;
    } else {
        zoom_info.parentElement.querySelector("label").innerText = `${(zoom * 100).toExponential(2)}%`;
    }
    playground.InitColors();
    playground.ShowColors();
}

function VisionShift(direction) {
    switch (direction) {
        case 0:
            if (iShift > 0) {
                --iShift;
            }
            break;
        case 1:
            if (jShift < playground.hNumb - Math.floor(playground.width / playground.size / zoom)) {
                ++jShift;
            }
            break;
        case 2:
            if (iShift < playground.vNumb - Math.floor(playground.height / playground.size / zoom)) {
                ++iShift;
            }
            break;
        case 3:
            if (jShift > 0) {
                --jShift;
            }
            break;
        case 4:
            iShift = Math.floor((playground.height / playground.size - playground.height / playground.size / zoom) / 2);
            jShift = Math.floor((playground.width / playground.size - playground.width / playground.size / zoom) / 2);
    }
    playground.ShowColors();
}

function CursorMoveCtrl(direction) {
    let iMoved = iMouse ?? Math.floor(playground.height / playground.size / zoom / 2);
    let jMoved = jMouse ?? Math.floor(playground.width / playground.size / zoom / 2);
    switch (direction) {
        case 0:
            if (iMoved > 0) {
                --iMoved;
            }
        break;
        case 1:
            if (jMoved < playground.hNumb - 1) {
                ++jMoved;
            }
        break;
        case 2: 
            if (iMoved < playground.vNumb - 1) {
                ++iMoved;
            }
        break;
        case 3:
            if (jMoved > 0) {
                --jMoved;
            }
    }
    let movedItem = document.querySelectorAll(`.${playground.container.id}-item`)?.[iMoved * Math.floor(playground.width / playground.size / zoom) + jMoved];
    let movedRect = movedItem?.getBoundingClientRect();
    movedItem?.dispatchEvent(new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: movedRect.left + movedRect.width / 2,
        clientY: movedRect.top + movedRect.height / 2
    }));
}

function SetCursorTissue(tissue_change) {
    if (tissue_change != null) {
        switch (tissue_change) {
            case 0:
                --cursor_tissue_seri;
                if (cursor_tissue_seri < 0) {
                    cursor_tissue_seri += allTissues.length;
                }
                break;
            case 1:
                ++cursor_tissue_seri;
                if (cursor_tissue_seri >= allTissues.length) {
                    cursor_tissue_seri -= allTissues.length;
                }
                break;
            case 2:
                cursor_tissue_pos -= 2;
                cursor_tissue_pos &= 7;
                break;
            case 3:
                cursor_tissue_pos ^= 1;
                break;
            case 4:
                cursor_tissue_pos += 2;
                cursor_tissue_pos &= 7;
        }
    }
    fetch(`./Tissues/${allTissues[cursor_tissue_seri]}.json`)
        .then(response => response.json())
        .then(data => {
            showcase.container.parentElement.querySelector("label").innerText = data["name"];
            playground.cursor_tissue = data["cursor-tissue"];
            switch (cursor_tissue_pos) {
                case 0:
                    break;
                case 1:
                    playground.cursor_tissue.data.flip(0);
                    break;
                case 2:
                    playground.cursor_tissue.data.transpose();
                    playground.cursor_tissue.data.flip(0);
                    playground.cursor_tissue.apex.flip(0);
                    break;
                case 3:
                    playground.cursor_tissue.data.transpose();
                    playground.cursor_tissue.apex.flip(0);
                    break;
                case 4:
                    playground.cursor_tissue.data.flip(0);
                    playground.cursor_tissue.data.flip(1);
                    break;
                case 5:
                    playground.cursor_tissue.data.flip(1);
                    break;
                case 6:
                    playground.cursor_tissue.data.transpose();
                    playground.cursor_tissue.data.flip(1);
                    playground.cursor_tissue.apex.flip(0);
                    break;
                case 7:
                    playground.cursor_tissue.data.transpose();
                    playground.cursor_tissue.data.flip(0);
                    playground.cursor_tissue.data.flip(1);
                    playground.cursor_tissue.apex.flip(0);
            }
            let tissue_hNumb = playground.cursor_tissue.apex[1][1] - playground.cursor_tissue.apex[0][1];
            let tissue_vNumb = playground.cursor_tissue.apex[1][0] - playground.cursor_tissue.apex[0][0];
            showcase.InitColors(null, null, showcase.height / (Math.max(tissue_hNumb, tissue_vNumb) + 4));
            showcase.ClearColors();
            for (
                let tissue_top = Math.floor((showcase.vNumb - tissue_vNumb) / 2), i = tissue_top;
                i < tissue_top + tissue_vNumb; ++i
            ) {
                for (
                    let tissue_left = Math.floor((showcase.hNumb - tissue_hNumb) / 2), j = tissue_left;
                    j < tissue_left + showcase.hNumb; ++j
                ) {
                    if (playground.cursor_tissue.data?.[i - tissue_top]?.[j - tissue_left] ?? 0) {
                        showcase.cellMap[i][j]= 8;
                    }
                }
            }
            showcase.ShowColors();
        })
        .catch(error => console.error(error));
}


document.addEventListener("mousemove", function(event) {
    isMouseInPlayground = [event.target?.className, event.target.parentElement?.className].includes("grid-container");
    if (!isMouseInPlayground) {
        iMouse = null;
        jMouse = null;
        hasMouseMoved = true;
        playground.ShowColors();
    }
})

document.addEventListener("keydown", function(event) {
    switch (event.code) {
        case "BracketLeft":
            if (event.ctrlKey) {
                ZoomInOrOut(2);
            }
            break;
        case "BracketRight":
            if (event.ctrlKey) {
                ZoomInOrOut(1);
            }
            break;
        case "ArrowLeft": case "ArrowRight": case "ArrowUp": case "ArrowDown":
            let direction;
            switch (event.code) {
                case "ArrowLeft":
                    direction = 3;
                    break;
                case "ArrowRight":
                    direction = 1;
                    break;
                case "ArrowUp":
                    direction = 0;
                    break;
                case "ArrowDown":
                    direction = 2;
            }
            if (event.ctrlKey) {
                VisionShift(direction);
            } else {
                CursorMoveCtrl(direction);
            }
            if (event.shiftKey) {
                playground.MouseCreate();
            }
            break;
        case "Space":
            playground.MouseCreate();
            break;
        case "Enter":
            if (event.ctrlKey) {
                playground.GenerateColors();
            } else {
                playground.UpdateColors();
            }
            break;
        case "Comma":
            if (event.ctrlKey) {
                SetCursorTissue(0);
            } else {
                SetCursorTissue(2);
            }
            break;
        case "Period":
            if (event.ctrlKey) {
                SetCursorTissue(1);
            } else {
                SetCursorTissue(4);
            }
            break;
        case "Slash":
            SetCursorTissue(3);
    }
});
const input_width = document.getElementById("input-width");
const input_height = document.getElementById("input-height");
const input_size = document.getElementById("input-size");
const slider_elapse = document.getElementById("slider-elapse");
const zoom_info = document.getElementById("rezoom");
const DEAD_CELL_COLOR = `#000`;
// var intervalID, intervalElapse = slider_elapse.value;
var zoom = 1, iShift = 0, jShift = 0;
var iMouse, jMouse, hasMouseMoved, isMouseInPlayground;
var allTissues = [], cursor_tissue_seri = 0, cursor_tissue_pos = 0;
const playground = new Cells(document.body, "playground", "grid-container");
playground.InitColors(...GetClient(), 8);
// playground.cursor_tissue = {
//     data: [
//         [true, true, true],
//         [true, false, false],
//         [false, true, false]
// ],
//     left: -1,
//     right: 2,
//     top: -1,
//     bottom: 2
// };
const showcase = new Cells(document.getElementById("showcase-settings"), "showcase", "grid-container");
showcase.user_select = false;
let showcase_height = parseInt(getComputedStyle(showcase.
container.parentElement)["height"]);
showcase.InitColors(showcase_height, showcase_height, showcase_height / 5);
fetch("./Tissues/Tissues.json")
    .then(response => response.json())
    .then(data => {
        allTissues = data;
        SetCursorTissue();
    })
    .catch(error => console.error(error));
