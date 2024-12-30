let Lexer;

function StartDescent(inputText) {
    Lexer = new GramaticLexer(inputText);
    const ast = G();
    if((ast !== null) && Lexer.tokenStack.isEmpty()){
        return ast;
    }
    return null;
}

// G -> Reglas
function G() {
    return Reglas();
}

// Reglas -> Regla endLn Reglas_P
function Reglas() {
    let rule = Regla();
    if (rule !== null) {
        let token = Lexer.yylex();
        if (token && token.type === 'endLn') {
            let rulesP = Reglas_P();
            if (rulesP !== null) {
                return new RulesNode([rule, ...rulesP]);
            }
        }
    }
    return null;
}

function Reglas_P() {
    let tmpLexer = Lexer.clone();
    let rule = Regla();
    if(rule !== null){
        let token = Lexer.yylex();
        if(token && token.type === 'endLn'){
            let rulesP = Reglas_P();
            if(rulesP !== null){
                return [rule, ...rulesP];
            }
        }
        return null;
    }

    Lexer.restore(tmpLexer);
    return [];
}

function Regla() {
    let left = Lado_Izquierdo();
    if(left !== null){
        let token = Lexer.yylex();
        if(token && token.type === 'arrow') {
            let rights = Lados_Derechos();
            if(rights !== null){
                return new RuleNode(left, rights);
            }
        }
    }
    return null;
}

function Lado_Izquierdo() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        return token.value;
    }
    return null;
}

function Lados_Derechos() {
    let right = Lado_Derecho();
    if (right !== null) {
        let moreRightSides = Lados_Derechos_P();
        if(moreRightSides !== null){
            return [right, ...moreRightSides];
        }
    }
    return null;
}

function Lados_Derechos_P(){
    let token = Lexer.yylex();
    if (token && token.type === 'or') {
        let right = Lado_Derecho();
        if (right !== null) {
            let moreRightSides = Lados_Derechos_P();
            if(moreRightSides !== null){
                return [right, ...moreRightSides];
            }
        }
    }
    Lexer.undoToken();
    return [];
}

function Lado_Derecho(){
    return Simbolos();
}

function Simbolos() {
    let token = Lexer.yylex();
    if(token && token.type === 'gStatement') {
        let value = token.value;
        let moreSimbols = Simbolos_P();
        if (moreSimbols !== null){
            return new RightSideNode([value, ...rest]);
        }
    }
    return null;
}

function Simbolos_P() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        let value = token.value;
        let moreSimbols = Simbolos_P();
        if(moreSimbols !== null){
            return [value, ...moreSimbols];
        }
        return null;
    }
    Lexer.undoToken();
    return [];
}