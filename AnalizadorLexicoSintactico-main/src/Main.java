import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Main {
    private static AFN afn = new AFN();
    private static int lastAFNId = 0;
    private static List<AFN> afnList = new ArrayList<>();
    private static List<AFD> afdList = new ArrayList<>();
    private static JFrame frame;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                createAndShowGUI();
            }
        });
    }

    private static void createAndShowGUI() {
        JFrame frame = new JFrame("Programa AFN y Análisis Sintáctico");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridwidth = GridBagConstraints.REMAINDER;
        gbc.anchor = GridBagConstraints.CENTER;

        JLabel label = new JLabel("Seleccione una opción:");
        panel.add(label, gbc);

        JButton afnButton = new JButton("AFN's");
        panel.add(afnButton, gbc);

        JButton sintacticoButton = new JButton("Análisis Sintáctico");
        panel.add(sintacticoButton, gbc);

        afnButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                mostrarMenuAFN();
            }
        });

        sintacticoButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                mostrarMenuSintactico();
            }
        });

        frame.add(panel);
        frame.setSize(300, 200);
        frame.setLocationRelativeTo(null); // Centrar el frame en la pantalla
        frame.setVisible(true);
    }

    public static void mostrarMenuAFN() {
        JFrame frame = new JFrame("Menú AFN");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridwidth = GridBagConstraints.REMAINDER;
        gbc.anchor = GridBagConstraints.CENTER;

        JLabel label = new JLabel("Seleccione una opción:");
        panel.add(label, gbc);

        String[] opciones = {"Básico", "Unir", "Concatenar", "Cerradura+", "Cerradura*", "Opcional",
                "Union para analizador lexico", "Convertir AFN a AFD", "Probar analizador lexico",
                "Visualizar AFN", "ER->AFN", "Salir"};
        JComboBox<String> comboBox = new JComboBox<>(opciones);
        panel.add(comboBox, gbc);

        JButton seleccionarButton = new JButton("Seleccionar");
        panel.add(seleccionarButton, gbc);

        seleccionarButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String opcionSeleccionada = (String) comboBox.getSelectedItem();
                if (!opcionSeleccionada.equals("Salir")) {
                    realizarAccionAFN(opcionSeleccionada);
                }
                frame.dispose();
            }
        });

        frame.add(panel);
        frame.setSize(300, 200);
        frame.setLocationRelativeTo(null); // Centrar el frame en la pantalla
        frame.setVisible(true);
    }

    public static void mostrarMenuSintactico() {
        JFrame frame = new JFrame("Menú Análisis Sintáctico");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridwidth = GridBagConstraints.REMAINDER;
        gbc.anchor = GridBagConstraints.CENTER;

        JLabel label = new JLabel("Seleccione una opción:");
        panel.add(label, gbc);

        String[] opciones = {"Descenso recursivo", "Volver"};
        JComboBox<String> comboBox = new JComboBox<>(opciones);
        panel.add(comboBox, gbc);

        JButton seleccionarButton = new JButton("Seleccionar");
        panel.add(seleccionarButton, gbc);

        seleccionarButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String opcionSeleccionada = (String) comboBox.getSelectedItem();
                if (opcionSeleccionada.equals("Descenso recursivo")) {
                    mostrarMenuDescensoRecursivo();
                }
                frame.dispose();
            }
        });

        frame.add(panel);
        frame.setSize(300, 200);
        frame.setLocationRelativeTo(null); // Centrar el frame en la pantalla
        frame.setVisible(true);
    }

    public static void mostrarMenuDescensoRecursivo() {
        JFrame frame = new JFrame("Menú Descenso Recursivo");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridwidth = GridBagConstraints.REMAINDER;
        gbc.anchor = GridBagConstraints.CENTER;

        JLabel label = new JLabel("Seleccione una opción:");
        panel.add(label, gbc);

        String[] opciones = {"Calculadora", "Matrices", "Volver"};
        JComboBox<String> comboBox = new JComboBox<>(opciones);
        panel.add(comboBox, gbc);

        JButton seleccionarButton = new JButton("Seleccionar");
        panel.add(seleccionarButton, gbc);

        seleccionarButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String opcionSeleccionada = (String) comboBox.getSelectedItem();
                if (opcionSeleccionada.equals("Calculadora")) {
                    mostrarCalculadora();
                }
                frame.dispose();
            }
        });

        frame.add(panel);
        frame.setSize(300, 200);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public static void realizarAccionAFN(String opcionSeleccionada) {
        switch (opcionSeleccionada) {
            case "Básico":
                realizarAccionBasica();
                break;
            case "Unir":
                realizarAccionUnir();
                break;
            case "Concatenar":
                realizarAccionConcatenar();
                break;
            case "Cerradura+":
                realizarAccionCerraduraMas();
                break;
            case "Cerradura*":
                realizarAccionCerraduraAsterisco();
                break;
            case "Opcional":
                realizarAccionOpcional();
                break;
            case "Union para analizador lexico":
                mostrarMenuUnionAnalizadorLexico();
                break;
            case "Convertir AFN a AFD":
                try {
                    RealizarAccionConvertirAFNaAFD();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                break;
            case "Probar analizador lexico":
                RealizarAccionProbarAnalizadorLexico();
                break;
            case "Visualizar AFN":
                mostrarAFN();
                break;
            case "ER->AFN":
                mostrarMenuERaAFN();
                break;
            default:
                JOptionPane.showMessageDialog(null, "Opción no válida.");
                break;
        }
    }

    public static void realizarAccionBasica() {
        String caracterInferior = JOptionPane.showInputDialog("Ingrese el caracter inferior:");
        if (caracterInferior == null || caracterInferior.isEmpty()) {
            JOptionPane.showMessageDialog(null, "Debe ingresar un caracter inferior.");
            return;
        }

        String caracterSuperior = JOptionPane.showInputDialog("Ingrese el caracter superior:");
        if (caracterSuperior == null || caracterSuperior.isEmpty()) {
            JOptionPane.showMessageDialog(null, "Debe ingresar un caracter superior.");
            return;
        }

        int idAFN;
        try {
            idAFN = Integer.parseInt(JOptionPane.showInputDialog("Ingrese el ID del AFN:"));
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(null, "El ID del AFN debe ser un número.");
            return;
        }

        AFN nuevoAFN = new AFN().CrearAFNBasico(caracterInferior.charAt(0), caracterSuperior.charAt(0));
        nuevoAFN.IdAFN = idAFN;
        lastAFNId = idAFN;
        afnList.add(nuevoAFN); // Agrega el AFN creado a la lista

        JOptionPane.showMessageDialog(null, "AFN creado exitosamente.");
    }

    public static void realizarAccionUnir() {
        if (afnList.size() < 2) {
            JOptionPane.showMessageDialog(null, "Deben existir al menos dos AFN para realizar la operación de unión.");
            return;
        }

        String[] afnOptions = new String[afnList.size()];
        for (int i = 0; i < afnList.size(); i++) {
            afnOptions[i] = "ID: " + afnList.get(i).IdAFN; // Muestra los IDs de los AFN disponibles
        }

        JComboBox<String> comboBox = new JComboBox<>(afnOptions);
        JOptionPane.showMessageDialog(null, comboBox, "Seleccionar primer AFN", JOptionPane.PLAIN_MESSAGE);
        int afnIndex1 = comboBox.getSelectedIndex();

        JOptionPane.showMessageDialog(null, comboBox, "Seleccionar segundo AFN", JOptionPane.PLAIN_MESSAGE);
        int afnIndex2 = comboBox.getSelectedIndex();

        if (afnIndex1 == afnIndex2) {
            JOptionPane.showMessageDialog(null, "Debe seleccionar dos AFN diferentes.");
            return;
        }

        // Llama a la función unirAFN con los AFN seleccionados
        AFN afn1 = afnList.get(afnIndex1);
        AFN afn2 = afnList.get(afnIndex2);
        afn1.unirAFN(afn2);

        // Elimina el segundo AFN unido de la lista
        afnList.remove(afnIndex2);
        JOptionPane.showMessageDialog(null, "Se unieron los AFN");
    }

    public static void realizarAccionConcatenar() {
        if (afnList.size() < 2) {
            JOptionPane.showMessageDialog(null, "Deben existir al menos dos AFN para realizar la operación de concatenación.");
            return;
        }

        String[] afnOptions = new String[afnList.size()];
        for (int i = 0; i < afnList.size(); i++) {
            afnOptions[i] = "ID: " + afnList.get(i).IdAFN; // Muestra los IDs de los AFN disponibles
        }

        JComboBox<String> comboBox = new JComboBox<>(afnOptions);
        JOptionPane.showMessageDialog(null, comboBox, "Seleccionar primer AFN", JOptionPane.PLAIN_MESSAGE);
        int afnIndex1 = comboBox.getSelectedIndex();

        JOptionPane.showMessageDialog(null, comboBox, "Seleccionar segundo AFN", JOptionPane.PLAIN_MESSAGE);
        int afnIndex2 = comboBox.getSelectedIndex();

        if (afnIndex1 == afnIndex2) {
            JOptionPane.showMessageDialog(null, "Debe seleccionar dos AFN diferentes.");
            return;
        }

        // Llama a la función ConcAFN con los AFN seleccionados
        AFN afn1 = afnList.get(afnIndex1);
        AFN afn2 = afnList.get(afnIndex2);
        afn1.ConcAFN(afn2);

        // Elimina el segundo AFN concatenado de la lista
        afnList.remove(afnIndex2);

        JOptionPane.showMessageDialog(null, "AFN concatenado exitosamente.");
    }

    public static void realizarAccionCerraduraMas() {
        if (afnList.isEmpty()) {
            JOptionPane.showMessageDialog(null, "No hay AFN creados para aplicar la operación de cerradura positiva.");
            return;
        }

        String[] afnOptions = new String[afnList.size()];
        for (int i = 0; i < afnList.size(); i++) {
            afnOptions[i] = "ID: " + afnList.get(i).IdAFN; // Muestra los IDs de los AFN disponibles
        }

        JComboBox<String> comboBox = new JComboBox<>(afnOptions);
        int result = JOptionPane.showConfirmDialog(null, comboBox, "Seleccionar AFN", JOptionPane.OK_CANCEL_OPTION);
        if (result != JOptionPane.OK_OPTION) {
            return; // El usuario canceló la selección
        }

        int afnIndex = comboBox.getSelectedIndex();

        if (afnIndex == -1) {
            JOptionPane.showMessageDialog(null, "No se ha seleccionado ningún AFN.");
            return;
        }

        // Llama a la función CerrPos con el AFN seleccionado
        AFN afnSeleccionado = afnList.get(afnIndex);
        afnSeleccionado.CerrPos();

        JOptionPane.showMessageDialog(null, "Cerradura positiva aplicada exitosamente.");
    }

    public static void realizarAccionCerraduraAsterisco() {
        if (afnList.isEmpty()) {
            JOptionPane.showMessageDialog(null, "No hay AFN creados para aplicar la operación de cerradura de Kleene.");
            return;
        }

        String[] afnOptions = new String[afnList.size()];
        for (int i = 0; i < afnList.size(); i++) {
            afnOptions[i] = "ID: " + afnList.get(i).IdAFN; // Muestra los IDs de los AFN disponibles
        }

        JComboBox<String> comboBox = new JComboBox<>(afnOptions);
        int result = JOptionPane.showConfirmDialog(null, comboBox, "Seleccionar AFN", JOptionPane.OK_CANCEL_OPTION);
        if (result != JOptionPane.OK_OPTION) {
            return; // El usuario canceló la selección
        }

        int afnIndex = comboBox.getSelectedIndex();

        if (afnIndex == -1) {
            JOptionPane.showMessageDialog(null, "No se ha seleccionado ningún AFN.");
            return;
        }

        // Llama a la función CerrKleen con el AFN seleccionado
        AFN afnSeleccionado = afnList.get(afnIndex);
        afnSeleccionado.CerrKleen();

        JOptionPane.showMessageDialog(null, "Cerradura de Kleene aplicada exitosamente.");
    }

    public static void realizarAccionOpcional() {
        if (afnList.isEmpty()) {
            JOptionPane.showMessageDialog(null, "No hay AFN creados para aplicar la operación opcional.");
            return;
        }

        String[] afnOptions = new String[afnList.size()];
        for (int i = 0; i < afnList.size(); i++) {
            afnOptions[i] = "ID: " + afnList.get(i).IdAFN; // Muestra los IDs de los AFN disponibles
        }

        JComboBox<String> comboBox = new JComboBox<>(afnOptions);
        int result = JOptionPane.showConfirmDialog(null, comboBox, "Seleccionar AFN", JOptionPane.OK_CANCEL_OPTION);
        if (result != JOptionPane.OK_OPTION) {
            return; // El usuario canceló la selección
        }

        int afnIndex = comboBox.getSelectedIndex();

        if (afnIndex == -1) {
            JOptionPane.showMessageDialog(null, "No se ha seleccionado ningún AFN.");
            return;
        }

        // Llama a la función Opcional con el AFN seleccionado
        AFN afnSeleccionado = afnList.get(afnIndex);
        afnSeleccionado.Opcional();

        JOptionPane.showMessageDialog(null, "Operación opcional aplicada exitosamente al AFN seleccionado.");
    }

    public static void mostrarMenuUnionAnalizadorLexico() {
        JFrame frame = new JFrame("Unión para Analizador Léxico");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel panel = new JPanel(new BorderLayout());

        JLabel label = new JLabel("Seleccione los AFN a unir y especifique los tokens:");
        panel.add(label, BorderLayout.NORTH);

        DefaultTableModel tableModel = new DefaultTableModel() {
            @Override
            public Class<?> getColumnClass(int columnIndex) {
                return columnIndex == 1 ? Boolean.class : super.getColumnClass(columnIndex);
            }
        };
        tableModel.addColumn("ID AFN");
        tableModel.addColumn("Seleccionar");
        tableModel.addColumn("Token");

        for (AFN afn : afnList) {
            tableModel.addRow(new Object[]{afn.IdAFN, false, ""});
        }

        JTable table = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);

        JButton seleccionarButton = new JButton("Confirmar");
        panel.add(seleccionarButton, BorderLayout.SOUTH);

        seleccionarButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                List<AFN> afnsSeleccionados = new ArrayList<>();
                List<Integer> tokens = new ArrayList<>();
                boolean validInput = true;
                for (int i = 0; i < tableModel.getRowCount(); i++) {
                    boolean seleccionado = (boolean) tableModel.getValueAt(i, 1);
                    if (seleccionado) {
                        afnsSeleccionados.add(afnList.get(i));
                        try {
                            int token = Integer.parseInt(tableModel.getValueAt(i, 2).toString());
                            tokens.add(token);
                        } catch (NumberFormatException ex) {
                            validInput = false;
                            JOptionPane.showMessageDialog(frame, "Token inválido en la fila " + (i + 1) + ". Intente de nuevo.");
                            break;
                        }
                    }
                }

                if (!validInput) {
                    return; // Salir del método si hay una entrada inválida
                }

                if (afnsSeleccionados.isEmpty()) {
                    JOptionPane.showMessageDialog(frame, "Debe seleccionar al menos un AFN.");
                    return; // Salir del método si no se seleccionó ningún AFN
                }

                AFN afnResultado = new AFN();
                for (int i = 0; i < afnsSeleccionados.size(); i++) {
                    afnResultado.UnionEspecialAFNs(afnsSeleccionados.get(i), tokens.get(i));
                }

                // Solicitar al usuario que ingrese el ID del AFN resultante
                String idAFNResultado = JOptionPane.showInputDialog(frame, "Ingrese el ID del AFN resultante:");

                // Verificar si el usuario ingresó un ID válido
                int id;
                try {
                    id = Integer.parseInt(idAFNResultado);
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(frame, "ID inválido. Intente de nuevo.");
                    return; // Salir del método si el ID es inválido
                }

                // Establecer el ID del AFN resultante
                afnResultado.IdAFN = id;

                for (AFN afn : afnsSeleccionados) {
                    afnList.remove(afn);
                }

                afnList.add(afnResultado);

                frame.dispose();

                JOptionPane.showMessageDialog(null, "Unión de AFN completada con éxito.");
            }
        });

        frame.add(panel);
        frame.setSize(400, 300);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private static AFN buscarAFNporID(int idAFN) {
        for (AFN afn : afnList) {
            if (afn.IdAFN == idAFN) {
                return afn;
            }
        }
        return null;
    }

    public static void mostrarAFN() {
        JFrame frame = new JFrame("AFN Creados");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel panel = new JPanel(new BorderLayout());

        JLabel label = new JLabel("AFN Creados:");
        panel.add(label, BorderLayout.NORTH);

        DefaultTableModel tableModel = new DefaultTableModel();
        tableModel.addColumn("ID AFN");
        tableModel.addColumn("Estado Inicial");
        tableModel.addColumn("Estados");
        tableModel.addColumn("Estados de Aceptación");
        tableModel.addColumn("Alfabeto");

        for (AFN afn : afnList) {
            StringBuilder estados = new StringBuilder();
            for (Estado estado : afn.EdosAFN) {
                estados.append(estado.getIdEstado()).append(", ");
            }
            estados.deleteCharAt(estados.length() - 1);
            estados.deleteCharAt(estados.length() - 1);

            StringBuilder estadosAceptacion = new StringBuilder();
            for (Estado estado : afn.EdosAcept) {
                estadosAceptacion.append(estado.getIdEstado()).append(", ");
            }
            estadosAceptacion.deleteCharAt(estadosAceptacion.length() - 1);
            estadosAceptacion.deleteCharAt(estadosAceptacion.length() - 1);

            StringBuilder alfabeto = new StringBuilder();
            for (char c : afn.Alfabeto) {
                alfabeto.append(c).append(", ");
            }
            alfabeto.deleteCharAt(alfabeto.length() - 1);
            alfabeto.deleteCharAt(alfabeto.length() - 1);

            tableModel.addRow(new Object[]{afn.IdAFN, afn.EdoIni.getIdEstado(), estados.toString(), estadosAceptacion.toString(), alfabeto.toString()});
        }

        JTable table = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);

        frame.add(panel);
        frame.setSize(600, 400);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public static void RealizarAccionConvertirAFNaAFD() throws IOException {
        if (afnList.isEmpty()) {
            JOptionPane.showMessageDialog(null, "No hay AFN disponibles para convertir.");
            return;
        }

        // Mostrar lista de AFNs disponibles para selección
        String[] afnOptions = new String[afnList.size()];
        for (int i = 0; i < afnList.size(); i++) {
            afnOptions[i] = "ID: " + afnList.get(i).IdAFN; // Mostrar los IDs de los AFN disponibles
        }

        JComboBox<String> comboBox = new JComboBox<>(afnOptions);
        int result = JOptionPane.showConfirmDialog(null, comboBox, "Seleccionar AFN para convertir", JOptionPane.OK_CANCEL_OPTION);
        if (result != JOptionPane.OK_OPTION) {
            return; // El usuario canceló la selección
        }

        int afnIndex = comboBox.getSelectedIndex();
        if (afnIndex == -1) {
            JOptionPane.showMessageDialog(null, "No se ha seleccionado ningún AFN.");
            return;
        }

        AFN afnSeleccionado = afnList.get(afnIndex);
        AFD afd = afnSeleccionado.ConvAFNaAFD();

        // Solicitar al usuario que ingrese el ID del nuevo AFD
        String idAFDString = JOptionPane.showInputDialog(null, "Ingrese el ID del nuevo AFD:");
        int idAFD;
        try {
            idAFD = Integer.parseInt(idAFDString);
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(null, "ID inválido. Intente de nuevo.");
            return;
        }
        afd.idAFD = idAFD;

        // Solicitar al usuario que ingrese el nombre del archivo para guardar el AFD
        String nombreArchivo = JOptionPane.showInputDialog(null, "Ingrese el nombre del archivo para guardar el AFD:");

        afd.CrearArchivoTxt(nombreArchivo + ".txt"); // Guardar el AFD en el archivo especificado

        afdList.add(afd); // Agregar el AFD resultante a la lista de AFDs

        JOptionPane.showMessageDialog(null, "Conversión de AFN a AFD realizada con éxito.\nID del AFD: " + afd.idAFD + "\nArchivo guardado como: " + nombreArchivo + ".txt");
    }

    public static void RealizarAccionProbarAnalizadorLexico() {
        JFrame frame = new JFrame("Probar Analizador Léxico");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridwidth = GridBagConstraints.REMAINDER;
        gbc.anchor = GridBagConstraints.CENTER;

        JLabel label = new JLabel("Seleccione el AFD a utilizar o cargar un archivo:");
        panel.add(label, gbc);

        JRadioButton rbAFD = new JRadioButton("Seleccionar AFD");
        JRadioButton rbArchivo = new JRadioButton("Cargar archivo");
        ButtonGroup bg = new ButtonGroup();
        bg.add(rbAFD);
        bg.add(rbArchivo);
        panel.add(rbAFD, gbc);
        panel.add(rbArchivo, gbc);

        JButton seleccionarButton = new JButton("Seleccionar");
        panel.add(seleccionarButton, gbc);

        JTextField txtCadena = new JTextField(20);
        panel.add(new JLabel("Cadena a analizar:"), gbc);
        panel.add(txtCadena, gbc);

        if (!afdList.isEmpty()) {
            rbAFD.setSelected(true);
        } else {
            rbArchivo.setSelected(true);
            rbAFD.setEnabled(false);
        }

        seleccionarButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                AFD afd = null;
                if (rbAFD.isSelected()) {
                    String[] afdOptions = new String[afdList.size()];
                    for (int i = 0; i < afdList.size(); i++) {
                        afdOptions[i] = "ID: " + afdList.get(i).idAFD;
                    }
                    JComboBox<String> comboBox = new JComboBox<>(afdOptions);
                    int result = JOptionPane.showConfirmDialog(null, comboBox, "Seleccionar AFD", JOptionPane.OK_CANCEL_OPTION);
                    if (result == JOptionPane.OK_OPTION) {
                        int afdIndex = comboBox.getSelectedIndex();
                        afd = afdList.get(afdIndex);
                    } else {
                        return;
                    }
                } else if (rbArchivo.isSelected()) {
                    JFileChooser fileChooser = new JFileChooser();
                    int returnValue = fileChooser.showOpenDialog(null);
                    if (returnValue == JFileChooser.APPROVE_OPTION) {
                        String filePath = fileChooser.getSelectedFile().getAbsolutePath();
                        try {
                            afd = new AFD();
                            afd.LeerAFDdeArchivo(filePath, -1);
                        } catch (IOException ex) {
                            ex.printStackTrace();
                            JOptionPane.showMessageDialog(null, "Error al leer el archivo: " + ex.getMessage());
                            return;
                        }
                    } else {
                        return;
                    }
                }

                String cadena = txtCadena.getText();
                if (cadena == null || cadena.isEmpty()) {
                    JOptionPane.showMessageDialog(null, "Debe ingresar una cadena a analizar.");
                    return;
                }

                AnalizLexico analisadorLexico = new AnalizLexico(cadena, afd);
                DefaultTableModel tableModel = new DefaultTableModel();
                tableModel.addColumn("Lexema");
                tableModel.addColumn("Token");

                int token;
                while ((token = analisadorLexico.yylex()) != SimbolosEspeciales.FIN) {
                    tableModel.addRow(new Object[]{analisadorLexico.yyText, token});
                }

                JTable table = new JTable(tableModel);
                JScrollPane scrollPane = new JScrollPane(table);

                JFrame resultFrame = new JFrame("Resultados del Análisis Léxico");
                resultFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
                resultFrame.add(scrollPane);
                resultFrame.setSize(400, 300);
                resultFrame.setLocationRelativeTo(null);
                resultFrame.setVisible(true);

                frame.dispose();
            }
        });

        frame.add(panel);
        frame.setSize(400, 300);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public static void mostrarCalculadora() {
        JFrame frame = new JFrame("Calculadora");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints constraints = new GridBagConstraints();
        constraints.gridwidth = GridBagConstraints.REMAINDER;
        constraints.anchor = GridBagConstraints.CENTER;

        JLabel label = new JLabel("Seleccione el AFD a utilizar o cargar un archivo:");
        panel.add(label, constraints);

        JRadioButton rbAFD = new JRadioButton("Seleccionar AFD");
        JRadioButton rbArchivo = new JRadioButton("Cargar archivo");
        ButtonGroup bg = new ButtonGroup();
        bg.add(rbAFD);
        bg.add(rbArchivo);
        panel.add(rbAFD, constraints);
        panel.add(rbArchivo, constraints);

        JTextField txtExpresion = new JTextField(20);
        panel.add(new JLabel("Expresión a evaluar:"), constraints);
        panel.add(txtExpresion, constraints);

        JButton evaluarButton = new JButton("Evaluar");
        panel.add(evaluarButton, constraints);

        JTextArea txtResult = new JTextArea(2, 20);
        txtResult.setEditable(false);
        JScrollPane scrollResult = new JScrollPane(txtResult);
        panel.add(new JLabel("Resultado:"), constraints);
        panel.add(scrollResult, constraints);

        JTextArea txtPostfijo = new JTextArea(2, 20);
        txtPostfijo.setEditable(false);
        JScrollPane scrollPostfijo = new JScrollPane(txtPostfijo);
        panel.add(new JLabel("Postfijo:"), constraints);
        panel.add(scrollPostfijo, constraints);

        if (!afdList.isEmpty()) {
            rbAFD.setSelected(true);
        } else {
            rbArchivo.setSelected(true);
            rbAFD.setEnabled(false);
        }

        evaluarButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                AFD afd = null;
                if (rbAFD.isSelected()) {
                    String[] afdOptions = new String[afdList.size()];
                    for (int i = 0; i < afdList.size(); i++) {
                        afdOptions[i] = "ID: " + afdList.get(i).idAFD;
                    }
                    JComboBox<String> comboBox = new JComboBox<>(afdOptions);
                    int result = JOptionPane.showConfirmDialog(null, comboBox, "Seleccionar AFD", JOptionPane.OK_CANCEL_OPTION);
                    if (result == JOptionPane.OK_OPTION) {
                        int afdIndex = comboBox.getSelectedIndex();
                        afd = afdList.get(afdIndex);
                    } else {
                        return;
                    }
                } else if (rbArchivo.isSelected()) {
                    JFileChooser fileChooser = new JFileChooser();
                    fileChooser.setFileFilter(new javax.swing.filechooser.FileNameExtensionFilter("Archivos de texto (*.txt)", "txt"));
                    fileChooser.setDialogTitle("Seleccionar el archivo de texto del AFD");

                    int returnValue = fileChooser.showOpenDialog(null);
                    if (returnValue == JFileChooser.APPROVE_OPTION) {
                        String filePath = fileChooser.getSelectedFile().getAbsolutePath();
                        try {
                            afd = new AFD();
                            afd.LeerAFDdeArchivo(filePath, -1);
                        } catch (IOException ex) {
                            ex.printStackTrace();
                            JOptionPane.showMessageDialog(null, "Error al leer el archivo: " + ex.getMessage());
                            return;
                        }
                    } else {
                        return;
                    }
                }

                String expresion = txtExpresion.getText();
                if (expresion == null || expresion.isEmpty()) {
                    JOptionPane.showMessageDialog(null, "Debe ingresar una expresión a evaluar.");
                    return;
                }

                try {
                    EvaluadorExpr evaluador = new EvaluadorExpr(expresion, afd);
                    if (evaluador.IniVal()) {
                        JOptionPane.showMessageDialog(null, "Expresión sintácticamente correcta.", "AVISO", JOptionPane.INFORMATION_MESSAGE);
                        txtResult.setText(String.valueOf(evaluador.result));
                        txtPostfijo.setText(evaluador.ExprPost);
                    } else {
                        JOptionPane.showMessageDialog(null, "Expresión sintácticamente incorrecta.", "AVISO", JOptionPane.INFORMATION_MESSAGE);
                        txtResult.setText("Error");
                        txtPostfijo.setText("");
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(null, "Error al evaluar la expresión: " + ex.getMessage());
                }
            }
        });

        frame.add(panel);
        frame.setSize(400, 300);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public static void mostrarMenuERaAFN() {
        JFrame frame = new JFrame("Convertir ER a AFN");
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints constraints = new GridBagConstraints();
        constraints.gridwidth = GridBagConstraints.REMAINDER;
        constraints.anchor = GridBagConstraints.CENTER;

        // Etiqueta y botón para cargar archivo
        JLabel labelArchivo = new JLabel("Seleccione el archivo de texto del AFD:");
        panel.add(labelArchivo, constraints);

        JButton cargarArchivoButton = new JButton("Cargar archivo");
        panel.add(cargarArchivoButton, constraints);

        // Campo para la expresión regular
        JLabel labelExpReg = new JLabel("Ingrese la expresión regular:");
        panel.add(labelExpReg, constraints);

        JTextField txtExpReg = new JTextField(20);
        panel.add(txtExpReg, constraints);

        // Campo para el ID del nuevo AFN
        JLabel labelIdAFN = new JLabel("Ingrese el ID del nuevo AFN:");
        panel.add(labelIdAFN, constraints);

        JTextField txtIdAFN = new JTextField(20);
        panel.add(txtIdAFN, constraints);

        // Botón para confirmar
        JButton confirmarButton = new JButton("Confirmar");
        panel.add(confirmarButton, constraints);

        // Añadir panel al frame
        frame.add(panel);
        frame.setSize(400, 300);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        // Acción para el botón de cargar archivo
        final String[] filePath = new String[1]; // Usamos un array para permitir la mutabilidad
        cargarArchivoButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                JFileChooser fileChooser = new JFileChooser();
                fileChooser.setFileFilter(new javax.swing.filechooser.FileNameExtensionFilter("Archivos de texto (*.txt)", "txt"));
                int returnValue = fileChooser.showOpenDialog(null);
                if (returnValue == JFileChooser.APPROVE_OPTION) {
                    filePath[0] = fileChooser.getSelectedFile().getAbsolutePath();
                    JOptionPane.showMessageDialog(frame, "Archivo seleccionado: " + filePath[0]);
                }
            }
        });

        // Acción para el botón de confirmar
        confirmarButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (filePath[0] == null || filePath[0].isEmpty()) {
                    JOptionPane.showMessageDialog(frame, "Debe seleccionar un archivo.");
                    return;
                }

                String expReg = txtExpReg.getText();
                if (expReg == null || expReg.isEmpty()) {
                    JOptionPane.showMessageDialog(frame, "Debe ingresar una expresión regular.");
                    return;
                }

                String idAFNString = txtIdAFN.getText();
                int idAFN;
                try {
                    idAFN = Integer.parseInt(idAFNString);
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(frame, "ID inválido. Intente de nuevo.");
                    return;
                }

                try {
                    ER_AFN erAFN = new ER_AFN(expReg, filePath[0], -1);
                    if (erAFN.IniConversion()) {
                        AFN afnResultado = erAFN.Result;
                        afnResultado.IdAFN = idAFN;
                        afnList.add(afnResultado);
                        JOptionPane.showMessageDialog(frame, "Conversión de ER a AFN realizada con éxito. ID del AFN: " + idAFN);
                    } else {
                        JOptionPane.showMessageDialog(frame, "Error en la conversión de ER a AFN.");
                    }
                } catch (IOException ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(frame, "Error al leer el archivo: " + ex.getMessage());
                }
            }
        });
    }

}