package streetmap;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "scores")
public class Scores {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int aantalRondes;
    private String playername;
    private int score;
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getAantalRondes() {
    	return aantalRondes;
    }
    
    public void setAantalRondes(int aantalRondes) {
    	this.aantalRondes = aantalRondes;
    }
    
    public String getPlayername() {
        return playername;
    }
    
    public void setPlayername(String playername) {
        this.playername = playername;
    }
    
    public int getScore() {
        return score;
    }
    
    public void setScore(int score) {
        this.score = score;
    }
}
