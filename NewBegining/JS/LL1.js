class LL1{
    ll1Table;
    firstList = [];
    followList = [];
    // Es una cadena ya procesada y postprocesada por las funciones de Recursive.js
    parserOutput;

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
            this.ll1Table = this.#createLL1Table(
                this.firstList, 
                this.followList, 
                this.parserOutput
            );

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

    #searchProduction(inputTerminal, Rules){
        let Result = new Set();
        let foundRule;
        if(Rules.length === 1){
            foundRule = Rules[0].symbols;
        }
        else{
            for (const Right of Rules) {
                if (Right.symbols[0].value === inputTerminal)
                    foundRule = Right.symbols;
            }
        }


        for(const Symbol of foundRule){
            Result = [...Result, Symbol.value];
        }
        if(Result.length > 0)
            return Result;
        return null;
    }

    #createLL1Table(inputFirstList, inputFollowList, inputAST){
        
        let lengthNonTerminals = inputAST.nonTerminals.length;
        let tmpTerminals = new Set();

        tmpTerminals = inputAST.terminals;
        tmpTerminals = tmpTerminals.filter( (element) => { return element !== 'Epsilon'});
        tmpTerminals = [...tmpTerminals, '$'];
        let lengthTerminals = tmpTerminals.length;

        // Declaracion de una matriz en JS, al parecer no hay matrices ya directamente declaradas
        let LL1table = new Array(lengthNonTerminals);

        for(let i = 0 ; i < lengthNonTerminals ; i++){
            // Generacion de todo loq ue se va a ocupar en el 
            let actualRow = inputAST.nonTerminals[i];
            let rowRules = this.#searchInLeft(actualRow);
            let rowSymbols = this.#searchInFirst(actualRow);
            let rowFollows = this.#searhInFollow(actualRow);
            LL1table[i] = new Array(lengthTerminals);

            for(let j = 0 ; j < lengthTerminals ; j++){
                let tmpTerminal = tmpTerminals[j];
                // Encabezado principal de cada celda de la matriz
                LL1table[i][j] = {
                    nonTerminal: actualRow,
                    terminal: tmpTerminal,
                };
                if(rowSymbols.includes(tmpTerminal)){
                    let tmpRule = this.#searchProduction(tmpTerminal, rowRules);
                    Object.assign(LL1table[i][j], { production: tmpRule });
                    continue;
                }
                else if(rowSymbols.includes('Epsilon')) {
                    if(rowFollows.includes(tmpTerminal)){
                        Object.assign(LL1table[i][j], { production: ['Epsilon'] });
                        continue;
                    }
                }
                
                Object.assign(LL1table[i][j], { production: null });
            }
        }

        return LL1table;
    }

    

    parse () {
        return;
    }
}