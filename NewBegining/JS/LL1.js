class LL1{
    ll1Table;
    firstList = [];
    followList = [];
    // Es una cadena ya procesada y postprocesada por las funciones de Recursive.js
    #parserOutput;

    // Es el constructor de la clase con un input sea Lexer o una simple cadena como estan definidas en lexer
    // genera los first los follow y la tabla LL1
    constructor (input) {
        try{
            let tmpFirst, tmpFollow;

            // Obtiene el AST de la cadena o Lexer ingresado
            this.#parserOutput = parseAndMarkTerminals(input);
            console.log(this.#parserOutput);

            for (const nonTerminal of this.#parserOutput.nonTerminals) {
                // Calcula todos los FIRST de la gramatica
                tmpFirst = this.#first(nonTerminal);
                this.firstList = [...this.firstList, tmpFirst];
                
                // Calcula todos los FOLLOW de la gramatica
                tmpFollow = this.#follow(nonTerminal);
                this.followList = [...this.followList, tmpFollow];
            }
            console.log(this.firstList);

            // Crea la tabla de la gramatica LL1 en base a los first y follow que haya encontrado
            this.ll1Table = this.#createLL1Table(
                this.firstList, 
                this.followList, 
                this.#parserOutput.ast
            );
        }
        catch (error) {
            console.error(error);
        };
        
    }

    // Busca simbolos no terminales en el arbol del lado izquierdo de la gramatica y encuentra lo primero que genera la gramatica,
    // esto sin discriminar entre si es terminal o no terminal
    #searchNonTerminalInTree(inputnonTerminal) {
        const Rules = this.#parserOutput.ast.rules;
        for (const Rule of Rules) {
            let left = Rule.left.value;
            if (left === inputnonTerminal) {
                return Rule.rights;
            }
        }
        return null;
    }
    

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
        if (!this.#parserOutput.nonTerminals.includes(nonTerminal)) {
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
    
    

    #follow (inputnonTerminal) {
        return [];
    }

    #createLL1Table(inputFirstList, inputFollowList, inputAST){
        return;
    }

    

    parse () {
        return;
    }
}