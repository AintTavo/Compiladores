//let Lexer = new GramaticLexer('<b> -> <a> | <c>;');
//console.log(StartDescent(Lexer));

let Lexer2 = new GramaticLexer(`
    <Holaxd> -> <d><c>; 
    `);

let a = parseAndMarkTerminals(Lexer2);

ll1 = new LL1(`
    <E> -> <T><Ep>;
    <Ep> -> <Suma><T><Ep> | <Epsilon>;
    <T> -> <F><Tp>;
    <Tp> -> <Mult><F><Tp> | <Epsilon>;
    <F> -> <id> | <ParIzq><E><ParDer>;
    
    `);



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
