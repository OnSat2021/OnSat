# OnSat

### Descrizione del progetto
Il progetto OnSat nasce con l'obiettivo di creare mirato ai ciclisti. In particolare, la nostra applicazione si occupa di tre ambiti:
* Gestione della bicicletta: se si dispone di una bicicletta smart, è possibile fare il pairing con il proprio account, in modo da tenerla sotto controllo in tempo reale.
* Store: un negozio che permette l'acquisto di biciclette ed accessori.
* Servizi per il ciclista: geolocalizzazione, itinerari e meteo.

Inoltre, per agevolarne lo sviluppo è stato implementato un Control Panel, che permette di visualizzare i log dell'applicazione in tempo reale.

### Architettura di riferimento e tecnologie usate

![Comunicazione](https://user-images.githubusercontent.com/12523738/125704389-aebb2e84-0234-48cf-ba94-8ee50a2a8b80.png)

L'architettura di base si fonda sulla comunicazione di tre entità:
* Client: contiene il frontend e permette la comunicazione tra utente ed Application Server.
* Application Server, che si occupa di:
  * Attingere ai dati forniti da API provenienti da servizi di terze parti, che verranno poi messi a disposizione al client.
  * Comunicare con chiamate MySQL il Database (hostato su Plesk).
  * Gestire il protocollo OAuth 2.0
* Control Panel: riceve i log provenienti da Application Server e Client presentandoli a schermo. 


 
Le tecnologie impiegate sono:
* NodeJS: usato per l'esecuzione del codice Javascript alla base del Server.
* AMQP: usato per l'invio dei log al Control Panel. Questa tecnologia è stata scelta in quanto l'emissione dei log è fortemente message-oriented, dunque l'impiego di un protocollo asincrono gestito da un Broker risulta la soluzione migliore.
* WebSocket: usate per garantire una connessione real-time il server del Control Panel ed il suo Client, mantenendo un protocollo asincrono.
* Docker: usato per l'esecuzione di RabbitMQ in una soluzione containerizzata.

### Soddisfacimento dei requisiti
1. L'applicazione espone le proprie API tramite REST, fornendo informazioni riguardo gli utenti e le biciclette disponibili nel Database. La documentazione del servizio è disponibile ed è stata realizzata con l'utilizzo di ApiDoc.
2. L'applicazione si interfaccia con due servizi REST commerciali di terze parti: Stripe, OpenWheatherMaps.
3. L'applicazione si interfaccia con due servizi REST che richiedono OAuth 2.0: Google sign-in, Google Calendar.
4. L'applicazione utilizza protocolli asincroni: WebSocket, AMQP.

![apis](https://user-images.githubusercontent.com/12523738/125705117-76e444b7-5b2a-4c16-8b7e-9744d11475ac.png)

### Istruzioni per l'installazione
L'installazione consiste fondamentalmente in due passi:
1. Clonazione della repository in locale. Basta eseguire il seguente comando nel proprio terminale:
``` 


``` 



``` javascript
var prova;

```
