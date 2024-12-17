import javax.print.attribute.HashDocAttributeSet;
import java.util.HashSet;

public class ConjIj {
    public int j;
    public HashSet<Estado> ConjI;
    public int[] TransicionesAFD = new int[257];

    public ConjIj(){
        j = -1;
        ConjI = new HashSet<>();
        ConjI.clear();
        for (int k = 0; k < 257; k++)
            TransicionesAFD[k] = -1;
    }

    public ConjIj(HashSet<Estado> conjI) {
        this(conjI, -1);
    }

    public ConjIj(HashSet<Estado> conjI, int j) {
        this.j = j;
        ConjI = new HashSet<>(conjI);
        for (int k = 0; k < 257; k++)
            TransicionesAFD[k] = -1;
    }

    public int getJ() {
        return j;
    }

    public void setJ(int j) {
        this.j = j;
    }

    public HashSet<Estado> getConjI() {
        return ConjI;
    }

    public void setConjI(HashSet<Estado> conjI) {
        ConjI = conjI;
    }

    public int[] getTransicionesAFD() {
        return TransicionesAFD;
    }

    public void setTransicionesAFD(int[] transicionesAFD) {
        TransicionesAFD = transicionesAFD;
    }
}
