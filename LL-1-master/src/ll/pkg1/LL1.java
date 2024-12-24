package ll.pkg1;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Vista.Interfaz;
import java.io.IOException;

/**
 *
 * @author ferch5003
 */
public class LL1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        // Iniciar directamente la interfaz gráfica
        Interfaz interfaz = new Interfaz();
        interfaz.setVisible(true);
    }
}
