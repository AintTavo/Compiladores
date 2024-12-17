import java.awt.event.HierarchyBoundsAdapter;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.spi.AbstractResourceBundleProvider;

/**
 * La clase AFN representa un Autómata Finito No Determinista.
 */
public class AFN {

    // Conjunto estático de todos los AFNs creados
    public static HashSet<AFN> ConjDeAFNs = new HashSet<>();

    // Estado inicial del AFN
    Estado EdoIni;

    // Conjunto de todos los estados del AFN
    HashSet<Estado> EdosAFN = new HashSet<>();

    // Conjunto de estados de aceptación del AFN
    HashSet<Estado> EdosAcept = new HashSet<>();

    // Alfabeto del AFN
    HashSet<Character> Alfabeto = new HashSet<>();

    // Indica si se ha agregado a la unión léxica
    boolean SeAgregoAFNUnionLexico;

    // ID del AFN
    public int IdAFN;

    /**
     * Constructor por defecto de la clase AFN.
     * Inicializa el AFN con valores predeterminados.
     */
    public AFN() {
        IdAFN = 0;
        EdoIni = null;
        EdosAFN.clear();
        EdosAcept.clear();
        Alfabeto.clear();
        SeAgregoAFNUnionLexico = false;
    }

    /**
     * Crea un AFN básico con un solo símbolo.
     * @param s Símbolo para el AFN básico.
     * @return El AFN creado.
     */
    public AFN CrearAFNBasico(char s) {
        Transicion t;
        Estado e1, e2;
        e1 = new Estado();
        e2 = new Estado();
        t = new Transicion(s, e2);
        e1.getTransiciones().add(t);
        e2.setEdoAcept(true);
        Alfabeto.add(s);
        EdoIni = e1;
        EdosAFN.add(e1);
        EdosAFN.add(e2);
        EdosAcept.add(e2);
        SeAgregoAFNUnionLexico = false;

        return this;
    }

    /**
     * Crea un AFN básico con un rango de símbolos.
     * @param s1 Símbolo inferior del rango.
     * @param s2 Símbolo superior del rango.
     * @return El AFN creado.
     */
    public AFN CrearAFNBasico(char s1, char s2) {
        Transicion t;
        Estado e1, e2;
        e1 = new Estado();
        e2 = new Estado();
        t = new Transicion(s1, s2, e2);
        e1.getTransiciones().add(t);
        e2.setEdoAcept(true);

        for (char i = s1; i <= s2; i++) {
            Alfabeto.add(i);
        }

        EdoIni = e1;
        EdosAFN.add(e1);
        EdosAFN.add(e2);
        EdosAcept.add(e2);
        SeAgregoAFNUnionLexico = false;

        return this;
    }

