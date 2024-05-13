create table hoofdsteden (
	ID int not null primary key,
	name text,
	latitude DECIMAl(9,6) not null,
	longitude DECIMAL (9,6) not null);

insert into hoofdsteden (id, name, latitude, longitude)
values (1, 'Londen', 51.509865, -0.118092),
(2, 'Parijs	', 48.8566, 2.3522),
(3, 'Brussel', 50.8503, 4.3517),
(4, 'Berlijn', 52.492245, 13.37216),
(5, 'Amsterdam', 52.330383, 4.90344),
(6, 'Rome', 41.870727, 12.49619),
(7, 'Bern', 46.946956, 7.452857),
(8, 'Luxemburg', 49.60779, 6.13136),
(9, 'Madrid', 40.398647, -3.697001),
(10, 'Lissabon', 38.700419, -9.14332),
(11, 'Dublin', 53.339848, -6.268988),
(12, 'Kopenhagen', 55.68977, 12.58452),
(13, 'Wenen', 48.18581, 16.37977);

select ST_X(loc) from hoofdsteden ; -- x coordinaat
select ST_Y(loc) from hoofdsteden ; -- y coordinaat

drop table hoofdsteden;
drop table scores;
create table scores (
	ID int not null primary key AUTO_INCREMENT,
	aantal_rondes int not null,
	playername text unique,
	score int);

drop table scores;
-- Spel: Kiezen steden uit bepaald land/regio/werelddeel
-- Spelers (score laatste spel, zodat hij kan verbeteren) + highscores
