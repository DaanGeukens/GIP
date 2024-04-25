package streetmap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface HoofdstedenRepository extends JpaRepository<Hoofdsteden, Integer> {
	@Query(value = "Select * from Hoofdsteden", nativeQuery = true)
	Iterable<Hoofdsteden> getAllHoofdsteden();
}

