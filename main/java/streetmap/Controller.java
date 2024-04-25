package streetmap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
	
	@Autowired
	private HoofdstedenRepository hrep;
	
	@GetMapping("/steden")
	public Iterable<Hoofdsteden> intro() {
		return hrep.findAll();
	}

	@Autowired
	private ScoresRepository hrep2;
	
	@GetMapping("/score")
	public Iterable<Scores> test() {
		return hrep2.findAll();
	}
	
	@GetMapping("/addscore")
	public void addscore(@RequestParam("ronde") int aantalrondes, @RequestParam("naam") String naam, @RequestParam("score") int score) {
		System.out.println(aantalrondes);
		System.out.println(naam);
		System.out.println(score);
	
		
		Scores r = new Scores();
		r.setId(0);
		r.setAantalRondes(aantalrondes);
		r.setPlayername(naam);
		r.setScore(score);
		hrep2.save(r);
		
	}
}
