import java.util.HashSet;

/**
 * La clase Estado representa un estado en un autómata.
 */
public class Estado {

    // Contador estático para asignar ID únicos a cada estado
    private static int contadorIdEstado = 0;

    // ID único del estado
    private int idEstado;

    // Indica si el estado es aceptador
    private boolean edoAcept;

    // Token asociado al estado
    private int token;

    // Conjunto de transiciones desde este estado
    private HashSet<Transicion> transiciones = new HashSet<>();

    /**
     * Constructor de la clase Estado.
     * Inicializa el estado como no aceptador y con token -1.
     * Asigna un ID único al estado.
     */
    public Estado() {
        edoAcept = false;
        token = -1;

        idEstado = contadorIdEstado++;
        transiciones.clear();
    }

    /**
     * Obtiene el ID del estado.
     * @return ID del estado.
     */
    public int getIdEstado() {
        return idEstado;
    }

    /**
     * Establece el ID del estado.
     * @param idEstado ID a asignar.
     */
    public void setIdEstado(int idEstado) {
        this.idEstado = idEstado;
    }

    /**
     * Verifica si el estado es aceptador.
     * @return true si el estado es aceptador, false en caso contrario.
     */
    public boolean isEdoAcept() {
        return edoAcept;
    }

    /**
     * Establece si el estado es aceptador.
     * @param edoAcept true para establecer el estado como aceptador, false en caso contrario.
     */
    public void setEdoAcept(boolean edoAcept) {
        this.edoAcept = edoAcept;
    }

    /**
     * Obtiene el token asociado al estado.
     * @return Token del estado.
     */
    public int getToken() {
        return token;
    }

    /**
     * Establece el token del estado.
     * @param token Token a asignar.
     */
    public void setToken(int token) {
        this.token = token;
    }

    /**
     * Obtiene el conjunto de transiciones del estado.
     * @return Conjunto de transiciones.
     */
    public HashSet<Transicion> getTransiciones() {
        return transiciones;
    }

    /**
     * Establece el conjunto de transiciones del estado.
     * @param transiciones Conjunto de transiciones a asignar.
     */
    public void setTransiciones(HashSet<Transicion> transiciones) {
        this.transiciones = transiciones;
    }
}
