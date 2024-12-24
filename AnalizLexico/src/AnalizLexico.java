import java.io.IOException;
import java.util.*;

public class AnalizLexico {
    int token, EdoActual, EdoTransicion;
    String CadenaSigma; // cadena que va a ser analizada
    public String yyText;
    boolean PasoPorEdoAcept;
    int IniLexema, FinLexema, IndiceCaracterActual;
    char CaracterActual;
    Stack<Integer> Pila = new Stack<>(); // pila para guarda las posiciones por si tengo que hacer el undoToken
    AFD AutomataFD;

    // Constructores
    public AnalizLexico() {
        CadenaSigma = "";
        PasoPorEdoAcept = false;
        IniLexema = -1;
        FinLexema = -1;
        IndiceCaracterActual = -1;
        token = -1;
        Pila.clear();
        AutomataFD = null;
    }

    public AnalizLexico(String sigma, String FileAFD, int IdAFD) throws NumberFormatException, IOException {
        AutomataFD = new AFD();
        CadenaSigma = sigma;
        PasoPorEdoAcept = false;
        IniLexema = 0;
        FinLexema = -1;
        IndiceCaracterActual = 0;
        token = -1;
        Pila.clear();
        AutomataFD.LeerAFDdeArchivo(FileAFD, IdAFD);
    }

    public AnalizLexico(String sigma, String FileAFD) throws NumberFormatException, IOException {
        AutomataFD = new AFD();
        CadenaSigma = sigma;
        PasoPorEdoAcept = false;
        IniLexema = 0;
        FinLexema = -1;
        IndiceCaracterActual = 0;
        token = -1;
        Pila.clear();
        AutomataFD.LeerAFDdeArchivo(FileAFD, -1);
    }

    public AnalizLexico(String FileAFD, int IdAFD) throws NumberFormatException, IOException {
        AutomataFD = new AFD();
        CadenaSigma = "";
        PasoPorEdoAcept = false;
        IniLexema = 0;
        FinLexema = -1;
        IndiceCaracterActual = 0;
        token = -1;
        Pila.clear();
        AutomataFD.LeerAFDdeArchivo(FileAFD, IdAFD);
    }

    public AnalizLexico(String sigma, AFD AutFD) {
        AutomataFD = AutFD;
        CadenaSigma = sigma;
        PasoPorEdoAcept = false;
        IniLexema = 0;
        FinLexema = -1;
        IndiceCaracterActual = 0;
        token = -1;
        Pila.clear();
    }

    // Métodos de la clase

    // Método para obtener el estado actual del analizador léxico
    public AnalizLexico GetEdoAnalizLexico() {
        AnalizLexico EdoActualAnaliz = new AnalizLexico();
        EdoActualAnaliz.CaracterActual = CaracterActual;
        EdoActualAnaliz.EdoActual = EdoActual;
        EdoActualAnaliz.EdoTransicion = EdoTransicion;
        EdoActualAnaliz.FinLexema = FinLexema;
        EdoActualAnaliz.IndiceCaracterActual = IndiceCaracterActual;
        EdoActualAnaliz.IniLexema = IniLexema;
        EdoActualAnaliz.yyText = yyText;
        EdoActualAnaliz.PasoPorEdoAcept = PasoPorEdoAcept;
        EdoActualAnaliz.token = token;
        EdoActualAnaliz.Pila = Pila;
        return EdoActualAnaliz;
    }

    // Método para establecer el estado del analizador léxico con la información
    // que se obtuvo en cierto instante
    public boolean SetEdoAnalizLexico(AnalizLexico e) {
        CaracterActual = e.CaracterActual;
        EdoActual = e.EdoActual;
        EdoTransicion = e.EdoTransicion;
        FinLexema = e.FinLexema;
        IndiceCaracterActual = e.IndiceCaracterActual;
        IniLexema = e.IniLexema;
        yyText = e.yyText;
        PasoPorEdoAcept = e.PasoPorEdoAcept;
        token = e.token;
        Pila = e.Pila;
        return true;
    }

    // Método para establecer la cadena que deseo analizar
    public void SetSigma(String sigma) {
        CadenaSigma = sigma;
        PasoPorEdoAcept = false;
        IniLexema = 0;
        FinLexema = -1;
        IndiceCaracterActual = 0;
        token = -1;
        Pila.clear();
    }

    // Método para mostrar la cadena que falta por analizar
    public String CadenaXAnalizar() {
        return CadenaSigma.substring(IndiceCaracterActual, CadenaSigma.length());
    }

    public int yylex() {
        while (true) {
            Pila.push(IndiceCaracterActual);
            if (IndiceCaracterActual >= CadenaSigma.length()) {
                yyText = "";
                return SimbolosEspeciales.FIN;
            }
            IniLexema = IndiceCaracterActual;
            EdoActual = 0;
            PasoPorEdoAcept = false;
            FinLexema = -1;
            token = -1;
            while (IndiceCaracterActual < CadenaSigma.length()) {
                CaracterActual = CadenaSigma.charAt(IndiceCaracterActual);
                EdoTransicion = AutomataFD.TablaAFD[EdoActual][(int) CaracterActual];
                if (EdoTransicion != -1) {
                    if (AutomataFD.TablaAFD[EdoTransicion][256] != -1) { // Estado de aceptación
                        PasoPorEdoAcept = true;
                        token = AutomataFD.TablaAFD[EdoTransicion][256];
                        FinLexema = IndiceCaracterActual;
                    }
                    IndiceCaracterActual++;
                    EdoActual = EdoTransicion;
                    continue;
                }
                break;
            }
            if (!PasoPorEdoAcept) {
                IndiceCaracterActual = IniLexema + 1;
                yyText = CadenaSigma.substring(IniLexema, IniLexema + 1);
                token = SimbolosEspeciales.ERROR;
                return token;
            }
            yyText = CadenaSigma.substring(IniLexema, FinLexema + 1);
            IndiceCaracterActual = FinLexema + 1;
            if (token == SimbolosEspeciales.OMITIR)
                continue;
            else
                return token;
        }
    }

    public boolean UndoToken() {
        if (Pila.size() == 0) {
            return false;
        }
        IndiceCaracterActual = Pila.pop();
        return true;
    }
}
