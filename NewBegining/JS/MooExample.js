let Lexer = new GramaticLexer('<b> -> <a> | <c>;');
console.log(StartDescent(Lexer));

let Lexer2 = new GramaticLexer(`
    <b> -> <a> | <c> ;
    <d> -> <d><c>;
    `);

console.log(Lexer2);
console.log(StartDescent(Lexer2));

let Lexer3 = new GramaticLexer(`
    <Hola> -> <Hola><c>;
    `);

console.log(StartDescent(Lexer3));

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
