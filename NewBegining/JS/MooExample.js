
const lexer = moo.compile({
    number: /[0-9]+(?:\.[0-9]+)?/,
    variable: /[a-zA-Z_][a-zA-Z0-9_]*/,
    plus: /\+/,
    minus: /-/,
    multiplication: /\*/,
    divide: /\//,
    lparen: /\(/,
    rparen: /\)/,
    space: { match: /\s+/, lineBreaks: true },
    error: {match: /.+/, lineBreaks: true },
});

lexer.reset('x + 42.5 - y * 8 / nombre_Variable');
for(const token of lexer){
    if(token.type === 'error'){
        console.error('token')
    }
    else if(token.type != 'space'){
        console.log(token.type);
    }
}