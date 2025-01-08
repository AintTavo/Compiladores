class LR0 {
    rules = [];
    nonTerminals = [];
    terminals = [];
    #analisisRules = [];
    

    constructor(input) {
        // 1) Construir gramática y reglas con punto
        let Rules = this.#ConstructorOfRules(input);
        this.rules = Rules.Gramatic;
        this.#analisisRules = Rules.forAnalisisItems;
        this.nonTerminals = Rules.nonTerminals;
        this.terminals = Rules.terminals;
        this.log = [];

        // 2) Construir autómata LR(0)
        this.states = [];
        this.transitions = {};
        this.#buildLR0Automaton();

        // 3) Construir la tabla LR(0) en forma de matriz [estados][símbolos]
        this.lr0Table = [];
        this.symbolIndex = {};
        this.#buildLR0Table();  // al final de este se guardará en this.symbolIndex

        // Mostrar para debug
        console.log('Estados:', this.states);
        console.log('Transiciones:', this.transitions);
        console.log('Tabla LR0 (matriz):', this.lr0Table);
        console.log('SymbolIndex:', this.symbolIndex);
    }

    #ConstructorOfRules(input) {
        // parseForLR0(input) es tu función que retorna un objeto con:
        // {
        //   ast: { rules: [ {left, rights:[ {symbols:[]} ]}, ... ] },
        //   nonTerminals: [...],
        //   terminals: [...],
        // }
        let lexer = parseForLR0(input);

        let Rules = [];
        let RulesForAnalsis = [];

        for (const Rule of lexer.ast.rules) {
            for (const Right of Rule.rights) {
                // Versión "A -> α"
                let tmpRule = new GramaticItems(Rule.left, [...Right.symbols]);
                Rules.push(tmpRule);

                // Versión "A -> . α"
                tmpRule = new GramaticItems(Rule.left, ['.', ...Right.symbols]);
                RulesForAnalsis.push(tmpRule);
            }
        }

        // Agrega '$' a la lista de terminales si no está
        if (!lexer.terminals.includes('$')) {
            lexer.terminals.push('$');
        }

        return {
            Gramatic: Rules,
            forAnalisisItems: RulesForAnalsis,
            nonTerminals: lexer.nonTerminals,
            terminals: lexer.terminals
        };
    }

    #buildLR0Automaton() {
        // Estado 0: clausura de la primera regla con punto
        const initialItem = this.#analisisRules[0];
        let I0 = this.#Clousure([initialItem]);

        this.states.push(I0);
        this.transitions[0] = {};

        let pending = [0];

        while (pending.length > 0) {
            let currentIndex = pending.shift();
            let currentState = this.states[currentIndex];

            // Para cada símbolo en terminals + nonTerminals, calculamos GoTo
            let allSymbols = [...this.terminals, ...this.nonTerminals];
            for (let symbol of allSymbols) {
                let auxGoto = this.#GoTo(currentState, symbol);
                if (auxGoto.length > 0) {
                    let closureGoto = this.#Clousure(auxGoto);

                    let existingStateIndex = this.#findStateIndex(closureGoto);
                    if (existingStateIndex === -1) {
                        existingStateIndex = this.states.length;
                        this.states.push(closureGoto);
                        this.transitions[existingStateIndex] = {};
                        pending.push(existingStateIndex);
                    }

                    this.transitions[currentIndex][symbol] = existingStateIndex;
                }
            }
        }
    }

    #findStateIndex(stateItems) {
        let stringified = JSON.stringify(
            stateItems.slice().sort((a, b) => a.left.localeCompare(b.left))
        );

        for (let i = 0; i < this.states.length; i++) {
            let candidate = JSON.stringify(
                this.states[i].slice().sort((a, b) => a.left.localeCompare(b.left))
            );
            if (stringified === candidate) {
                return i;
            }
        }
        return -1;
    }

    #GoTo(inputProductionArray, input) {
        let nextProduction = [];
        for (const Production of inputProductionArray) {
            let dotIndex = Production.right.indexOf('.');
            if (dotIndex === -1) continue;

            let next = dotIndex + 1;
            // Si el símbolo tras '.' coincide con 'input', avanzamos el punto
            if (next < Production.right.length && Production.right[next] === input) {
                // Crear copia
                let tmpProduction = new GramaticItems(Production.left, [...Production.right]);
                // Intercambiar
                [tmpProduction.right[next - 1], tmpProduction.right[next]] =
                    [tmpProduction.right[next], tmpProduction.right[next - 1]];
                nextProduction.push(tmpProduction);
            }
        }
        return nextProduction;
    }

    #Clousure(inputProductionArray, visited = new Set()) {
        for (const production of inputProductionArray) {
            let dotIndex = production.right.indexOf('.');
            if (dotIndex === -1) continue;

            const productionString = JSON.stringify(production);
            if (!visited.has(productionString)) {
                visited.add(productionString);
            }

            // Ver si después del punto hay un no terminal
            let nextSymbol = production.right[dotIndex + 1];
            if (dotIndex < production.right.length - 1 && this.nonTerminals.includes(nextSymbol)) {
                let rulesForNextSymbol = this.#SearchForNonTerminal(nextSymbol);
                for (const rule of (rulesForNextSymbol || [])) {
                    let newItem = {
                        left: rule.left,
                        right: [...rule.right]
                    };
                    let newItemString = JSON.stringify(newItem);
                    if (!visited.has(newItemString)) {
                        this.#Clousure([newItem], visited);
                    }
                }
            }
        }

        // De Set(JSON) a array
        return [...visited].map(item => JSON.parse(item));
    }

    #SearchForNonTerminal(inputNonTerminal) {
        if (!this.nonTerminals.includes(inputNonTerminal)) {
            return [];
        }
        let results = [];
        for (const Rule of this.#analisisRules) {
            if (Rule.left === inputNonTerminal) {
                results.push(new GramaticItems(Rule.left, [...Rule.right]));
            }
        }
        return results;
    }

    #buildLR0Table() {
        // 1) Definir las columnas (terminales y no terminales)
        const allSymbols = [...this.terminals, ...this.nonTerminals];
    
        // 2) Crear un índice de símbolos (terminales y no terminales)
        let symbolIndex = {};
        allSymbols.forEach((sym, i) => symbolIndex[sym] = i);
    
        // 3) Crear la matriz de la tabla LR(0)
        this.lr0Table = Array.from({ length: this.states.length }, () =>
            Array.from({ length: allSymbols.length }, () => ({
                StateIndex: null,
                Symbolo: null,
                TipoDeProduccion: null,
                Regla: null
            }))
        );
    
        // 4) Llenar las transiciones Shift y Goto
        for (let i = 0; i < this.states.length; i++) {
            for (let symbol in this.transitions[i]) {
                let nextState = this.transitions[i][symbol];
                let col = symbolIndex[symbol];
                if (col === undefined) {
                    console.warn(`Símbolo ${symbol} no está en el índice.`);
                    continue;
                }
    
                if (this.nonTerminals.includes(symbol)) {
                    this.lr0Table[i][col] = {
                        StateIndex: nextState,
                        Symbolo: symbol,
                        TipoDeProduccion: "Goto"
                    };
                } else {
                    this.lr0Table[i][col] = {
                        StateIndex: nextState,
                        Symbolo: symbol,
                        TipoDeProduccion: "Shift"
                    };
                }
            }
        }
    
        // 5) Llenar las acciones Reduce y Accept
        for (let i = 0; i < this.states.length; i++) {
            for (let item of this.states[i]) {
                let dotIndex = item.right.indexOf('.');
    
                if (dotIndex === item.right.length - 1) {
                    // Regla completada (Reduce o Accept)
                    let prodLeft = item.left;
                    let prodRight = [...item.right];
                    prodRight.splice(dotIndex, 1); // Eliminar el punto
    
                    if (prodLeft === "Start") {
                        // Si es la regla de aceptación
                        let colDollar = symbolIndex['$'];
                        if (colDollar !== undefined) {
                            this.lr0Table[i][colDollar] = {
                                StateIndex: null,
                                Symbolo: '$',
                                TipoDeProduccion: "Accept",
                                Regla: { left: prodLeft, right: prodRight }
                            };
                        }
                    } else {
                        // Si es una regla de reducción
                        for (let t of this.terminals) {
                            let colTerm = symbolIndex[t];
                            if (colTerm !== undefined) {
                                this.lr0Table[i][colTerm] = {
                                    StateIndex: null,
                                    Symbolo: t,
                                    TipoDeProduccion: "Reduce",
                                    Regla: { left: prodLeft, right: prodRight }
                                };
                            }
                        }
    
                        // Agregar Reduce para el símbolo '$'
                        let colDollar = symbolIndex['$'];
                        if (colDollar !== undefined) {
                            this.lr0Table[i][colDollar] = {
                                StateIndex: null,
                                Symbolo: '$',
                                TipoDeProduccion: "Reduce",
                                Regla: { left: prodLeft, right: prodRight }
                            };
                        }
                    }
                }
            }
        }
    
        // Guardar el índice de símbolos para referencia
        this.symbolIndex = symbolIndex;
        console.log("Tabla LR(0) construida correctamente:", this.lr0Table);
    }
    

    parse(inputText) {
        // Ajusta tus tokens según tu gramática
        let tokens = moo.compile({
            // Multi-character tokens
            // Logicos
            KLEENE_CL: /\#\*/,
            POSITIV_CL: /\#\+/,
            // Comparacion
            EQ: /==/,
            NEQ: /!=/,
            LEQ: /<=/,
            GEQ: />=/,

            // Asignacion
            PLUS_ASSIGN: /\+=/,
            MINUS_ASSIGN: /-=/,
            MULT_ASSIGN: /\*=/,
            DIV_ASSIGN: /\/=/,
            // Single-character operators
            //Aritmeticos
            PLUS: /\+/,
            MULT: /\*/,
            DIV: /\//,
            MINUS: /-/,
            POW: /\^/,
            // Logicos
            OR: /\|/,
            AND: /&/,
            OPCIONAL: /\?/,
            // De agrupacion
            L_PAREN: /\(/,
            R_PAREN: /\)/,
            L_BRACKET: /\[/,
            R_BRACKET: /\]/,
            L_BRACE: /\{/,
            R_BRACE: /\}/,
            // Fines de Linea
            COMA: /,/,
            SEMICOLON: /;/,
            COLON: /:/,
            // Comparacion
            LT: /</,
            GT: />/,
            // Asignacion
            ASSIGN: /=/,
            // Numbers (integer and decimal)
            NUM: /[0-9]+(?:\.[0-9]+)?/,
            // Identifiers
            ID: /[a-zA-Z]+/,
            // Optional: Whitespace
            WS: { match: /[ \t\n\r]+/, lineBreaks: true, ignore: true },
            // Error handling
            error: /./,
        });

        tokens.reset(inputText);

        let token;
        let tmpTokens = [];
        while (token = tokens.next()) {
            if (token.type === 'error') {
                console.error('Unexpected character: ${ token.value }');
                return false;
            }
            if (token.type !== 'WS') {
                tmpTokens.push(token.type);
            }
        }
        // Añadimos '$' al final
        tmpTokens.push('$');

        return this.#_parse(tmpTokens);
    }

    #_parse(tokensArray) {
        let stack = [0]; // Iniciamos con estado 0
        let idx = 0;
        let currentToken = tokensArray[idx];
        console.log(tokensArray);

        while (true) {
            let state = stack[stack.length - 1];
            let col = this.symbolIndex[currentToken];

            if (col === undefined) {
                console.error(`Token ${currentToken} no existe en symbolIndex`);
                return false;
            }

            let actionCell = this.lr0Table[state][col];
            if (!actionCell || actionCell.TipoDeProduccion === null) {
                console.error(`No hay acción para(estado = ${ state }, token = ${ currentToken })`);
                return false;
            }

            switch (actionCell.TipoDeProduccion) {
                case 'Shift': {
                    stack.push(actionCell.StateIndex);
                    idx++;
                    currentToken = tokensArray[idx];
                    break;
                }
                case 'Goto': {
                    stack.push(actionCell.StateIndex);
                    break;
                }
                case 'Reduce': {
                    let { left, right } = actionCell.Regla;
                    let alphaLength = right.length;
                    for (let i = 0; i < alphaLength; i++) {
                        stack.pop();
                    }
                    let topState = stack[stack.length - 1];
                    let gotoCol = this.symbolIndex[left];
                    if (gotoCol === undefined) {
                        console.error(`'No existe gotoCol para ${left}`);
                        return false;
                    }
                    let gotoCell = this.lr0Table[topState][gotoCol];
                    if (!gotoCell || gotoCell.TipoDeProduccion !== 'Goto') {
                        console.error(`No hay goto en(estado = ${ topState }, simbolo = ${ left })`);
                        return false;
                    }
                    stack.push(gotoCell.StateIndex);
                    break;
                }
                case 'Accept': {
                    console.log("Cadena válida sintácticamente (LR(0) ACCEPT).");
                    return true;
                }
                default: {
                    console.error(`Acción desconocida: ${ actionCell.TipoDeProduccion }`);
                    return false;
                }
            }
        }
    }
    parseStepByStep(inputText) {
        let tokens = moo.compile({
            KLEENE_CL: /\#\*/,
            POSITIV_CL: /\#\+/,
            EQ: /==/,
            NEQ: /!=/,
            LEQ: /<=/,
            GEQ: />=/,
            PLUS_ASSIGN: /\+=/,
            MINUS_ASSIGN: /-=/,
            MULT_ASSIGN: /\*=/,
            DIV_ASSIGN: /\/=/,
            PLUS: /\+/,
            MULT: /\*/,
            DIV: /\//,
            MINUS: /-/,
            POW: /\^/,
            OR: /\|/,
            AND: /&/,
            OPCIONAL: /\?/,
            L_PAREN: /\(/,
            R_PAREN: /\)/,
            L_BRACKET: /\[/,
            R_BRACKET: /\]/,
            L_BRACE: /\{/,
            R_BRACE: /\}/,
            COMA: /,/,
            SEMICOLON: /;/,
            COLON: /:/,
            LT: /</,
            GT: />/,
            ASSIGN: /=/,
            NUM: /[0-9]+(?:\.[0-9]+)?/,
            ID: /[a-zA-Z]+/,
            WS: { match: /[ \t\n\r]+/, lineBreaks: true, ignore: true },
            error: /./,
        });
    
        tokens.reset(inputText);
    
        let token;
        let tmpTokens = [];
        while ((token = tokens.next())) {
            if (token.type === 'error') {
                console.error(`Unexpected character: ${token.value}`);
                return false;
            }
            if (token.type !== 'WS') {
                tmpTokens.push(token.type);
            }
        }
        tmpTokens.push('$');
    
        return this.#_parseStepByStep(tmpTokens);
    }
    
    #_parseStepByStep(tokensArray) {
        let stack = [0]; // Iniciamos con el estado 0
        let idx = 0;
        let currentToken = tokensArray[idx];
        this.log = []; // Limpiamos el registro de logs antes de empezar
    
        console.log("Inicio del análisis LR(0):");
    
        while (true) {
            let state = stack[stack.length - 1];
            let col = this.symbolIndex[currentToken];
    
            if (col === undefined) {
                console.error(`Token ${currentToken} no existe en symbolIndex`);
                this.log.push({
                    pila: [...stack],
                    tokenActual: currentToken,
                    accion: "Error",
                    detalle: `Token no existe en symbolIndex`
                });
                return false;
            }
    
            let actionCell = this.lr0Table[state][col];
            if (!actionCell || actionCell.TipoDeProduccion === null) {
                console.error(`No hay acción para (estado = ${state}, token = ${currentToken})`);
                this.log.push({
                    pila: [...stack],
                    tokenActual: currentToken,
                    accion: "Error",
                    detalle: `No hay acción para este estado y token`
                });
                return false;
            }
    
            let stepLog = {
                pila: [...stack],
                tokenActual: currentToken,
                accion: actionCell.TipoDeProduccion,
            };
    
            switch (actionCell.TipoDeProduccion) {
                case 'Shift': {
                    stack.push(actionCell.StateIndex);
                    idx++;
                    currentToken = tokensArray[idx];
                    stepLog.detalle = `Desplazar y avanzar a estado ${actionCell.StateIndex}`;
                    this.log.push(stepLog);
                    break;
                }
                case 'Goto': {
                    stack.push(actionCell.StateIndex);
                    stepLog.detalle = `Ir a estado ${actionCell.StateIndex}`;
                    this.log.push(stepLog);
                    break;
                }
                case 'Reduce': {
                    let { left, right } = actionCell.Regla;
                    let alphaLength = right.length;
                    for (let i = 0; i < alphaLength; i++) {
                        stack.pop();
                    }
                    let topState = stack[stack.length - 1];
                    let gotoCol = this.symbolIndex[left];
                    if (gotoCol === undefined) {
                        console.error(`No existe gotoCol para ${left}`);
                        stepLog.accion = "Error";
                        stepLog.detalle = `No existe gotoCol para ${left}`;
                        this.log.push(stepLog);
                        return false;
                    }
                    let gotoCell = this.lr0Table[topState][gotoCol];
                    if (!gotoCell || gotoCell.TipoDeProduccion !== 'Goto') {
                        console.error(`No hay goto en (estado = ${topState}, simbolo = ${left})`);
                        stepLog.accion = "Error";
                        stepLog.detalle = `No hay goto en (estado = ${topState}, simbolo = ${left})`;
                        this.log.push(stepLog);
                        return false;
                    }
                    stack.push(gotoCell.StateIndex);
                    stepLog.detalle = `Reducir por regla ${left} → ${right.join(' ')}`;
                    this.log.push(stepLog);
                    break;
                }
                case 'Accept': {
                    console.log("✅ Cadena válida sintácticamente (LR(0) ACCEPT).");
                    stepLog.detalle = "Cadena aceptada.";
                    this.log.push(stepLog);
                    return true;
                }
                default: {
                    console.error(`Acción desconocida: ${actionCell.TipoDeProduccion}`);
                    stepLog.accion = "Error";
                    stepLog.detalle = `Acción desconocida: ${actionCell.TipoDeProduccion}`;
                    this.log.push(stepLog);
                    return false;
                }
            }
        }
    }
    
    
}

class GramaticItems {
    constructor(left, rightSide) {
        this.left = left;
        this.right = [...rightSide];
    }
}