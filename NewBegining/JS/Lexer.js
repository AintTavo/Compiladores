class GramaticLexer {
    constructor(input) {
        // Inicializar las pilas
        this.tokenStack = new Stack();
        this.undoStack = new Stack();
        this.tmpTokenStack = new Stack();
        this.tmpUndoStack = new Stack();

        this.lexer = moo.compile({
            arrow: /->/,                  // Flechas
            gStatement: /<[a-zA-Z]+>/,    // Reglas de la gramática
            or: /\|/,                     // Operador OR
            endLn: /\;/,                  // Final de línea
            WS: { match: /[ \t\n\r]+/, lineBreaks: true }, // Espacios y saltos de línea
            error: { match: /./ },
        });

        // Determinar si el argumento es texto o una instancia de GramaticLexer
        if (typeof input === 'string') {
            if (input.trim() === '') {
                console.warn('Input string is empty. Lexer initialized without tokens.');
                return;
            }
            this._initializeFromText(input);
        } else if (input instanceof GramaticLexer) {
            this._cloneFromLexer(input);
        } else {
            throw new Error(
                'Constructor requires a string input or an instance of GramaticLexer.'
            );
        }
    }

    _initializeFromText(inputText) {
        this.lexer.reset(inputText);

        // Procesar los tokens generados por moo
        const tmpLexerTokens = Array.from(this.lexer).reverse();

        // Filtrar y agregar solo los tokens que no sean de tipo WS
        for (const token of tmpLexerTokens) {
            if (token.type !== 'WS') { // Solo agregar si el tipo no es WS
                this.tokenStack.push(token);
            }
        }
    }

    _cloneFromLexer(existingLexer) {
        this.tokenStack = existingLexer.tokenStack.clone();
        this.undoStack = existingLexer.undoStack.clone();
        this.tmpTokenStack = existingLexer.tmpTokenStack.clone();
        this.tmpUndoStack = existingLexer.tmpUndoStack.clone();
    }

    reset(inputText) {
        // Validar el nuevo texto de entrada
        if (typeof inputText !== 'string' || inputText.trim() === '') {
            throw new Error('Reset requires a non-empty string input.');
        }

        // Reiniciar el lexer y procesar los tokens
        this.tokenStack = new Stack();
        this.undoStack = new Stack();
        this._initializeFromText(inputText);
    }

    yylex() {
        if (this.tokenStack.isEmpty()) {
            return null; // Manejo de caso: no hay más tokens
        }
        const tmpLastToken = this.tokenStack.pop(); // Sacar el último token
        this.undoStack.push(tmpLastToken);         // Guardar en undoStack
        return tmpLastToken;                       // Devolver el token
    }

    yytry() {
        // Es el peek de la parte de lo último que hay en la cola
        if (this.tokenStack.isEmpty()) {
            return null;
        }
        const tmpNextToken = this.tokenStack.peek();
        return tmpNextToken;
    }

    undoToken() {
        if (!this.undoStack.isEmpty()) {
            this.tokenStack.push(this.undoStack.pop());
        }
    }

    saveState() {
        this.tmpTokenStack = this.tokenStack.clone(); // Clonar tokenStack
        this.tmpUndoStack = this.undoStack.clone();   // Clonar undoStack
    }

    loadState() {
        if (!this.tmpTokenStack || !this.tmpUndoStack) {
            throw new Error('No saved state to load. Call saveState() first.');
        }
        this.tokenStack = this.tmpTokenStack.clone(); // Restaurar tokenStack
        this.undoStack = this.tmpUndoStack.clone();   // Restaurar undoStack
    }
}
