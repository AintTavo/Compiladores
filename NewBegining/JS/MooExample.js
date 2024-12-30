//let Lexer = new GramaticLexer('<b> -> <a> | <c>;');
//console.log(StartDescent(Lexer));

let Lexer2 = new GramaticLexer(`
    <Holaxd> -> <d><c>; 
    `);

console.log(Lexer2);
let Exampletoken = Lexer2.yylex();
console.log(Exampletoken.value);




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
