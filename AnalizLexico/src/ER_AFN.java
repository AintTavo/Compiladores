import java.io.IOException;

public class ER_AFN {
    String ExpReg;
    public AFN Result;
    public AnalizLexico L;

    public ER_AFN(String sigma, String FileAFD, int IdentifAFD) throws IOException {
        ExpReg = sigma;
        L = new AnalizLexico(ExpReg, FileAFD, IdentifAFD);
    }

    public void setExpresion(String sigma) {
        ExpReg = sigma;
        L.SetSigma(sigma);
    }

    public boolean IniConversion() {
        int Token;
        AFN f = new AFN();
        if (E(f)) {
            Token = L.yylex();
            if (Token == 0) {
                this.Result = f;
                return true;
            }
        }
        return false;
    }

    public boolean E(AFN f) {
        if (T(f)) {
            if (Ep(f)) {
                return true;
            }
        }
        return false;
    }

    public boolean Ep(AFN f) {
        int Token;
        AFN f2 = new AFN();
        Token = L.yylex();
        if (Token == 10) { // OR
            if (T(f2)) {
                f.unirAFN(f2);
                if (Ep(f)) {
                    return true;
                }
                return false;
            }
        }
        L.UndoToken();
        return true;
    }

    boolean T(AFN f) {
        if (C(f)) {
            if (Tp(f)) {
                return true;
            }
        }
        return false;
    }

    public boolean Tp(AFN f) {
        int Token;
        AFN f2 = new AFN();
        Token = L.yylex();
        if (Token == 20) { // CONCATENACION
            if (C(f2)) {
                f.ConcAFN(f2);
                if (Tp(f)) {
                    return true;
                }
            }
            return false;
        }
        L.UndoToken();
        return true;
    }

    public boolean C(AFN f) {
        if (F(f)) {
            if (Cp(f)) {
                return true;
            }
        }
        return false;
    }

    public boolean Cp(AFN f) {
        int Token;
        Token = L.yylex();
        switch (Token) {
            case 30: // CERRADURA TRANSITIVA
                f.CerrPos();
                if (Cp(f)) {
                    return true;
                }
                return false;

            case 40: // CERRADURA DE KLEENE
                f.CerrKleen();
                if (Cp(f)) {
                    return true;
                }
                return false;
            case 50: // CERRADURA OPC
                f.Opcional();
                if (Cp(f)) {
                    return true;
                }
                return false;
        }
        L.UndoToken();
        return true;
    }

    public boolean F(AFN f) {
        int Token;
        char simb1, simb2;
        Token = L.yylex();
        switch (Token) {
            case 60: // PARENTESIS IZQUIERDO
                if (E(f)) {
                    Token = L.yylex();
                    if (Token == 70) { // PARENTESIS DERECHO
                        return true;
                    }
                }
                return false;
            case 80: // CORCHETE IZQ
                Token = L.yylex();
                if (Token == 110) { // SIMBOLO
                    simb1 = (L.yyText.charAt(0) == '\\') ? L.yyText.charAt(1) : L.yyText.charAt(0);
                    Token = L.yylex();
                    if (Token == 100) { // GUION
                        Token = L.yylex();
                        if (Token == 110) { // SIMBOLO
                            simb2 = (L.yyText.charAt(0) == '\\') ? L.yyText.charAt(1) : L.yyText.charAt(0);
                            Token = L.yylex();
                            if (Token == 90) { // CORCHETE DERECHO
                                f.CrearAFNBasico(simb1, simb2);
                                return true;
                            }
                        }
                    }
                }
                return false;
            case 110: // SIMBOLO
                simb1 = (L.yyText.charAt(0) == '\\') ? L.yyText.charAt(1) : L.yyText.charAt(0);
                f.CrearAFNBasico(simb1);
                return true;
            default:
                System.out.println("Operación no válida");
                break;
        }
        return false;
    }
}
