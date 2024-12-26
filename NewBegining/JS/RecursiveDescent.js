function StartDescent(inputText) {
    let lexer = new GramaticLexer(inputText);
    if (G(lexer)) {
        return true;
    }
    return false;
}

function G(inputLexer) {
    if (Reglas(inputLexer)) {
        return true;
    }
    return false;
}

function Reglas(inputLexer) {
    let token;
    if (Regla(inputLexer)) {
        token = inputLexer.yylex();
        if (token && token.type === 'endLn') {
            if (Reglas_P(inputLexer)) {
                return true;
            }
        }
        // Retroceso si no se encuentra el token 'endLn'
        inputLexer.undoToken();
    }
    return false;
}

function Reglas_P(inputLexer) {
    let token;

    // Intentar la primera opción de 'Regla' y 'endLn'
    if (Regla(inputLexer)) {
        token = inputLexer.yylex();
        if (token && token.type === 'endLn') {
            if (Reglas_P(inputLexer)) {
                return true;
            }
        }
        // Retroceso manual si no cumple con la condición
        inputLexer.undoToken();
    }

    // Si no hay más reglas, terminamos
    return true;
}

function Regla(inputLexer) {
    let token;

    // Procesar 'LadoIzquierdo' y 'arrow'
    if (LadoIzquierdo(inputLexer)) {
        token = inputLexer.yylex();
        if (token && token.type === 'arrow') {
            if (Lados_Derechos(inputLexer)) {
                return true;
            }
        }
        // Retroceso si no se cumple la condición
        inputLexer.undoToken();
    }
    return false;
}

function LadoIzquierdo(inputLexer) {
    let token = inputLexer.yylex();
    if (token && token.type === 'gStatement') {
        return true;
    }
    // Retroceder si no es 'gStatement'
    inputLexer.undoToken();
    return false;
}

function Lados_Derechos(inputLexer) {
    if (LadoDerecho(inputLexer)) {
        if (Lados_Derechos_P(inputLexer)) {
            return true;
        }
    }
    return false;
}

function Lados_Derechos_P(inputLexer) {
    let token;
    token = inputLexer.yylex();
    if (token && token.type === 'or') {
        if (LadoDerecho(inputLexer)) {
            if (Lados_Derechos_P(inputLexer)) {
                return true;
            }
        }
        // Retroceso manual si no se cumple la condición
        inputLexer.undoToken();
        return false;
    }
    // Si no se cumple 'or', terminamos
    return true;
}

function LadoDerecho(inputLexer) {
    if (Simbolos(inputLexer)) {
        return true;
    }
    return false;
}

function Simbolos(inputLexer) {
    let token = inputLexer.yylex();
    if (token && token.type === 'gStatement') {
        if (Simbolos_P(inputLexer)) {
            return true;
        }
    }
    // Retroceder si no se cumple la condición
    inputLexer.undoToken();
    return false;
}

function Simbolos_P(inputLexer) {
    let token;
    token = inputLexer.yylex();
    if (token && token.type === 'gStatement') {
        if (Simbolos_P(inputLexer)) {
            return true;
        }
        // Retroceso si no se cumple la condición
        inputLexer.undoToken();
        return false;
    }
    return true;  // Termina si no hay más símbolos
}