    /**
     * Une este AFN con otro AFN.
     * @param f2 AFN a unir.
     * @return El AFN resultante de la unión.
     */
    public AFN unirAFN(AFN f2) {
        Estado e1 = new Estado();
        Estado e2 = new Estado();

        Transicion t1 = new Transicion(SimbolosEspeciales.EPSILON, this.EdoIni);
        Transicion t2 = new Transicion(SimbolosEspeciales.EPSILON, f2.EdoIni);
        e1.getTransiciones().add(t1); //Prueba
        e2.getTransiciones().add(t2); //Prueba

        for (Estado e : this.EdosAcept) {
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, e2));
            e.setEdoAcept(false);
        }

        for (Estado e : f2.EdosAcept) {
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, e2));
            e.setEdoAcept(false);
        }

        this.EdosAcept.clear();
        f2.EdosAcept.clear();
        this.EdoIni = e1;
        e2.setEdoAcept(true);
        this.EdosAcept.add(e2);
        this.EdosAFN.addAll(f2.EdosAFN);
        this.EdosAFN.add(e1);
        this.EdosAFN.add(e2);
        this.Alfabeto.addAll(f2.Alfabeto);

        return this;
    }

    /**
     * Concatena este AFN con otro AFN.
     * @param f2 AFN a concatenar.
     * @return El AFN resultante de la concatenación.
     */
    public AFN ConcAFN(AFN f2) {
        for (Transicion t : f2.EdoIni.getTransiciones()) {
            for (Estado e : this.EdosAcept) {
                e.getTransiciones().add(t);
                e.setEdoAcept(false);
            }
        }

        f2.EdosAFN.remove(f2.EdoIni);
        this.EdosAcept.clear(); //Prueba
        this.EdosAcept = f2.EdosAcept;
        this.EdosAFN.addAll(f2.EdosAFN);
        this.Alfabeto.addAll(f2.Alfabeto);

        return this;
    }

    /**
     * Aplica la cerradura positiva a este AFN.
     * @return El AFN resultante de la cerradura positiva.
     */
    public AFN CerrPos() {
        Estado e_ini = new Estado();
        Estado e_fin = new Estado();
        e_ini.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, EdoIni));
        for (Estado e : EdosAcept) {
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, e_fin));
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, EdoIni));
            e.setEdoAcept(false);
        }

        EdoIni = e_ini;
        e_fin.setEdoAcept(true);
        EdosAcept.clear();
        EdosAcept.add(e_fin);
        EdosAFN.add(e_ini);
        EdosAFN.add(e_fin);

        return this;
    }

    /**
     * Aplica la cerradura de Kleene a este AFN.
     * @return El AFN resultante de la cerradura de Kleene.
     */
    public AFN CerrKleen() {
        Estado e_ini = new Estado();
        Estado e_fin = new Estado();

        e_ini.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, EdoIni));
        e_ini.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, e_fin));

        for (Estado e : EdosAcept) {
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, e_fin));
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, EdoIni));
            e.setEdoAcept(false);
        }

        EdoIni = e_ini;
        e_fin.setEdoAcept(true);
        EdosAcept.clear();
        EdosAcept.add(e_fin);
        EdosAFN.add(e_ini);
        EdosAFN.add(e_fin);

        return this;
    }

    /**
     * Aplica la operación opcional a este AFN.
     * @return El AFN resultante de la operación opcional.
     */
    public AFN Opcional() {
        Estado e_ini = new Estado();
        Estado e_fin = new Estado();

        e_ini.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, EdoIni));
        e_ini.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, e_fin));

        for (Estado e : EdosAcept) {
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, e_fin));
            e.setEdoAcept(false);
        }

        EdoIni = e_ini;
        e_fin.setEdoAcept(true);
        EdosAcept.clear();
        EdosAcept.add(e_fin);
        EdosAFN.add(e_ini);
        EdosAFN.add(e_fin);

        return this;
    }

    /**
     * Calcula la cerradura epsilon de un estado.
     * @param e Estado del cual calcular la cerradura epsilon.
     * @return Conjunto de estados alcanzables mediante transiciones epsilon.
     */
    public HashSet<Estado> CerraduraEpsilon(Estado e) {
        HashSet<Estado> R = new HashSet<>();
        Stack<Estado> S = new Stack<>();
        Estado aux, Edo;
        R.clear();
        S.clear();

        S.push(e);
        while (!S.isEmpty()) {
            aux = S.pop();
            R.add(aux);
            for (Transicion t : aux.getTransiciones())
                if ((Edo = t.getEstado(SimbolosEspeciales.EPSILON)) != null)
                    if (!R.contains(Edo))
                        S.push(Edo);
        }

        return R;
    }

    /**
     * Calcula la cerradura epsilon de un conjunto de estados.
     * @param ConjEdos Conjunto de estados del cual calcular la cerradura epsilon.
     * @return Conjunto de estados alcanzables mediante transiciones epsilon.
     */
    public HashSet<Estado> CerraduraEpsilon(HashSet<Estado> ConjEdos) {
        HashSet<Estado> R = new HashSet<>();
        Stack<Estado> S = new Stack<>();
        Estado aux, Edo;

        R.clear();
        S.clear();

        for (Estado e : ConjEdos)
            S.push(e);
        while (!S.isEmpty()) {
            aux = S.pop();
            R.add(aux);
            for (Transicion t : aux.getTransiciones()) {
                if ((Edo = t.getEstado(SimbolosEspeciales.EPSILON)) != null)
                    if (!R.contains(Edo))
                        S.push(Edo);
            }
        }

        return R;
    }

    /**
     * Calcula el conjunto de estados alcanzables desde un estado con un símbolo dado.
     * @param Edo Estado desde el cual calcular.
     * @param simb Símbolo de la transición.
     * @return Conjunto de estados alcanzables.
     */
    public HashSet<Estado> Mover(Estado Edo, char simb) {
        HashSet<Estado> C = new HashSet<>();
        Estado Aux;

        C.clear();

        for (Transicion t : Edo.getTransiciones()) {
            Aux = t.getEstado(simb);
            if (Aux != null)
                C.add(Aux);
        }

        return C;
    }

    /**
     * Calcula el conjunto de estados alcanzables desde un conjunto de estados con un símbolo dado.
     * @param Edos Conjunto de estados desde el cual calcular.
     * @param simb Símbolo de la transición.
     * @return Conjunto de estados alcanzables.
     */
    public HashSet<Estado> Mover(HashSet<Estado> Edos, char simb) {
        HashSet<Estado> C = new HashSet<>();
        Estado Aux;

        C.clear();

        for (Estado Edo : Edos)
            for (Transicion t : Edo.getTransiciones()) {
                Aux = t.getEstado(simb);
                if (Aux != null)
                    C.add(Aux);
            }

        return C;
    }

    /**
     * Calcula el conjunto de estados alcanzables desde un conjunto de estados con un símbolo dado,
     * aplicando la cerradura epsilon.
     * @param Edos Conjunto de estados desde el cual calcular.
     * @param simb Símbolo de la transición.
     * @return Conjunto de estados alcanzables.
     */
    public HashSet<Estado> Ir_A(HashSet<Estado> Edos, char simb) {
        HashSet<Estado> C = new HashSet<>();

        C.clear();
        C.addAll(CerraduraEpsilon(Mover(Edos, simb)));

        return C;
    }

    /**
     * Agrega un AFN a la unión especial de AFNs, asignándole un token.
     * @param f AFN a agregar.
     * @param Token Token a asignar al AFN.
     */
    public void UnionEspecialAFNs(AFN f, int Token) {
        Estado e;
        if (!this.SeAgregoAFNUnionLexico) {
            this.EdosAFN.clear();
            this.EdosAcept.clear();
            this.Alfabeto.clear();
            e = new Estado();
            e.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, f.EdoIni));
            this.EdoIni = e;
            this.EdosAFN.add(e);
            this.SeAgregoAFNUnionLexico = true;
        } else {
            this.EdoIni.getTransiciones().add(new Transicion(SimbolosEspeciales.EPSILON, f.EdoIni));
        }

        for (Estado edoAcep : f.EdosAcept) {
            edoAcep.setToken(Token);
        }

        this.EdosAcept.addAll(f.EdosAcept);
        this.Alfabeto.addAll(f.Alfabeto);
    }

    /**
     * Encuentra el índice de un carácter en un arreglo de alfabeto.
     * @param ArregloAlfabeto Arreglo de caracteres del alfabeto.
     * @param c Carácter a buscar.
     * @return Índice del carácter, o -1 si no se encuentra.
     */
    private int IndiceCaracter(char[] ArregloAlfabeto, char c) {
        for (int i = 0; i < ArregloAlfabeto.length; i++)
            if (ArregloAlfabeto[i] == c)
                return i;
        return -1;
    }

    /**
     * Convierte este AFN a un AFD (Autómata Finito Determinista).
     * @return El AFD resultante.
     */
    public AFD ConvAFNaAFD() throws IOException {
        int NumEdosAFD;
        int ContadorEdos;
        ConjIj Ij, Ik;
        boolean existe;

        HashSet<Estado> ConjAux = new HashSet<>();
        HashSet<ConjIj> EdosAFD = new HashSet<>();
        Queue<ConjIj> EdosSinAnalizar = new LinkedList<>();

        EdosAFD.clear();
        EdosSinAnalizar.clear();

        ContadorEdos = 0;
        Ij = new ConjIj();
        Ij.ConjI = CerraduraEpsilon(this.EdoIni);
        Ij.j = ContadorEdos;

        EdosAFD.add(Ij);
        EdosSinAnalizar.add(Ij);
        ContadorEdos++;
        while (EdosSinAnalizar.size() != 0) {
            Ij = EdosSinAnalizar.poll();
            for (char c : this.Alfabeto) {
                Ik = new ConjIj();
                Ik.ConjI = Ir_A(Ij.ConjI, c);

                if (Ik.ConjI.size() == 0) {
                    continue;
                }
                existe = false;

                for (ConjIj I : EdosAFD) {
                    if (I.ConjI.equals(Ik.ConjI)) {
                        existe = true;
                        Ij.TransicionesAFD[c] = I.j;
                        break;
                    }
                }
                if (!existe) {
                    Ik.j = ContadorEdos;
                    Ij.TransicionesAFD[c] = Ik.j;
                    EdosAFD.add(Ik);
                    EdosSinAnalizar.add(Ik);
                    ContadorEdos++;
                }
            }
        }

        // Crear una lista a partir del conjunto EdosAFD
        List<ConjIj> listaEdosAFD = new ArrayList<>(EdosAFD);

        // Ordenar la lista por el id (j)
        Collections.sort(listaEdosAFD, Comparator.comparingInt(o -> o.j));
        NumEdosAFD = ContadorEdos;
        AFD afd = new AFD();
        afd.NumEstados = NumEdosAFD;
        afd.TablaAFD = new int[NumEdosAFD][257];
        int i1 = 0;
        //System.out.println("Estados AFD");
        for (ConjIj cj : listaEdosAFD) {
            for (Estado e : cj.ConjI) {
                for (Estado e2 : this.EdosAcept) {
                    if (e2.equals(e)) {
                        ConjAux.add(e);
                        cj.TransicionesAFD[256] = e2.getToken();
                    }
                }
            }
            afd.TablaAFD[i1] = cj.TransicionesAFD;
            i1++;
        }

        afd.idAFD = IdAFN;
        return afd;
    }
}
