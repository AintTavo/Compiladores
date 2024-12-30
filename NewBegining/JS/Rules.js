// Arreglo general de todas las reglas de produccion de la gramatica propuesta
class RulesNode {
    constructor(rules){
        this.type = 'GramaticRules';
        this.rules = rules; 
    }
}


// Son los nodos con el lado izquierdo de una Gramatica su lado izquierdo, el cual sera un arreglo de rightSideNode
class RuleNode {
    constructor(left, rights){
        this.type = 'Rule';
        this.left = left;
        this.rights = rights;
    }
}


// Es un array de strings con todo lo que seria parte del lado derecho de la gramatica
class RightSideNode {
    constructor(symbols){
        this.type = 'RightSide';
        this.symbols = symbols;
    }
}