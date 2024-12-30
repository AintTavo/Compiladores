class GramaticLexer {
    constructor(input) {
        // Inicializar las pilas
        this.tokenStack = new Stack();
        this.undoStack = new Stack();
        this.tmpTokenStack = new Stack();
        this.tmpUndoStack = new Stack();

        this.lexer = moo.compile({
            arrow: /->/,                  // Flechas
            gStatement: {                 // Reglas de la gramática
                match: /<[a-zA-Z][a-zA-Z0-9_]*>/,
                value: (text) => {
                    return text.slice(1,-1);
                },
            },     
            or: /\|/,                     // Operador OR
            endLn: /\;/,                  // Final de línea
            WS: { 
                match: /[ \t\n\r]+/, 
                lineBreaks: true, 
            }, // Espacios y saltos de línea
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
            if (token.type !== 'WS') {
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
        if (typeof inputText !== 'string' || inputText.trim() === '') {
            throw new Error('Reset requires a non-empty string input.');
        }

        this.tokenStack = new Stack();
        this.undoStack = new Stack();
        this._initializeFromText(inputText);
    }

    yylex() {
        if (this.tokenStack.isEmpty()) {
            return null;
        }
        const tmpLastToken = this.tokenStack.pop();
        this.undoStack.push(tmpLastToken);
        return tmpLastToken;
    }

    yytry() {
        if (this.tokenStack.isEmpty()) {
            return null;
        }
        return this.tokenStack.peek();
    }

    undoToken() {
        if (!this.undoStack.isEmpty()) {
            this.tokenStack.push(this.undoStack.pop());
        }
    }

    // ----------------------------------------------------------------------
    // Métodos para “snapshot” (guardar / restaurar) usando stacks temporales
    // ----------------------------------------------------------------------
    saveState() {
        this.tmpTokenStack = this.tokenStack.clone();
        this.tmpUndoStack = this.undoStack.clone();
    }

    loadState() {
        if (!this.tmpTokenStack || !this.tmpUndoStack) {
            throw new Error('No saved state to load. Call saveState() first.');
        }
        this.tokenStack = this.tmpTokenStack.clone();
        this.undoStack = this.tmpUndoStack.clone();
    }

    // ----------------------------------------------------------------------
    // Métodos clone() y restore() 
    // ----------------------------------------------------------------------

    /**
     * Crea y devuelve una nueva instancia de GramaticLexer
     * copiando el estado actual (tokenStack, undoStack, etc.).
     */
    clone() {
        return new GramaticLexer(this);
    }

    /**
     * Restaura (sobrescribe) el estado actual con el de otro lexer.
     * @param {GramaticLexer} lexerState - Instancia de GramaticLexer
     *                                     de la que se copiará el estado.
     */
    restore(lexerState) {
        this._cloneFromLexer(lexerState);
    }
}