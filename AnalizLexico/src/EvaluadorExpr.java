import java.io.IOException;

public class EvaluadorExpr {
    String Expresion;
    public float result;
    public String ExprPost;
    public AnalizLexico L;

    public EvaluadorExpr(String sigma, AFD AutFD) {
        Expresion = sigma;
        L = new AnalizLexico(Expresion, AutFD);
    }

    public EvaluadorExpr(String sigma, String FileAFD, int IdentiAFD) throws NumberFormatException, IOException {
        Expresion = sigma;
        L = new AnalizLexico(Expresion, FileAFD, IdentiAFD);
    }

    public EvaluadorExpr(String FileAFD, int IdentiAFD) throws NumberFormatException, IOException {
        L = new AnalizLexico(FileAFD, IdentiAFD);
    }

    public void SetExpresion(String sigma) {
        Expresion = sigma;
        L.SetSigma(sigma);
    }

    public boolean IniVal() {
        int Token;
        Resultado res = new Resultado();
        if (E(res)) {
            Token = L.yylex();
            if (Token == SimbolosEspeciales.FIN) {
                this.result = res.v;
                this.ExprPost = res.Postfijo;
                return true;
            }
        }
        return false;
    }

    private boolean E(Resultado res) {
        if (T(res)) {
            if (Ep(res)) {
                return true;
            }
        }
        return false;
    }

    private boolean Ep(Resultado res) {
        Resultado res2 = new Resultado();
        int Token = L.yylex();
        if (Token == 10 || Token == 20) {
            if (T(res2)) {
                res.v = (Token == 10) ? res.v + res2.v : res.v - res2.v;
                res.Postfijo = res.Postfijo + " " + res2.Postfijo + " " + ((Token == 10) ? "+" : "-");
                if (Ep(res)) {
                    return true;
                }
            }
            return false;
        }
        L.UndoToken();
        return true;
    }

    private boolean T(Resultado res) {
        if (F(res)) {
            if (Tp(res)) {
                return true;
            }
        }
        return false;
    }

    private boolean Tp(Resultado res) {
        Resultado res2 = new Resultado();
        int Token = L.yylex();
        if (Token == 30 || Token == 40) {
            if (F(res2)) {
                res.v = (Token == 30) ? res.v * res2.v : res.v / res2.v;
                res.Postfijo = res.Postfijo + " " + res2.Postfijo + " " + ((Token == 30) ? "*" : "/");
                if (Tp(res)) {
                    return true;
                }
            }
            return false;
        }
        L.UndoToken();
        return true;
    }

    private boolean F(Resultado res) {
        int Token;
        Token = L.yylex();
        switch (Token) {
            case 50: // Parentesis izquierdo
                if (E(res)) {
                    Token = L.yylex();
                    if (Token == 60) { // Parentesis derecho
                        return true;
                    }
                }
                return false;
            case 70: // num
                res.v = Float.parseFloat(L.yyText);
                res.Postfijo = L.yyText;
                return true;
            default:
                return false;
        }
    }
}

class Resultado {
    float v;
    String Postfijo = "";
}
