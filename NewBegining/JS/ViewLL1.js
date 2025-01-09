let ll1 = new LL1('<a>-><ID>;');

let ll1_Prof = new LL1(`
    <G> -> <ListaDeReglas>;
    <ListaDeReglas> -> <Reglas> <SEMICOLON> <ListaDeReglasP>;
    <ListaDeReglasP> -> <Reglas> <SEMICOLON> <ListaDeReglasP> | <Epsilon>;
    <Reglas> -> <LadoIzquierdo> <ARROW> <LadosDerechos>;
    <LadoIzquierdo> -> <G_STATEMENT>;
    <LadosDerechos> -> <LadoDerecho> <LadosDerechosP>;
    <LadosDerechosP> -> <OR> <LadoDerecho> <LadosDerechosP> | <Epsilon>;
    <LadoDerecho> -> <SecSimbolos>;
    <SecSimbolos> -> <G_STATEMENT> <SecSimbolosP>;
    <SecSimbolosP> -> <G_STATEMENT> <SecSimbolosP> | <Epsilon>;
`);
console.log(ll1_Prof);

function runAnalysis() {
    const inputText = $("#grammar-input").val();
    const resultDiv = $("#result");

    try {
        const lexer = new GramaticLexer(inputText);
        const isValid = parseAndMarkTerminals(lexer);

        if (isValid) {
            resultDiv.text("✅ ¡La gramática es válida!").removeClass("error").show();
            ll1 = new LL1(inputText);
            $("#EntradaAlLL1").show(); // Mostrar la sección LL1
            generateLL1Table(); // Generar tabla LL1
        } else {
            resultDiv.text("❌ La gramática es inválida.").addClass("error").show();
            ll1 = null;
            $("#EntradaAlLL1").hide(); // Ocultar la sección LL1
            $("#tabla").html(""); // Limpiar la tabla
            $("#logs").html("");
        }
    } catch (error) {
        resultDiv.text("⚠️ Error: " + error.message).addClass("error").show();
        $("#EntradaAlLL1").hide(); // Ocultar la sección LL1
        $("#tabla").html(""); // Limpiar la tabla
        $("#logs").html("");
    }
}

function generateLL1Table() {
    if (!ll1 || !ll1.parserOutput) {
        $("#tabla").html(""); // Si no hay datos, limpiar tabla
        return;
    }

    let boolPrimer = true;
    // Generar el encabezado de la tabla
    let htmlForTable = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th></th>`;
    let terminals = new Set();
    terminals = ll1.parserOutput.terminals;
    terminals = terminals.filter((element) => { return element !== 'Epsilon'; });

    for (const terminal of terminals) {
        htmlForTable += `<th>`;
        let tmpProd;
        switch (terminal) {
            case 'PLUS': tmpProd = '+'; break;
            case 'MINUS': tmpProd = '-'; break;
            case 'MULT': tmpProd = '*'; break;
            case 'DIV': tmpProd = '\/'; break;
            case 'POW': tmpProd = '^'; break;

            case 'OR': tmpProd = '|'; break;
            case 'AND': tmpProd = '&'; break;
            case 'OPCIONAL': tmpProd = '?'; break;

            case 'L_PAREN': tmpProd = '('; break;
            case 'R_PAREN': tmpProd = ')'; break;
            case 'L_BRACKET': tmpProd = '['; break;
            case 'R_BRACKET': tmpProd = ']'; break;
            case 'L_BRACE': tmpProd = '{'; break;
            case 'R_BRACE': tmpProd = '}'; break;

            case 'COMA': tmpProd = ','; break;
            case 'SEMICOLON': tmpProd = ';'; break;
            case 'COLON': tmpProd = ':'; break;

            case 'LT': tmpProd = '<'; break;
            case 'GT': tmpProd = '>'; break;
            case 'ASSIGN': tmpProd = '='; break;

            default: tmpProd = terminal;
        }
        htmlForTable += `${tmpProd}</th>`;
    }
    htmlForTable += `<th>$</th></tr></thead><tbody>`;
    for(const row of ll1.ll1Table){

        for(const col of row){
            if(boolPrimer){
                htmlForTable += `<td>${col.nonTerminal}</td>`;
                boolPrimer = false;
            }
            if (col.production === null) {
                htmlForTable += `<td></td>`
            }
            else if (col.production === 'Epsilon') {
                htmlForTable += `<td>${col.nonTerminal} → ε</td>`
            }
            else {
                htmlForTable += `<td>${col.nonTerminal} →`;
                for (const prod of col.production) {
                    let tmpProd;
                    switch(prod){
                        case 'PLUS': tmpProd = '+'; break;
                        case 'MINUS': tmpProd = '-'; break;
                        case 'MULT': tmpProd = '*'; break;
                        case 'DIV' : tmpProd = '\/'; break;
                        case 'POW': tmpProd = '^'; break;

                        case 'OR': tmpProd = '|'; break;
                        case 'AND': tmpProd = '&'; break;
                        case 'OPCIONAL': tmpProd = '?'; break;

                        case 'L_PAREN': tmpProd = '('; break;
                        case 'R_PAREN': tmpProd = ')'; break;
                        case 'L_BRACKET': tmpProd = '['; break;
                        case 'R_BRACKET': tmpProd = ']'; break;
                        case 'L_BRACE': tmpProd = '{'; break;
                        case 'R_BRACE': tmpProd = '}'; break;

                        case 'COMA': tmpProd = ','; break;
                        case 'SEMICOLON': tmpProd = ';'; break;
                        case 'COLON': tmpProd = ':'; break;

                        case 'LT': tmpProd = '<'; break;
                        case 'GT': tmpProd = '>'; break;
                        case 'ASSIGN': tmpProd = '='; break;

                        default: tmpProd = prod;
                    }
                    htmlForTable += ` ${tmpProd}`;
                }
                htmlForTable += `</td>`;
            }
            
        }
        boolPrimer = true;
        htmlForTable += `</tr>`
    }
    htmlForTable += `</tbody></table>`;
    $("#tabla").html(htmlForTable); // Insertar tabla en el DOM
}

function runLL1(){
    const inputText = $("#LL1-input").val();
    const resultDiv = $("#result_LL1");

    try{
        let isValid = ll1.parse(inputText);
        if (isValid) {
            resultDiv.text("✅ ¡La cadena es válida!").removeClass("error").show();
        } else {
            resultDiv.text("❌ La cadena es inválida.").addClass("error").show();
        }
        generateLog();
    }
    catch(error){
        resultDiv.text("⚠️ Error: " + error.message).addClass("error").show();
        $("#logs").html("");
    }
}

function generateLog(){
    if (!ll1 || !ll1.parserOutput) {
        $("#logs").html(""); // Si no hay datos, limpiar tabla
        return;
    }
    let LogsHTML = '<table class="table table-bordered"><thead><tr><td>Pila</td><td>Cadena por analizar</td><td>Acción</td></tr></thead><tbody>';
    for(const log of ll1.parserlog){
        LogsHTML += `
        <tr>
            <td>${log.stack}</td>
            <td>${log.queue}</td>
            <td>${log.action}</td>
        </tr>
        
        `;
    }
    LogsHTML += '</tbody></table>';
    $("#logs").html(LogsHTML);
}

$(document).ready(() => {
    $("#run-analysis").on("click", runAnalysis);
    $("#RunLL1Analisis").on("click", runLL1);
    // Ocultar la sección LL1 inicialmente
    $("#EntradaAlLL1").hide();
});
