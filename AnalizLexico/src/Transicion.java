/**
 * La clase Transicion representa una transición en un autómata.
 */
public class Transicion {

    // Símbolo inferior del rango de la transición
    private char simboloInferior;

    // Símbolo superior del rango de la transición
    private char simboloSuperior;

    // Estado destino de la transición
    private Estado estado;

    /**
     * Constructor de la clase Transicion.
     * Crea una transición con un símbolo específico y un estado destino.
     * @param simbolo Símbolo de la transición.
     * @param estado Estado destino de la transición.
     */
    public Transicion(char simbolo, Estado estado) {
        this.simboloInferior = simbolo;
        this.simboloSuperior = simbolo;
        this.estado = estado;
    }

    /**
     * Constructor de la clase Transicion.
     * Crea una transición con un rango de símbolos y un estado destino.
     * @param simboloInferior Símbolo inferior del rango.
     * @param simboloSuperior Símbolo superior del rango.
     * @param estado Estado destino de la transición.
     */
    public Transicion(char simboloInferior, char simboloSuperior, Estado estado) {
        this.simboloInferior = simboloInferior;
        this.simboloSuperior = simboloSuperior;
        this.estado = estado;
    }

    /**
     * Constructor por defecto de la clase Transicion.
     * Crea una transición sin especificar símbolos ni estado destino.
     */
    public Transicion() {
        this.estado = null;
    }

    /**
     * Establece una transición con un rango de símbolos y un estado destino.
     * @param simbolo1 Símbolo inferior del rango.
     * @param simbolo2 Símbolo superior del rango.
     * @param estado Estado destino de la transición.
     */
    public void setTransicion(char simbolo1, char simbolo2, Estado estado) {
        this.simboloInferior = simbolo1;
        this.simboloSuperior = simbolo2;
        this.estado = estado;
    }

    /**
     * Establece una transición con un símbolo específico y un estado destino.
     * @param simbolo1 Símbolo de la transición.
     * @param estado Estado destino de la transición.
     */
    public void setTransicion(char simbolo1, Estado estado) {
        this.simboloInferior = simbolo1;
        this.simboloSuperior = simbolo1;
        this.estado = estado;
    }

    /**
     * Obtiene el símbolo inferior del rango de la transición.
     * @return Símbolo inferior.
     */
    public char getSimboloInferior() {
        return simboloInferior;
    }

    /**
     * Establece el símbolo inferior del rango de la transición.
     * @param simboloInferior Símbolo inferior a asignar.
     */
    public void setSimboloInferior(char simboloInferior) {
        this.simboloInferior = simboloInferior;
    }

    /**
     * Obtiene el símbolo superior del rango de la transición.
     * @return Símbolo superior.
     */
    public char getSimboloSuperior() {
        return simboloSuperior;
    }

    /**
     * Establece el símbolo superior del rango de la transición.
     * @param simboloSuperior Símbolo superior a asignar.
     */
    public void setSimboloSuperior(char simboloSuperior) {
        this.simboloSuperior = simboloSuperior;
    }

    /**
     * Obtiene el estado destino de la transición si el símbolo está dentro del rango.
     * @param simbolo Símbolo a verificar.
     * @return Estado destino si el símbolo está en el rango, null en caso contrario.
     */
    public Estado getEstado(char simbolo) {
        if (simboloInferior <= simbolo && simbolo <= simboloSuperior) {
            return estado;
        }
        return null;
    }
}
