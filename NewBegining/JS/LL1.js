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
            console.log(this.firstList);
            console.log(this.followList);

            // Crea la tabla de la gramatica LL1 en base a los first y follow que haya encontrado
            this.ll1Table = this.#createLL1Table(
                this.firstList, 
                this.followList, 
                this.parserOutput.ast
            );
        }
        catch (error) {
            console.error(error);
        };
        
    }

    // Busca simbolos no terminales en el arbol del lado izquierdo de la gramatica y encuentra lo primero que genera la gramatica,
    // esto sin discriminar entre si es terminal o no terminal
    #searchNonTerminalInTree(inputnonTerminal) {
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
        let ProductionRule = this.#searchNonTerminalInTree(nonTerminal);
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
        if(!(this.firstList)){
            console.error("The firsts havent been defined");
            return;
        }

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

    #createLL1Table(inputFirstList, inputFollowList, inputAST){
        return;
    }

    

    parse () {
        return;
    }
}