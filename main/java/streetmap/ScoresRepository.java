package streetmap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface ScoresRepository extends JpaRepository<Scores, Integer> {
	@Query(value = "Select * from Scores", nativeQuery = true)
	Iterable<Scores> getALLScores();
}
