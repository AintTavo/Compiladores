class LR0{
    rules = [];
    nonTerminals = [];
    terminals = [];
    #analisisRules = [];

    constructor(input){
        let Rules = this.#ConstructorOfRules(input);
        this.rules = Rules.Gramatic;
        this.#analisisRules = Rules.forAnalisisItems;
        this.nonTerminals = Rules.nonTerminals;
        this.terminals = Rules.terminals;

        let aux = this.#GoTo(this.#analisisRules, 'd');
        console.log(aux);
        let aux_1 = this.#Clousure([this.#analisisRules[0], this.#analisisRules[2]]);
        console.log(aux_1);


    }

    #ConstructorOfRules(input){
        let lexer = parseForLR0(input);
        let Rules = [];
        let RulesForAnalsis = [];
        for(const Rule of lexer.ast.rules){
            for(const Right of Rule.rights){
                let tmpRule = new GramaticItems(Rule.left, [...Right.symbols]);
                Rules = [...Rules, tmpRule];
                tmpRule = new GramaticItems(Rule.left, ['.', ...Right.symbols]);
                RulesForAnalsis = [...RulesForAnalsis, tmpRule];
            }
        }
        return {Gramatic: Rules,forAnalisisItems: RulesForAnalsis,nonTerminals: lexer.nonTerminals,terminals: lexer.terminals}
    }

    /**
     * 
     * @param {Array} inputProduction 
     * @param {string} input 
     */
    #GoTo(inputProductionArray, input){
        let nextProduction = [];
        for(const Production of inputProductionArray){
            let dotIndex = Production.right.indexOf('.');
            if(dotIndex === -1){
                console.error('Not founded Dot in Rule')
                continue;
            }
            let next = dotIndex + 1;
            if(next < Production.right.length && Production.right[next] === input){
                let tmpProduction = new GramaticItems(Production.left, Production.right);
                let aux = tmpProduction.right[next];
                tmpProduction.right[next] = tmpProduction.right[next-1];
                tmpProduction.right[next-  1] = aux;
                nextProduction = [...nextProduction, tmpProduction];
            }
        }
        if(nextProduction.length !== 0 ){
            return nextProduction;
        }
        return [];
    }

    /**
     * 
     * @param {Array} inputProductionArray 
     */
    #Clousure(inputProductionArray) {
        let Clousure = [];
        for (const Production of inputProductionArray) {
            let dotIndex = Production.right.indexOf('.');
            if (dotIndex === -1) {
                console.error(`La producción ${Production.left} → ${Production.right.join(' ')} no contiene un punto.`);
                continue;
            }
            let next = dotIndex + 1;
            if (next < Production.right.length && this.nonTerminals.includes(Production.right[next])) {
                let RulesAsociated = [];
                RulesAsociated = this.#SearchForNonTerminal(Production.right[next]);
                console.log(RulesAsociated);
                if (RulesAsociated) {
                    Clousure = [...Clousure, ...RulesAsociated, ...this.#Clousure(RulesAsociated)];
                }
            }
            // Si next >= Production.right.length, no hay símbolo después del punto
        }
        if (Clousure.length !== 0) {
            return Clousure;
        }
        return [];
    }

    
    #SearchForNonTerminal(inputNonTerminal){
        if(!this.nonTerminals.includes(inputNonTerminal)){
            console.error('The input is not a non terminal');
            return null;
        }
        let SearchResults = [];
        for(const Rule of this.#analisisRules){
            if(Rule.left === inputNonTerminal){
                let tmpResult = new GramaticItems(Rule.left, Rule.right);
                SearchResults = [...SearchResults, tmpResult];
            }
        }
        return SearchResults;
    }

}

class GramaticItems{
    constructor(left, rightSide){
        this.left = left;
        this.right = [...rightSide];
    }
}
