class LL1{
    ll1Table;
    firstList = [];
    followList = [];
    // Es una cadena ya procesada y postprocesada por las funciones de Recursive.js
    parserOutput;
    parserlog = [];

    // Es el constructor de la clase con un input sea Lexer o una simple cadena como estan definidas en lexer
    // genera los first los follow y la tabla LL1
    constructor (input) {
        try{
            let tmpFirst, tmpFollow;

            // Obtiene el AST de la cadena o Lexer ingresado
            this.parserOutput = parseAndMarkTerminals(input);
            
            for (const nonTerminal of this.parserOutput.nonTerminals) {
                // Calcula todos los FIRST de la gramatica
                tmpFirst = this.#first(nonTerminal);
                this.firstList = [...this.firstList, tmpFirst];
                
                
            }
            
            for(const nonTerminal of this.parserOutput.nonTerminals) {
                // Calcula todos los FOLLOW de la gramatica
                tmpFollow = this.#follow(nonTerminal);
                this.followList = [...this.followList, tmpFollow];
            }

            // Crea la tabla de la gramatica LL1 en base a los first y follow que haya encontrado
            this.ll1Table = this.#createLL1Table(this.parserOutput);
        }
        catch (error) {
            console.error(error);
        };
        
    }

    // Busca simbolos no terminales en el arbol del lado izquierdo de la gramatica y encuentra lo primero que genera la gramatica,
    // esto sin discriminar entre si es terminal o no terminal
    #searchInLeft(inputnonTerminal) {
        const Rules = this.parserOutput.ast.rules;
        for (const Rule of Rules) {
            let left = Rule.left.value;
            if (left === inputnonTerminal) {
                return Rule.rights;
            }
        }
        return null;
    }
    

    // #############################################################################################################################################################
    // Codigo First
    // Esta funcion le da formato a las salidas de #_first para ocupar luego las salidas de esta funcion, esto principalmente para saber
    // a que no terminal corresponde los first generados en la tabla de first
    #first (inputnonTerminal) {
        let FirstResults = new Set();
        FirstResults = this.#_first(inputnonTerminal)
        return {
            nonTerminal: inputnonTerminal,
            firsts: FirstResults,
        };
        
    }
    

    // Esta funcion recursiva define las salidas de esta, en caso de que 
    #_first(nonTerminal) {
        // Control de errores
        if (!this.parserOutput.nonTerminals.includes(nonTerminal)) {
            console.error("The entries at First are not nonTerminales of the gramatic");
            return [];
        }

        // Se busca la regla de producion en el arbol y se devuelven sus lados derechos para su analisis
        let ProductionRule = this.#searchInLeft(nonTerminal);
        let FirstReturn = new Set();
        if (!ProductionRule) {
            console.error('The production Rule does not exist');
        }

        for (const Rights of ProductionRule) {
            let FirstSymbol = Rights.symbols[0];
            if (FirstSymbol.isTerminal) {
                // Este first agrega valores los valores de los terminales de la rama a un arreglo
                FirstReturn = [...FirstReturn, FirstSymbol.value];
            }
            else {
                // Dado que el first recursivo de esta zona puede recibir arreglos mas grande de cardinalidad uno se ocupa
                // otro operador de propagavacion
                //                              |
                //                              v
                FirstReturn = [...FirstReturn, ...this.#_first(FirstSymbol.value)];
            }
        }

        // Regresa un arreglo con todo lo que encontro haciendo el first
        return FirstReturn;
    }
    
    //######################################################################################################################################################
    // Codigo Follow
    #SearchInRight(inputnonTerminal) {
        const {rules} = this.parserOutput.ast;

        let leftProducers = new Set();
        let nextSymbols = new Set();

        for (const rule of rules) {
            const leftSide = rule.left.value;
            const rights = rule.rights;

            for (const right of rights) {
                const symbols = right.symbols;

                for(let i = 0 ; i < symbols.length ; i++){
                    const symbol = symbols[i];
                    if (
                        symbol.value === inputnonTerminal &&
                        symbol.isTerminal === false
                    ) {
                        leftProducers.add(leftSide);
                        if (i + 1 < symbols.length) {
                            nextSymbols.add(symbols[i + 1].value);
                        }
                    }
                }
            }
        }
        return {
            leftProducers,
            nextSymbols
        }
    }

    #follow (inputnonTerminal) {
        

        let resultFollows = this.#_follow(inputnonTerminal);
        return {
            nonTerminal: inputnonTerminal,
            follows: resultFollows,
        };
    }

    #_follow(inputnonTerminal) {
        const nonTerminals = this.parserOutput.nonTerminals;

        // Correccion de errores
        if(!(nonTerminals.includes(inputnonTerminal))){
            console.error("The input is not a nonTerminal");
            return;
        }

        let FollowResults = new Set();
        
        // Busqueda que devuelve los lados izquierdos y los siguientes terminales o no terminales
        let SearchResults = this.#SearchInRight(inputnonTerminal);

        // Filtra y elimina si en left produces esta el mismo no terminal que en inputnonTerminal
        SearchResults.leftProducers.delete(inputnonTerminal);

        if(inputnonTerminal === nonTerminals[0])
            FollowResults = [...FollowResults, '$'];

        if (SearchResults.nextSymbols.size > 0) {
            for (const result of SearchResults.nextSymbols) {
                if (nonTerminals.includes(result)) {
                    let First = this.#_first(result);
                    if(First.includes('Epsilon')){
                        const FilterFirst = First.filter((FirstElement) => {return FirstElement !== 'Epsilon'} );
                        FollowResults = [...FollowResults, ...FilterFirst];
                        if(result !== inputnonTerminal){
                            FollowResults = [...FollowResults, ...this.#_follow(result)];
                        }   
                    }
                    else{
                        FollowResults = [...FollowResults, ...First];
                    }
                }
                else{
                    FollowResults = [...FollowResults, result];
                }
            }
        }
        else{
            for(const result of SearchResults.leftProducers) {
                FollowResults = [...FollowResults, ...this.#_follow(result)];
            }
        }
        return FollowResults;
    }

    // ##########################################################################################################################################
    // Codigo para la creacion de la tabla
    #searchInFirst (inputnonTerminal) {
        // Correccion de errores
        // Si no se han calculado todavia los first
        if(this.firstList.length === 0){
            console.error("The firsts havent been calculated");
            return;
        }

        // Verifica si la entrada de la funcion es un no terminal
        if (!this.parserOutput.nonTerminals.includes(inputnonTerminal)){
            console.error("The input is not a non terminal");
            return;
        }

        // Codigo principal
        for(const First of this.firstList){
            if (First.nonTerminal === inputnonTerminal) {
                return First.firsts;
            }
        }

        // No se calculo el first de ese no terminal (tambien es un error)
        console.error("The input havent been found");
        return;
    }

    #searhInFollow (inputnonTerminal) {
        // Correccion de errores
        // Si no se han calculado todavia los first
        if (this.followList.length === 0) {
            console.error("The follows havent been calculated");
            return;
        }

        // Verifica si la entrada de la funcion es un no terminal
        if (!this.parserOutput.nonTerminals.includes(inputnonTerminal)) {
            console.error("The input is not a non terminal");
            return;
        }

        // Codigo principal
        for (const Follow of this.followList) {
            if (Follow.nonTerminal === inputnonTerminal) {
                return Follow.follows;
            }
        }

        // No se calculo el first de ese no terminal (tambien es un error)
        console.error("The input havent been found");
        return;
    }

    /**
 * La función #searchProduction busca la producción adecuada dentro de un conjunto de reglas (Rules)
 * en base a un terminal de entrada (inputTerminal). Devuelve un Set con los símbolos de la producción
 * encontrada o null si no la encuentra.
 */
    #searchProduction(inputTerminal, inputNonTerminal, Rules) {
        let Result = new Set();   // Para almacenar la producción resultante
        let foundRule;           // Se usará para guardar la regla (o 'Right') que coincida

        // Si solo hay una regla en 'Rules', se asume esa por defecto
        if (Rules.length === 1) {
            foundRule = Rules[0].symbols;
        } else {
            // Si hay varias reglas, se recorre cada 'Right' en busca de la que coincida
            // con el primer símbolo igual a 'inputTerminal'
            for (const Right of Rules) {
                for (const Symbol of Right.symbols) {
                    if (Symbol.value === inputTerminal) {
                        foundRule = Right.symbols;
                        break;
                    }
                }
            }
        }

        // Si no se encuentra una regla, buscar en los FIRST de las reglas
        if (!foundRule) {
            for (const Right of Rules) {

                if (this.#searchInFirst(inputNonTerminal)) {
                    foundRule = Right.symbols; // Usa la primera regla cuyo FIRST contiene el símbolo buscado
                    break;
                }
            }
        }

        // Si aún no se encuentra una regla, maneja el error
        if (!foundRule) {
            console.log(`Input Terminal: ${inputTerminal}`);
            console.log(`Rules:`, Rules);
            console.error("No matching rule found for the inputTerminal");
            return null;
        }

        // Se convierte la regla encontrada en un conjunto de valores de los símbolos
        for (const Symbol of foundRule) {
            Result = [...Result, Symbol.value];
        }

        // Si se encontraron símbolos, se retornan. De lo contrario, se devuelve null.
        if (Result.length > 0) {
            return Result;
        }
        return null;
    }

    #createLL1Table(inputAST) {

        // Se obtienen la cantidad de no terminales y se preparan los terminales
        let lengthNonTerminals = inputAST.nonTerminals.length;
        let tmpTerminals = new Set();

        // Copiamos los terminales del AST, filtramos 'Epsilon' y agregamos '$'
        tmpTerminals = inputAST.terminals;
        tmpTerminals = tmpTerminals.filter((element) => { return element !== 'Epsilon'; });
        tmpTerminals = [...tmpTerminals, '$'];

        let lengthTerminals = tmpTerminals.length;

        // Se declara la matriz LL1table con tantas filas como no terminales
        let LL1table = new Array(lengthNonTerminals);

        // Se recorre cada no terminal para construir las filas
        for (let i = 0; i < lengthNonTerminals; i++) {
            let actualRow = inputAST.nonTerminals[i];
            // Se obtienen las reglas, sus FIRST y FOLLOW
            let rowRules = this.#searchInLeft(actualRow);
            let rowSymbols = this.#searchInFirst(actualRow);
            let rowFollows = this.#searhInFollow(actualRow);

            // Cada fila de la tabla tendrá tantas columnas como terminales
            LL1table[i] = new Array(lengthTerminals);

            // Se recorre cada terminal para llenar la columna correspondiente
            for (let j = 0; j < lengthTerminals; j++) {
                let tmpTerminal = tmpTerminals[j];

                // Inicialmente se llena la celda con información básica
                LL1table[i][j] = {
                    nonTerminal: actualRow,
                    terminal: tmpTerminal,
                };

                // Si el terminal actual pertenece al FIRST del no terminal,
                // se busca la producción y se asigna a la celda
                if (rowSymbols.includes(tmpTerminal)) {
                    let tmpRule = this.#searchProduction(tmpTerminal,actualRow, rowRules);
                    Object.assign(LL1table[i][j], { production: tmpRule });
                    continue;
                }
                // Si en FIRST hay 'Epsilon', se debe revisar si el terminal actual
                // pertenece a FOLLOW, para asignar la producción con 'Epsilon'
                else if (rowSymbols.includes('Epsilon')) {
                    if (rowFollows.includes(tmpTerminal)) {
                        Object.assign(LL1table[i][j], { production: 'Epsilon' });
                        continue;
                    }
                }

                // En caso de que no se cumpla ninguna de las condiciones anteriores,
                // la celda se marca con producción null
                Object.assign(LL1table[i][j], { production: null });
            }
        }

        // Regresa la tabla LL1 ya construida
        return LL1table;
    }

    
    // #########################################################################################################################################################
    // Codigo para parser

    #searchInLL1Table(inputnonTerminal, inputTerminal){
        // Correcion de errores
        if(!this.ll1Table){
            console.error("The LL1 Table hasnt been calculated");
            return null;
        }

        for(const Fila of this.ll1Table){
            for(const Columna of Fila){
                if(inputnonTerminal === Columna.nonTerminal && inputTerminal === Columna.terminal){
                    return Columna.production;
                }
            }
        }
        return null;
    }

    parse(inputText){
        //#######################################################################################################
        //Definicion de las palabras reservadas
        //#######################################################################################################
        let tokens = moo.compile({
            // Multi-character tokens
            ARROW: /->/,   
            G_STATEMENT: {                 // Reglas de la gramática
                match: /<[a-zA-Z][a-zA-Z0-9_]*>/,
                value: (text) => {
                    return text.slice(1, -1);
                },
            }, 
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

        //Obtencion de los tokesn de la cadena
        tokens.reset(inputText);

        let token;
        let tmpTokens = [];
        while (token = tokens.next()) {
            if (token.type === 'error') {
                console.error(`Unexpected character: ${token.value}`);
                return false;
            }
            if (token.type !== 'WS') {
                tmpTokens = [...tmpTokens, token.type];
            }

        }
        return this.#_parse(tmpTokens);
    }
    
    // Funcion para indicar si una 
    #_parse(inputTokenArray) {
        // Inicializacion de analisis
        let LL1Stack = new Stack();
        let LL1Queue = new Queue();
        this.parserlog = [];
        
        for(const element of inputTokenArray){
            LL1Queue.enqueue(element);
        }
        LL1Queue.enqueue('$');
        LL1Stack.push('$');
        LL1Stack.push(this.parserOutput.nonTerminals[0]);
        
        while(1){
            // Se guardan los siguientes valores en la pila y en la cola para determinar en los if como operar
            let peek = LL1Stack.peek();
            let front = LL1Queue.front();

            // Si las dos pila y cola son $ regresa un true
            if(peek === '$' && front === '$'){
                this.parserlog = [...this.parserlog, {
                    stack: LL1Stack.join(" "),
                    queue: LL1Queue.join(" "),
                    action: 'Acept'
                }];
                return true;
            }
                

            // Si se llega a $ en la pila y no se ha llegado a $ en la cola se regrea false
            if(peek === '$' && front !== '$'){
                this.parserlog = [...this.parserlog, {
                    stack: LL1Stack.join(" "),
                    queue: LL1Queue.join(" "),
                    action: 'Reject'
                }];
                return false;
            }
            
            // Si el caracter siguiente en la cadena de entra es igual al caracter de la pila se quitan ambos de su respectiva estructura de datos
            if(peek === front){
                this.parserlog = [...this.parserlog, {
                    stack: LL1Stack.join(" "),
                    queue: LL1Queue.join(" "),
                    action: 'pop',
                }];
                LL1Stack.pop();
                LL1Queue.dequeue();
                continue;
            }

            // Se busca la accion que llevar acabo en la tabla LL1 asociada al parser segun la gramatica con la que se construyo el objeto
            let actualProduction = this.#searchInLL1Table(peek, front);

            // si al buscarlo en la tabla es null regresa falso
            if(actualProduction === null){
                this.parserlog = [...this.parserlog, {
                    stack: LL1Stack.join(" "),
                    queue: LL1Queue.join(" "),
                    action: 'Reject',
                }];
                return false;
            }

            // si al buscarlo encuentra Epsilon quita el elemento de la pila y continua al siguiente ciclo
            if(actualProduction === 'Epsilon'){
                let action = `${peek} → ε`;
                this.parserlog = [...this.parserlog, {
                    stack: LL1Stack.join(" "),
                    queue: LL1Queue.join(" "),
                    action: action,
                }];
                LL1Stack.pop();
                continue;
            }
            else{
                let action = `${peek} → ${actualProduction.join(" ")}`;
                this.parserlog = [...this.parserlog, {
                    stack: LL1Stack.join(" "),
                    queue: LL1Queue.join(" "),
                    action: action,
                }];
                // En caso de no ser epsilon popea de igual manera el dato siguiente
                LL1Stack.pop();
                // Invierte la regla de produccion como la regresa actualProduction que es de la forma de un arreglo
                // [ a, b ,c , ...] y por medio  del operador de propagacion se invierten para luego agregar todos los elementos a la pila
                
                actualProduction = [...actualProduction].reverse();
                for(const element of actualProduction){
                    LL1Stack.push(element);
                }
                
                continue;
            }
        }
    }
}
