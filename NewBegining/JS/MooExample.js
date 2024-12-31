//let Lexer = new GramaticLexer('<b> -> <a> | <c>;');
//console.log(StartDescent(Lexer));

let Lexer2 = new GramaticLexer(`
    <Holaxd> -> <d><c>; 
    `);

let a = parseAndMarkTerminals(Lexer2);

let ll1 = new LL1(`
    <E> -> <T><Ep>;
    <Ep> -> <Suma><T><Ep> | <Epsilon>;
    <T> -> <F><Tp>;
    <Tp> -> <Mult><F><Tp> | <Epsilon>;
    <F> -> <id> | <ParIzq><E><ParDer>;
    
`);


console.log(ll1.ll1Table);

let ll1_2 = new LL1(`
    <E> -> <T><Ep>;
    <Ep> -> <or><T><Ep> | <Epsilon>;
    <T> -> <C><Tp>;
    <Tp> -> <and><C><Tp> | <Epsilon>;
    <C> -> <F><Cp>;
    <Cp> -> <CerrPos><Cp> | <CerrKleene><Cp> | <Opcional><Cp> | <Epsilon>;
    <F> -> <simb> | <ParIzq><E><ParDer>;
`);

console.log(ll1_2);
/*
let tmpLexer;

while(!Lexer.tokenStack.isEmpty()){
    tmpLexer = Lexer.yylex();
    console.log(tmpLexer);
    if(tmpLexer.value === '<a>'){
        Lexer.undoToken();
        Lexer.saveState();
        Lexer.yylex();
    }
}

Lexer.loadState();
console.log(Lexer.yytry());
*/
