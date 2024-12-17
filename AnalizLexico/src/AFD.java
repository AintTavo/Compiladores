import java.util.ArrayList;
import java.util.HashSet;
import java.io.*;
import java.util.List;

/**
 * La clase TransEdoAFD representa una transición en un AFD con su estado destino y tabla de transiciones.
 */
class TransEdoAFD {
    public int IdEdo;
    public int[] TransAFD;
}

/**
 * La clase AFD representa un Autómata Finito Determinista.
 */
public class AFD {
    // Conjunto estático de todos los AFDs creados
    public static HashSet<AFD> ConjAFDs = new HashSet<>();

    // Alfabeto del AFD
    public HashSet<Character> Alfabeto = new HashSet<>();

    // Número de estados en el AFD
    public int NumEstados;

    // Tabla de transiciones del AFD
    public int[][] TablaAFD;

    // ID del AFD
    public int idAFD;

    /**
     * Constructor por defecto de la clase AFD.
     * Inicializa el ID del AFD a -1.
     */
    public AFD() {
        idAFD = -1;
    }

    /**
     * Constructor de la clase AFD.
     * Inicializa la tabla de transiciones con el número de estados y asigna el ID del AFD.
     * @param NumeroDeEstados Número de estados en el AFD.
     * @param IdAutFD ID del AFD.
     */
    public AFD(int NumeroDeEstados, int IdAutFD) {
        TablaAFD = new int[NumeroDeEstados][257];
        for (int i = 0; i < NumeroDeEstados; i++) {
            for (int j = 0; j < 257; j++) {
                TablaAFD[i][j] = -1;
            }
        }
        NumEstados = NumeroDeEstados;
        idAFD = IdAutFD;
        AFD.ConjAFDs.add(this);
    }

    /**
     * Crea un archivo de texto con la tabla de transiciones del AFD.
     * @param FileAFD Nombre del archivo a crear.
     * @throws IOException Si ocurre un error durante la creación del archivo.
     */
    public void CrearArchivoTxt(String FileAFD) throws IOException {
        File archivo = new File(FileAFD);
        FileWriter fw = new FileWriter(archivo);
        BufferedWriter bw = new BufferedWriter(fw);

        for (int fila = 0; fila < NumEstados; fila++) {
            for (int col = 0; col < 257; col++) {
                bw.write(TablaAFD[fila][col] + ",");
            }
            bw.newLine();
        }
        bw.close();
        fw.close();
    }

    /**
     * Lee un AFD desde un archivo de texto y lo carga en la instancia actual.
     * @param FileAFD Nombre del archivo a leer.
     * @param IdAFD ID del AFD a asignar.
     * @return La instancia actual de AFD.
     * @throws IOException Si ocurre un error durante la lectura del archivo.
     */
    public AFD LeerAFDdeArchivo(String FileAFD, int IdAFD) throws IOException {
        File archivo = new File(FileAFD);
        FileReader fr = new FileReader(archivo);
        BufferedReader br = new BufferedReader(fr);

        // Primero, lee todas las líneas del archivo en una lista
        List<String> lineas = new ArrayList<>();
        String linea;
        while ((linea = br.readLine()) != null) {
            lineas.add(linea);
        }

        // Usa el número de líneas para inicializar TablaAFD
        NumEstados = lineas.size();
        TablaAFD = new int[NumEstados][257];

        // Luego, llena TablaAFD con los valores del archivo
        for (int fila = 0; fila < NumEstados; fila++) {
            String[] valores = lineas.get(fila).split(",");
            for (int col = 0; col < valores.length; col++) {
                TablaAFD[fila][col] = Integer.parseInt(valores[col]);
            }
        }

        br.close();
        fr.close();
        return this;
    }

}
