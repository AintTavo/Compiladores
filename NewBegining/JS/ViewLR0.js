let lr0; // Variable global para el analizador LR(0)

// 🛠️ **Función principal para analizar la gramática LR(0)** 
function runLR0Analysis() {
    const inputText = $("#grammar-input").val(); // Obtener la gramática del textarea
    const resultDiv = $("#result");

    try {
        // Crear un analizador LR(0)
        lr0 = new LR0(inputText);

        resultDiv.text("✅ ¡La gramática es válida!").removeClass("error").show();
        $("#EntradaAlLR0").show(); // Mostrar la sección para ingresar cadenas
        generateLR0Table(); // Generar tabla LR(0)
    } catch (error) {
        resultDiv.text("❌ La gramática es inválida. Error: " + error.message)
            .addClass("error").show();
        lr0 = null;
        $("#EntradaAlLR0").hide(); // Ocultar sección de entrada
        $("#tabla").html(""); // Limpiar la tabla
        $("#logs").html(""); // Limpiar los logs
    }
}

function generateLR0Table() {
    if (!lr0 || !lr0.lr0Table) {
        $("#tabla").html(""); // Si no hay datos, limpiar la tabla
        return;
    }

    let htmlForTable = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Estado</th>
    `;

    let terminals = [...lr0.terminals];
    let nonTerminals = [...lr0.nonTerminals];
    let allSymbols = [...terminals, ...nonTerminals];

    for (const symbol of allSymbols) {
        htmlForTable += `<th>${symbol}</th>`;
    }

    htmlForTable += `</tr></thead><tbody>`;

    // Rellenar la tabla con las acciones (Shift, Goto, Reduce, Accept)
    for (let i = 0; i < lr0.lr0Table.length; i++) {
        htmlForTable += `<tr><td>${i}</td>`;
        for (const symbol of allSymbols) {
            const colIndex = lr0.symbolIndex[symbol];
            const cell = lr0.lr0Table[i][colIndex];
            if (!cell || cell.TipoDeProduccion === null) {
                htmlForTable += `<td></td>`;
            } else {
                let content = "";
                switch (cell.TipoDeProduccion) {
                    case "Shift":
                        content = `S${cell.StateIndex}`;
                        break;
                    case "Goto":
                        content = `G${cell.StateIndex}`;
                        break;
                    case "Reduce":
                        content = `R(${cell.Regla.left} → ${cell.Regla.right.join(' ')})`;
                        break;
                    case "Accept":
                        content = "Accept";
                        break;
                    default:
                        content = "";
                }
                htmlForTable += `<td>${content}</td>`;
            }
        }
        htmlForTable += `</tr>`;
    }

    htmlForTable += `</tbody></table>`;
    $("#tabla").html(htmlForTable); // Insertar tabla en el DOM
}


// ✅ **Función para validar una cadena con LR(0)**
function runLR0() {
    const inputText = $("#LR0-input").val();
    const resultDiv = $("#result_LR0");

    try {
        let isValid = lr0.parse(inputText);
        if (isValid) {
            resultDiv.text("✅ ¡La cadena es válida!").removeClass("error").show();
        } else {
            resultDiv.text("❌ La cadena es inválida.").addClass("error").show();
        }
    } catch (error) {
        resultDiv.text("⚠️ Error: " + error.message).addClass("error").show();
    }
}

// 📝 **Función para validar paso a paso una cadena con LR(0)**
function validateLR0Step() {
    const inputText = $("#LR0-input").val();
    const resultDiv = $("#result_LR0");

    try {
        let isValid = lr0.parseStepByStep(inputText);
        if (isValid) {
            resultDiv.text("✅ ¡La cadena es válida (Paso a Paso)!").removeClass("error").show();
        } else {
            resultDiv.text("❌ La cadena es inválida (Paso a Paso).").addClass("error").show();
        }
        generateLR0Logs(); // Mostrar los logs en la interfaz
    } catch (error) {
        resultDiv.text("⚠️ Error: " + error.message).addClass("error").show();
        $("#logs tbody").html(""); // Limpiar logs si hay error
    }
}



// 📊 **Generar Logs de Análisis LR(0)**
function generateLR0Logs() {
    const logsTableBody = $("#logs tbody");

    // Limpiar los logs anteriores
    logsTableBody.html("");

    if (!lr0 || !lr0.log || lr0.log.length === 0) {
        logsTableBody.html(`
            <tr>
                <td colspan="4" class="text-center">No hay registros disponibles.</td>
            </tr>
        `);
        return;
    }

    // Llenar los logs con los datos disponibles
    for (const log of lr0.log) {
        logsTableBody.append(`
            <tr>
                <td><code>${log.pila.join(' ')}</code></td>
                <td><code>${log.tokenActual}</code></td>
                <td>${log.accion}</td>
                <td>${log.detalle}</td>
            </tr>
        `);
    }
}




// 📅 **Inicializar eventos al cargar la página**
$(document).ready(() => {
    $("#AnalisisGramatica").on("click", runLR0Analysis);
    $("#RunLR0Analisis").on("click", runLR0);
    $("#ValidateLR0Step").on("click", validateLR0Step);

    // Ocultar la sección de entrada LR0 inicialmente
    $("#EntradaAlLR0").hide();
});


