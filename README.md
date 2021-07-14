# OnSat

### Descrizione del progetto
Il progetto OnSat nasce con l'obiettivo di creare mirato ai ciclisti. In particolare, la nostra applicazione si occupa di tre ambiti:
* Gestione della bicicletta: se si dispone di una bicicletta smart, è possibile fare il pairing con il proprio account, in modo da tenerla sotto controllo in tempo reale.
* Store: un negozio che permette l'acquisto di biciclette ed accessori.
* Servizi per il ciclista: geolocalizzazione, itinerari e meteo.

Inoltre, per agevolarne lo sviluppo è stato implementato un Control Panel, che permette di visualizzare i log dell'applicazione in tempo reale.

### Architettura di riferimento e tecnologie usate
L'architettura di base si fonda sulla comunicazione di tre entità:
* Client: contiene il frontend e permette la comunicazione tra utente ed Application Server.
* Application Server, che si occupa di:
  * Attingere ai dati forniti da API provenienti da servizi di terze parti, che verranno poi messi a disposizione al client.
  * Comunicare con chiamate MySQL il Database (hostato su Plesk).
  * Gestire il protocollo OAuth 2.0
* Control Panel: riceve i log provenienti da Application Server e Client presentandoli a schermo. 
 





``` javascript
var prova;

```
