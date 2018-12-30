# Beam2DJS

Síkbeli rúdszerkezetek támaszerőinek, igénybevételi ábráinak, elmozdulásainak meghatározására alkalmas script/környezet.

A script futtatható a [https://g0mb4.github.io/Beam2DJS](https://g0mb4.github.io/Beam2DJS) linken.

A környezet, jelen pillanatban, egy, az ![x](https://latex.codecogs.com/gif.latex?x) síkban elhelyezkedő, tartó támaszerőrendszerét (![Fy](https://latex.codecogs.com/gif.latex?F_y), ![Mz](https://latex.codecogs.com/gif.latex?M_z)), igénybevételi ábráit (![Ty](https://latex.codecogs.com/gif.latex?T_y), ![Mhz](https://latex.codecogs.com/gif.latex?M_%7Bhz%7D)) és elmozdulásait (![v](https://latex.codecogs.com/gif.latex?v), ![phi](https://latex.codecogs.com/gif.latex?%5Cvarphi)) képes kiszámolni.

Az algoritmus **NEM** optimalizált, a cél a módszer megértése volt számomra, nem a tökéletes implementálás.

A script használatáért **NEM** válallok felelősséget, **NEM** használható házi feladatok vagy zárthelyi dolgozatok megoldására.

# Használat
## Betöltés/Mentés
A **0. Betöltés/Mentés** fül alatt a szövegmezőbe kell másolni a korábban elmentett összeállítást, majd meg kell nyomni a **Betöltés** gombot.

VAGY

Az előre elkészített **Példa X ...** gomb megnyomásával automatikusan betöltődik az adott példa.

Ezek után a **4. Megoldó** fül alatt ellenőrizni kell a szerkezet anyagjellemzőit és a számítási pontosságot (felbontás), majd a **MEGOLDÁS** gomb megnyomásával elkezdődik a számítás.

## Tartó összeállítása
Az **1. Tartó** fül alatt kell elhelyezni a rúdelemeket. A rúdelemeknek kapcsolódóknak kell lenniük! A terhelések és a megtámasztások csak a rúdelemek **végpontjaira** helyezhetők.

A szerkezet összeállítása után a **2. Megtámasztás** fül alatt el kell helyezni a megtámaszásokat.

A megtámasztások elhelyeztése után a **terhelések fülek (3.)** használatával kell felhelyezni a tartóra a kívánt terheléseket.

Ezek után a **4. Megoldó** fül alatt kell megadni a szerkezet anyagjellemzőit és a számítási pontosságot (felbontás), majd a **MEGOLDÁS** gomb megnyomásával elkezdődik a számítás.

Az összeállított tartó (rúdelemek, megtámasztások, terhelések, anyagjelmzők) elmenthető a **0. Betöltés/Mentés** fül alatti **Mentés** gomb megnyomásával, ami után a szövegmezőbe megjelenő, szerkezetet leíró, szöveget ki kell másolni és elmenteni.

# Felhasznált függvénykönyvtárak
- p5.js [p5js.org](https://p5js.org)
- mathjs [mathjs.org](http://mathjs.org)
- MathJax [mathjax.org](https://www.mathjax.org)
- Google Charts [developers.google.com/chart](https://developers.google.com/chart)

# TODO
- lineárisan megoszló terhelés
- normál igénybevétel számítása
- tört vonalú tartók
# Licence
A script teljesen nyílt forráskódú, felhasználható, módosítható, DE egyértelműen hivatkozni kell az eredeti forráskódra, jól látható helyen.
