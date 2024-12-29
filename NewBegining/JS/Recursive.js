let Lexer;

function StartDescent(inputText){
    Lexer = new GramaticLexer(inputText);
    if(G()){
        return true;
    }
    return false;
}

function G(){
    if(Reglas()){
        return true;
    }
    return false;
}

function Reglas(){
    let token;
    if(Regla()){
        token = Lexer.yylex();
        if(token && token.type === 'endLn'){
            if (Reglas_P()) {
                return true;
            }
        }
    }
    return false;
}

function Reglas_P(){
    let token;
    let tmpLexer = new GramaticLexer(Lexer);
    if(Regla()){
        token = Lexer.yylex();
        if(token.type === 'endLn'){
            if(Reglas_P()){
                return true;
            }
        }
        return false;
    }
    if(Lexer.tokenStack.isEmpty()){
        return true;
    }
    else{
        return false;
    }
}

function Regla(){
    let token;
    if (Lado_Izquierdo()){
        token = Lexer.yylex();
        if(token && token.type === 'arrow') {
            if (Lados_Derechos()){
                return true;
            }
        }
    }
    return false;
}

function Lado_Izquierdo(){
    let token;
    token = Lexer.yylex();
    if(token && token.type === 'gStatement'){
        return true;
    }
    return false;
}

function Lados_Derechos(){
    if(Lado_Derecho()){
        if(Lados_Derechos_P()){
            return true;
        }
    }
    return false;
}

function Lados_Derechos_P() {
    let token;
    token = Lexer.yylex()
    if (token && token.type === 'or') {
        if(Lado_Derecho()){
            if(Lados_Derechos_P()){
                return true;
            }
        }
        return false;
    }
    Lexer.undoToken();
    return true;
}


function Lado_Derecho(){
    if(Simbolos()){
        return true;
    }
    return false;
}

function Simbolos(){
    let token;
    token = Lexer.yylex();
    if(token && token.type === 'gStatement'){
        if(Simbolos_P()){
            return true;
        }
    }
    return false;
}


function Simbolos_P(){
    let token;
    token = Lexer.yylex();
    if (token && token.type === 'gStatement'){
        if (Simbolos_P()) {
            return true;
        }
        return false;
    }
    Lexer.undoToken();
    return true;
}
