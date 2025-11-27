# OLIN

**Kategoria:** Poprawa zdrowia psychicznego

## Krótki opis

OLIN to inteligentna aplikacja wspierająca zdrowie psychiczne, która personalizuje codzienne zadania i ćwiczenia na podstawie Twojego profilu psychologicznego oraz aktualnego samopoczucia. Dzięki wykorzystaniu sztucznej inteligencji, OLIN dostosowuje rekomendacje do Twoich zainteresowań, relacji rodzinnych i bieżącego nastroju, oferując spersonalizowane wsparcie w codziennej pielęgnacji zdrowia psychicznego.

## Główne funkcje

### Personalizacja oparta na AI
- **Kwestionariusz osobowy przy rejestracji** – szczegółowy profil uwzględniający zainteresowania, relacje rodzinne, preferencje i cele osobiste
- **Codzienny kwestionariusz nastroju** – monitorowanie samopoczucia i aktualnego stanu emocjonalnego
- **Inteligentne rekomendacje zadań** – AI dobiera ćwiczenia i aktywności dopasowane do Twojego profilu i nastroju

### Funkcjonalności wspierające
- **Dziennik nastroju i aktywności** – śledzenie postępów i wzorców emocjonalnych
- **Krótkie ćwiczenia oddechowe i medytacje** – techniki relaksacyjne dostosowane do potrzeb
- **Powiadomienia i przypomnienia** – regularne wsparcie w budowaniu zdrowych nawyków
- **Personalizowane plany uspokajające** – strategie radzenia sobie ze stresem
- **Panel administracyjny** – analiza anonimowych danych z pełną zgodnością z RODO

## Technologie

**Backend:**
- Java
- Spring Boot
- Maven

**Frontend:**
- React
- TypeScript
- JavaScript
- npm

**Baza danych:**
- PostgreSQL (lub inna zgodnie z konfiguracją)

**AI/ML:**
- Integracja z modelami AI do personalizacji rekomendacji

## Szybkie uruchomienie (środowisko deweloperskie)

### 1. Backend

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

Domyślnie dostępny pod: `http://localhost:8080`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Domyślnie dostępny pod: `http://localhost:3000`

## Konfiguracja

### Zmienne środowiskowe

Ustaw niezbędne zmienne środowiskowe (np. połączenie do bazy danych, sekret JWT) w plikach konfiguracyjnych lub jako zmienne systemowe.

**Przykładowe pliki konfiguracyjne:**
- Backend: `backend/src/main/resources/application.example.yml`
- Frontend: `frontend/.env.example`

### Kluczowe ustawienia

- Konfiguracja bazy danych (PostgreSQL)
- Klucze API dla integracji AI
- Sekret JWT dla autoryzacji
- Ustawienia SMTP dla powiadomień email (opcjonalnie)

## Bezpieczeństwo i prywatność

OLIN został zaprojektowany z myślą o najwyższych standardach bezpieczeństwa i ochrony prywatności:

- **Minimalizacja i anonimizacja danych** – przechowywanie tylko niezbędnych informacji
- **Autoryzacja JWT / OAuth2** – bezpieczne mechanizmy uwierzytelniania
- **Zgodność z RODO/GDPR** – pełne przestrzeganie przepisów o ochronie danych
- **Szyfrowanie danych wrażliwych** – ochrona informacji użytkowników
- **Transparentność** – jasne komunikowanie sposobu wykorzystania danych

## Testy i CI/CD

### Testy

**Backend:**
- Testy jednostkowe: JUnit
- Mockowanie: Mockito

**Frontend:**
- Testy jednostkowe i integracyjne: Jest
- Testy komponentów: React Testing Library

### Continuous Integration

Rekomendowane narzędzia CI/CD:
- GitLab CI
- GitHub Actions

Pipeline obejmuje etapy: build → test → deploy

## Zespół

- **Frontend:** [Maksym Jastrzębski](https://gitlab.com/maksmax4444)
- **Frontend:** [Igor Kuna](https://github.com/IgorKuna252)
- **Fullstack:** [Mateusz Urbaniak](https://github.com/Urteusz)
- **Backend:** [Nikodem Nowak](https://github.com/NikodemNowak)
- **Backend:** [Bartosz Kołaciński](https://github.com/bkolacinski)

## Licencja

Projekt jest udostępniony na licencji MIT. Szczegóły w pliku `LICENSE`.

## Status projektu

🚧 **W fazie rozwoju / prototypu**

Roadmap i priorytety dostępne w pliku `ROADMAP.md`.

## Wkład w projekt

Zachęcamy do zgłaszania issues, pull requestów i propozycji ulepszeń. Wspólnie możemy stworzyć lepsze narzędzie wspierające zdrowie psychiczne!

## Kontakt

Repozytorium projektu: [https://gitlab.com/maksmax4444/hackaton25v2.git](https://gitlab.com/maksmax4444/hackaton25v2.git)

---

**Uwaga:** OLIN jest narzędziem wspomagającym, nie zastępuje profesjonalnej pomocy psychologicznej ani psychiatrycznej. W przypadku poważnych problemów ze zdrowiem psychicznym zalecamy konsultację ze specjalistą.