let Lexer;

function StartDescent(inputText) {
        // Creamos el lexer
        Lexer = new GramaticLexer(inputText);

        // Iniciamos con la regla inicial: G
        if (G()) {
            if (Lexer.tokenStack.isEmpty()) {
                return true;
            }
        }
        return false;
    }

// G → Reglas
function G() {
    return Reglas();
}

// Reglas → Regla endLn Reglas_P
function Reglas() {
    if (Regla()) {
        let token = Lexer.yylex();
        if (token && token.type === 'endLn') {
            if (Reglas_P()) {
                return true;
            }
        }
    }
    return false;
}

// Reglas_P → Regla endLn Reglas_P | ε
function Reglas_P() {
    let tmpLexer = Lexer.clone();
    if (Regla()) {
        let token = Lexer.yylex();
        if (token && token.type === 'endLn') {
            if (Reglas_P()) {
                return true;
            }
        }
        return false;
    }
    Lexer.restore(tmpLexer);
    return true;
}

// Regla → Lado_Izquierdo arrow Lados_Derechos
function Regla() {
    if (Lado_Izquierdo()) {
        let token = Lexer.yylex();
        if (token && token.type === 'arrow') {
            if (Lados_Derechos()) {
                return true;
            }
        }
    }
    return false;
}

// Lado_Izquierdo → gStatement
function Lado_Izquierdo() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        return true;
    }
    return false;
}

// Lados_Derechos → Lado_Derecho Lados_Derechos_P
function Lados_Derechos() {
    if (Lado_Derecho()) {
        if (Lados_Derechos_P()) {
            return true;
        }
    }
    return false;
}

// Lados_Derechos_P → or Lado_Derecho Lados_Derechos_P | ε
function Lados_Derechos_P() {
    let token = Lexer.yylex();
    if (token && token.type === 'or') {
        if (Lado_Derecho()) {
            if (Lados_Derechos_P()) {
                return true;
            }
        }
        return false;
    }
    Lexer.undoToken();
    return true;
}

// Lado_Derecho → Simbolos
function Lado_Derecho() {
    if (Simbolos()) {
        return true;
    }
    return false;
}

// Simbolos → gStatement Simbolos_P
function Simbolos() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        if (Simbolos_P()) {
            return true;
        }
    }
    return false;
}

// Simbolos_P → gStatement Simbolos_P | ε
function Simbolos_P() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        if (Simbolos_P()) {
            return true;
        }
        return false;
    }

    Lexer.undoToken();
    return true;
}