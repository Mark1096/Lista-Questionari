# Lista Questionari

Start project with the command: expo-cli start

Traccia:

Realizzare una applicazione cross-platform in grado di somministrare e raccogliere risposte di questionari precompilati e disponibili in formato json.
I questionari sono ospitati su un server e memorizzati in file denominati codicequestionario.json; di seguito il formato:
{
  "array": [
    {
      "Domanda": "DOMANDA N. 1",
      "A": "Risposta A",
      "B": "Risposta B",
      "C": "Risposta C",
      "D": "Risposta D",
      "Esatta": "A"
    },
    {
      "Domanda": "DOMANDA N. 2",
      "A": "Risposta A",
      "B": "Risposta B",
      "C": "Risposta C",
      "D": "Risposta D",
      "Esatta": "A"
    },
    {
      "Domanda": "DOMANDA N. 3",
      "A": "Risposta A",
      "B": "Risposta B",
      "C": "Risposta C",
      "D": "Risposta D",
      "Esatta": "A"
    }
  ]
}
Si tratta di N domande a risposta multipla con 4 possibili scelte di cui una sola esatta.
L'applicazione dovrà: 
- leggere tutti i file json di una cartella: ogni file avrà nome del tipo codice_nometest.json (0145_test_Programmazione_mobile.json)
- presentare una lista dei test per la scelta di quello da fare
- richiedere l'inserimento dei dati identificativi dell'utente
- renderizzare in opportuna interfaccia grafica le domande e permettere la scelta della risposta.
- Correggere il test in base alle soluzione date
- produrre un file risultati nel seguente formato:
	{
	  "Cognome":"",
	  "Nome":"",
	  "Data":"",
	  "Ora": "",
	  "Codice_test":"",
	  "Nome_test":"",
	  
	  "array": [
		{
		  "Risposta": "A",
		  "punti": "1"
		},
		{
		  "Risposta": "C",
		  "punti":"0"
		},
		{
		  "Risposta": "D",
		  "punti": "0"
		}
	  ],
	  
	  "punteggio": "1"
	}
	il nome del file prodotto sarà del tipo (Cognome_Nome_codicetest.json); tale file dovrà essere uploadato su un server 
- visualizzare il test all'utente evidenziando in rosso le risposte errate ed in verde quelle corrette
- comunicare il punteggio conseguito

