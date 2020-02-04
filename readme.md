# Web Engineering & Design 3 - Node Server für Testat (Finance Portal)

## Getting Started
* [Node.js](https://nodejs.org/en/) LTS (12.x.x) muss auf Ihrer Entwicklungsmaschine installiert sein.
* Der Server liegt als node Paket vor (siehe package.json).
* Installation erfolgt per Aufruf von *npm install* im Root-Folder des Repositories (Folder des package.json Files).
* Server kann über *npm run start* gestartet werden. 
* Server wird anschliessend auf [Port 3000](http://localhost:3000) ausgeführt.

## Seed-Data
* Bei der ersten Ausführung werden 3 Users (user1, user2, user3) mit dem Passwort "1234" erstellt.
* Zusätzlich werden ca. 1500 zufällige Transaktionen über einen längeren Zeitraum erstellt.

## Server API Dokumentation
Hinweis: Bei falschen Request-Daten wird ein 400, 404 oder 500 HTTP Status zurückgegeben.
### Authentication Service 
#### url: /auth/register
Registriert einen neuen Benutzer im System und gibt den Benutzer mit der generierten Account Nummer zurück. Ein neuer Benutzer erhält 1000.- CHF Startguthaben vom System.
```
method: post
body: {login, firstname, lastname, password}

result:
{
  "login": "Test",
  "firstname": "Michael",
  "lastname": "Gfeller",
  "accountNr": "1000004"
}
```

#### url: /auth/login
Sucht nach dem angegebenen Login und überprüft das spezifizierte Passwort. Gibt das JWT Token sowie den gefundenen Account zurück, falls der User gefunden wurde - ansonsten wird der Request mit einem Status-Code 404 beantwortet.
```
method: post
body: {login, password}

result:
{
  "token": "eyJhbGci...",
  "owner": {
      "login": "user1",
      "firstname": "Bob",
      "lastname": "Müller",
      "accountNr": "1000001"
    }
}
```
*Hinweis: login: Login-Name oder Account-Nummer*

### Account Service
*Die nachfolgenden Routen benötigen das JWT Token (siehe Authentication Service)*
#### url: /accounts/
Ruft erweiterte Informationen (z.B. aktuelles Saldo) über den aktuell eingeloggten Account vom System ab.
```
header: Authorization : Bearer <TOKEN>
method: get

result:
{
  "ownerId": "DLQUd5u5vHsdTaqN",
  "accountNr": "1000001",
  "amount": 1000,
  "owner": {
    "login": "user1",
    "firstname": "Bob",
    "lastname": "Müller",
    "accountNr": "1000001"
  }
}
```

#### url: /accounts/:accountNr
Ruft die Account Informationen über einen beliebigen Account vom System ab.
```
header: Authorization : Bearer <TOKEN>
method: get

result:
{
  "accountNr": "1000002",
  "owner": {
    "firstname": "Lisa",
    "lastname": "Meier"
  }
}
```

### Transaction Service
#### url: /accounts/transactions
Überweist den Betrag vom *User assoziiert mit dem angegebenen Bearer Token* auf das spezifizierte Konto.
```
header: Authorization : Bearer <TOKEN>
method: post
body: {target, amount}

result:
{
  "from": "1000001",
  "target": "1000002",
  "amount": -5,
  "total": 995,
  "date": "2017-02-01T08:48:55.842Z"
}
```

#### url: /accounts/transactions?accounts/transactions?fromDate=2016-05-11T02:00:00.000Z&toDate=2016-12-11T02:00:00.000Z&count=1&skip=1
Ruft sämtliche Transaktionen vom *User assoziiert mit dem angegebenen Bearer Token* ab und filtert diese gemäss der Parametrisierung.
**Wichtig:** Resultate werden nur zurückgeben, falls *count* oder *fromDate und toDate* angegeben wurden.
```
header: Authorization : Bearer <TOKEN>
method: get

result: Transaktions-Informationen für den aktuellen Account zusätzlich noch die Query-Informationen:
{
  "query": {
    "resultcount": 107, // Anzahl Results (ohne Filter)
    "count": 1,  // Anzahl Resulte welche zurückgegeben werden sollten
    "skip": 1, // Überspringt die ersten x Resultate
    "fromDate": "2016-05-11T02:00:00.000Z",  // Date-Filter
    "toDate": "2016-12-11T02:00:00.000Z" // Date-Filter
  },
  "result": [
    {
      "from": "1000001",
      "target": "1000002",
      "amount": -23,
      "total": 977,
      "date": "2016-12-10T14:00:00.000Z"
    }
  ]
}
```
