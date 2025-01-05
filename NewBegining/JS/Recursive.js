let Lexer;

// ############################################################Funciones principales de Recursive.js#############################################################
// Funcion que regresa gramatica sin no terminales y terminales
function StartDescent(inputText) {
    Lexer = new GramaticLexer(inputText);
    const ast = G();
    if ((ast !== null) && Lexer.tokenStack.isEmpty()) {
        return ast;
    }
    return null;
}

// Esta funcion hace lo mismo que StartDescent y regresa un JSON con la lista de terminales, la lista de no terminales y la gramatica en lista con
// esta con no terminales y terminales
function parseAndMarkTerminals(inputText){
    // 1. Parseamos y obtenemos el AST
    const ast = StartDescent(inputText);
    if (!ast) {
        console.error("Error: no se pudo parsear la entrada");
        return null;
    }

    // 2. Obtenemos los set (o arrays) de terminales y no terminales
    const { terminals, nonTerminals } = postProcessAST(ast);

    // 3. (Opcional) Anotamos el AST con isTerminal = true/false
    annotateTerminals(ast, new Set(terminals), new Set(nonTerminals));

    return {
        ast: ast,
        terminals: terminals,
        nonTerminals: nonTerminals,
    };
}


// Obtiene la lista de terminales y no terminales
function postProcessAST(ast) {

    // ###################################Codigo#############################
    // 1. Recolectar simbolos
    let nonTerminals = new Set();
    let allSymbols = new Set();


    // 2. Recorrer el AST
    // ############################Funciones anidadas########################
    function visit(node) {
        if (!node) {
            return;
        }
        switch (node.type) {
            case 'Rules':
                for (const rule of node.rules) {
                    visit(rule);
                }
                break;
            case 'Rule':
                nonTerminals.add(node.left);
                for (const rightNode of node.rights) {
                    visit(rightNode);
                }
                break;
            case 'RightSide':
                for (const symbol of node.symbols) {
                    allSymbols.add(symbol);
                }
                break;
            default:
                break;
        }

    }
    visit(ast);

    // 3. Determinar terminales
    const terminals = new Set(
        [...allSymbols].filter(sym => !nonTerminals.has(sym))
    );

    // 4. (Opcional) Generar arrays
    const terminalsArray = Array.from(terminals);
    const nonTerminalsArray = Array.from(nonTerminals);

    return {
        terminals: terminalsArray,
        nonTerminals: nonTerminalsArray,
    };
}

// Con una lista de terminales al arbol obtenido de StartDescent cambia los simbolos para tener en las hojas si es terminal o no terminal
function annotateTerminals (ast, terminalsSet) {
    function visit(node) {
        if (!node) {
            return;
        }
        switch (node.type) {
            case 'Rules':
                for (const rule of node.rules) {
                    visit(rule);
                }
                break;
            case 'Rule':
                const sym = node.left;
                const isTerm = terminalsSet.has(sym);
                node.left = {
                    value: sym,
                    isTerminal: isTerm,
                }
                for (const rightNode of node.rights) {
                    visit(rightNode);
                }
                break;
            case 'RightSide':
                for(let i = 0 ; i < node.symbols.length ; i++) {
                    const sym = node.symbols[i];
                    const isTerm = terminalsSet.has(sym);

                    node.symbols[i] = {
                        value: sym,
                        isTerminal: isTerm,
                    };
                }
                break;
            default:
                break;
        }
    }

    visit(ast);
}

function parseForLR0(inputText){
    const ast = StartDescent(inputText);
    if (!ast) {
        console.error("Error: no se pudo parsear la entrada");
        return null;
    }
    let firstRule = ast.rules[0].left;
    let tmpRightSide = new RightSideNode([firstRule]);
    let NombreStart = false;
    for(const Rule of ast.rules){
        if(Rule.left === 'Start')
            NombreStart = true;
        for(const Right of Rule.rights){
            for(const symbol of Right.symbols){
                if(symbol === 'Start')
                    NombreStart = true;
            }
        }
    }
    let tmpRule
    if(NombreStart)
        tmpRule = new RuleNode('StartP',[tmpRightSide]);
    else
        tmpRule = new RuleNode('Start',[tmpRightSide]);

    ast.rules = [tmpRule, ...ast.rules];
    
    // 2. Obtenemos los set (o arrays) de terminales y no terminales
    const { terminals, nonTerminals } = postProcessAST(ast);

    return {
        ast: ast,
        terminals: terminals,
        nonTerminals: nonTerminals,
    };
}


// ############################################################Funciones del desenso recursivo######################################################################
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

// Reglas_P -> Regla endLn Reglas_P | ε
function Reglas_P() {
    let tmpLexer = Lexer.clone();
    let rule = Regla();
    if (rule !== null) {
        let token = Lexer.yylex();
        if (token && token.type === 'endLn') {
            let rulesP = Reglas_P();
            if (rulesP !== null) {
                return [rule, ...rulesP];
            }
        }
        return null;
    }

    Lexer.restore(tmpLexer);
    return [];
}

// Regla -> LadoIzquierdo or Lados_Derechos
function Regla() {
    let left = Lado_Izquierdo();
    if (left !== null) {
        let token = Lexer.yylex();
        if (token && token.type === 'arrow') {
            let rights = Lados_Derechos();
            if (rights !== null) {
                return new RuleNode(left, rights);
            }
        }
    }
    return null;
}

// Lado_Izquierdo -> gStatement
function Lado_Izquierdo() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        return token.value;
    }
    return null;
}

// Lados_Derechos -> Lado_Derecho Lados_Derechos_P
function Lados_Derechos() {
    let right = Lado_Derecho();
    if (right !== null) {
        let moreRightSides = Lados_Derechos_P();
        if (moreRightSides !== null) {
            return [right, ...moreRightSides];
        }
    }
    return null;
}

// Lados_Derechos_P -> or Lado_Derecho Lados_Derechos_P | ε
function Lados_Derechos_P() {
    let token = Lexer.yylex();
    if (token && token.type === 'or') {
        let right = Lado_Derecho();
        if (right !== null) {
            let moreRightSides = Lados_Derechos_P();
            if (moreRightSides !== null) {
                return [right, ...moreRightSides];
            }
        }
        return null;
    }
    Lexer.undoToken();
    return [];
}

// Lado_Derecho -> Simbolos
function Lado_Derecho() {
    return Simbolos();
}

// Simbolos -> gStatement Simbolos_P
function Simbolos() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        let value = token.value;
        let moreSimbols = Simbolos_P();
        if (moreSimbols !== null) {
            return new RightSideNode([value, ...moreSimbols]);
        }
    }
    return null;
}

// Simbolos_P -> gStatement Simbolos_P | ε
function Simbolos_P() {
    let token = Lexer.yylex();
    if (token && token.type === 'gStatement') {
        let value = token.value;
        let moreSimbols = Simbolos_P();
        if (moreSimbols !== null) {
            return [value, ...moreSimbols];
        }
        return null;
    }
    Lexer.undoToken();
    return [];
}