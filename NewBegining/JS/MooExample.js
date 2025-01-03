//let Lexer = new GramaticLexer('<b> -> <a> | <c>;');
//console.log(StartDescent(Lexer));

let Lexer2 = new GramaticLexer(`
    <Holaxd> -> <d><c>; 
    `);

let ll1 = new LL1(`
    <E> -> <T><Ep>;
    <Ep> -> <PLUS><T><Ep> | <Epsilon>;
    <T> -> <F><Tp>;
    <Tp> -> <MULT><F><Tp> | <Epsilon>;
    <F> -> <NUM> | <L_PAREN><E><R_PAREN>;
    
`);
let ll1Output = ll1.parse('2+(2)');
console.log(ll1Output);


console.log(ll1);

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

let ll1_3 = new LL1(`
    <S> -> <a><A><B><b>;
    <A> -> <c> | <Epsilon>;
    <B> -> <d> | <Epsilon>;
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
