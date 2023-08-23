# Kako pokrenuti aplikaciju?
1. Potrebni su Node.js, yarn/npm i Java 17+
2. Pokrenete Spring Boot server aplikaciju iz **root** direktorija s `./mvnw spring-boot:run`
3. Zatim se premjestite u 'react-frontend' direktorij sa `cd react-frontend`
4. Nakon toga instalirate potrebene pakete s `npm install` ili `yarn install`
5. Na kraju pokrenete React aplikaciju s `npm run dev` ili `yarn run dev`

- *napomena*: Spring Boot aplikacija koristi H2 in-memory bazu podataka zbog jednostavnosti,
  stoga uglavnom svi podatci spremljeni na serveru nestaju prilikom gašenja ili ponovnog pokretanja Spring Boot aplikacije

Zadatak je napraviti aplikaciju za uređivanje podataka o trokutima.

Trokuti imaju sljedeća svojstva:
- Točka A
- Točka B
- Točka C
- Opseg
- Površina
- Vrsta po kutovima
- trokut može biti pravokutan, šiljastokutan ili tupokutan
- Vrsta prema odnosu duljina stranica
- trokut može biti jednakostraničan, jednakokračan ili raznostraničan

+Popis trokuta  
+Dodavanje novih trokuta  
+Ažuriranje podataka o već unesenim trokutima  
+Brisanje trokuta  
+Dinamičko računanje/određivanje opsega, površine, vrste po kutovima i vrste prema odnosu duljina stranica  
+Trajno skladište podataka između pokretanja aplikacije (idealno na serveru). Način skladištenja po izbor.
+Neka skladišteni trokuti budu vidljivi samo korisniku koji ih je dodao,  
&nbsp;&nbsp;&nbsp;&nbsp;dakle korisnik 1 unese trokute 1, 2 i 3, pa korisnik 2 unese trokute 4, 5 i 6  
&nbsp;&nbsp;&nbsp;&nbsp;korisnik 1 pri ponovnom otvaranju aplikacije vidi trokute 1, 2 i 3, ali ne trokute 4, 5 i 6,  
&nbsp;&nbsp;&nbsp;&nbsp;a korisnik 2 pri ponovnom otvaranju aplikacije vidi trokute 4, 5 i 6, ali ne trokute 1, 2 i 3  
+Generiranje dokumenta s podatcima o određenom trokutu. Tip dokumenta po izboru  
+Sustav autentikacije (neka postoji korisnik s username "admin" i password "admin")  
+Vizualni prikaz trokuta  
+Vizualni prikaz trokuta u generiranom dokumentu  
