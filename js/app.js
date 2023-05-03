"use strict";
/**
 **La declaración "use strict"; al principio del código indica que el programa se ejecutará en modo estricto,
 ** lo que significa que se aplicarán ciertas restricciones de sintaxis y semántica para ayudar a prevenir errores y malas prácticas. */

let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

//*La variable "events" define dos objetos, uno para eventos de ratón y otro para eventos táctiles,
//*que se utilizarán más adelante para detectar la interacción del usuario con la interfaz de dibujo
//* en función del tipo de dispositivo que se esté utilizando (ratón o pantalla táctil).
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        mobe: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

let draw = false;
let erase = false;

/*
 *La función "isTouchDevice" utiliza una técnica para detectar si el dispositivo del usuario admite eventos táctiles.
 * Si es así, se configura la variable "deviceType" en "touch", de lo contrario, se configura en "mouse".
 *Esta función también devuelve un valor booleano que indica si el dispositivo es táctil o no.*/
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

gridButton.addEventListener("click", () => {
    container.innerHTML = "";
    let count = 0;
    for (let i = 0; i < gridHeight.value; i++) {
        count += 2;
        let div = document.createElement("div");
        div.classList.add("gridRow");

        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.setAttribute("id", `gridCol${count}`);
            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                if (erase) {
                col.style.backgroundColor = "transparent";
                } else {
                col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                //*utilizamos el método "elementFromPoint" para obtener el elemento de la cuadrícula en el que el usuario está moviendo el cursor o el dedo
                let elementId = document.elementFromPoint(
                !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                !isTouchDevice() ? e.clientY : e.touches[0].clientY
                ).id;
                checker(elementId);
            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            div.appendChild(col);
        }

        container.appendChild(div);
    }
});

//*Recibe como argumento el ID del cuadro de la cuadrícula que se está actualizando
function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol");
    //*Utilizamos un bucle "forEach" para buscar ese ID en la lista de todos los cuadros de la cuadrícula.
    gridColumns.forEach((elemnent) => {
        if (elementId == elemnent.id) {
        if (draw && !erase) {
            elemnent.style.backgroundColor = colorButton.value;
        } else if (draw && erase) {
            elemnent.style.backgroundColor = "transparent";
        }
        }
    });
}

clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});

eraseBtn.addEventListener("click", () => {
    erase = true;
});

paintBtn.addEventListener("click", () => {
    erase = false;
});

/*
 *Estas dos secciones de código actualizan el valor de widthValue y heightValue en tiempo real mientras el usuario
 *cambia el valor de los elementos de entrada gridWidth y gridHeight, respectivamente.
 *Además, si el valor es menor que 9, se agrega un cero delante del valor para mantener una presentación coherente. */
gridWidth.addEventListener("input", () => {
  //*comprueba si el valor del elemento es menor que 9.
    widthValue.innerHTML =
    gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
    heightValue.innerHTML =
    gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

//*Nos aseguramos de que el código se ejecute solo después de que se hayan cargado todos los elementos de la página web mediante el evento
window.onload = () => {
    gridHeight.value = 0;
    gridWidth.value = 0;
};
