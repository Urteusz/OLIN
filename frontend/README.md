# OLIN — Frontend

Krótki opis
----------
Frontend aplikacji OLIN zbudowany przy użyciu Next.js, React i TypeScript. Odpowiada za interfejs użytkownika: kwestionariusze nastroju, wyświetlanie rekomendacji AI, ćwiczenia i integrację z backendem.

Technologie
-----------
- React
- Next.js (App Router)
- TypeScript
- JavaScript
- npm / Node.js

Szybkie uruchomienie (deweloperskie)
------------------------------------
1. Przejdź do katalogu frontend:
    - `cd frontend`
2. Zainstaluj zależności:
    - `npm install`
3. Uruchom serwer deweloperski:
    - `npm run dev`
4. Otwórz: `http://localhost:3000`

Pliki kluczowe
--------------
- Główny punkt wejścia (Next.js app router): `app/page.tsx`
- Przykładowy plik zmiennych środowiskowych: `frontend/.env.example`

Budowanie i uruchomienie produkcyjne
------------------------------------
- Budowanie: `npm run build`
- Uruchomienie: `npm run start`
- Podgląd: `npm run preview`

Połączenie z backendem
----------------------
Backend domyślnie działa pod: `http://localhost:8080`  
Przykładowy plik konfiguracyjny backendu: `backend/src/main/resources/application.example.yml`

Zmienne środowiskowe
--------------------
Skopiuj `frontend/.env.example` do `frontend/.env` i ustaw:
- `API_BASE_URL` — adres API backendu (np. `http://localhost:8080/api`)
- `NEXT_PUBLIC_*` — klucze dostępne po stronie klienta

Testy
-----
- Uruchamianie testów (jeśli skonfigurowane): `npm test`  
  Zalecane narzędzia: Jest, React Testing Library.

Bezpieczeństwo i prywatność
---------------------------
Frontend nie powinien przechowywać wrażliwych sekretów. Uwierzytelnianie i autoryzacja realizowane przez backend (JWT / OAuth2). Używać HTTPS w środowisku produkcyjnym.

Licencja
--------
Projekt na licencji MIT — zobacz plik `LICENSE` w repozytorium głównym.

Kontakt i repozytorium
----------------------
Repozytorium: `https://gitlab.com/maksmax4444/hackaton25v2.git`

Uwaga
-----
OLIN jest narzędziem wspomagającym i nie zastępuje profesjonalnej pomocy psychologicznej.
