//let Lexer = new GramaticLexer('<b> -> <a> | <c>;');
//console.log(StartDescent(Lexer));

// -------------------------------------------
// EJEMPLO DE USO
// -------------------------------------------
//let Lexer = new GramaticLexer('<b> -> <a> | <c>;');
//console.log(StartDescent(Lexer));

let a = new LR0(`
    <E> -> <T><Ep>;
    <Ep> -> <PLUS><T><Ep> | <Epsilon>;
    <T> -> <F><Tp>;
    <Tp> -> <MULT><F><Tp> | <Epsilon>;
    <F> -> <L_PAREN><E><R_PAREN> | <NUM>;
`);
let aux = a.parse("2 * 5");
console.log(aux);




let ll1_2 = new LL1(`
    <E> -> <T><Ep>;
    <Ep> -> <OR><T><Ep> | <Epsilon>;
    <T> -> <C><Tp>;
    <Tp> -> <AND><C><Tp> | <Epsilon>;
    <C> -> <F><Cp>;
    <Cp> -> <POSITIV_CL><Cp> | <KLEENE_CL><Cp> | <OPCIONAL><Cp> | <Epsilon>;
    <F> -> <ID> | <L_PAREN><E><R_PAREN>;
`);




console.log(ll1_2);

let ll1_3 = new LL1(`
    <S> -> <a><A><B><b>;
    <A> -> <c> | <Epsilon>;
    <B> -> <d> | <Epsilon>;
`);

let ll1_Prof = new LL1(`
    <G> -> <ListaDeReglas>;
    <ListaDeReglas> -> <Reglas> <SEMICOLON> <ListaDeReglasP>;
    <ListaDeReglasP> -> <Reglas> <SEMICOLON> <ListaDeReglasP> | <Epsilon>;
    <Reglas> -> <LadoIzquierdo> <ARROW> <LadosDerechos>;
    <LadoIzquierdo> -> <G_STATEMENT>;
    <LadosDerechos> -> <LadoDerecho> <LadosDerechosP>;
    <LadosDerechosP> -> <OR> <LadoDerecho> <LadosDerechosP> | <Epsilon>;
    <LadoDerecho> -> <SecSimbolos>;
    <SecSimbolos> -> <G_STATEMENT> <SecSimbolosP>;
    <SecSimbolosP> -> <G_STATEMENT> <SecSimbolosP> | <Epsilon>;
`);