<template>
    <DettagliAnnuncio :annuncio="annuncio" />
  </template>
  
  <script setup>
  import DettagliAnnuncio from '../components/DettagliAnnuncio.vue';

  
  const annuncio =  {
            id: 23,
            titolo: "Test upload annuncio",
            descrizione: "QUesto è stato modificato per la terza volta (controllo cambio contratto)",
            agente: {
                email: "roberto.spena@av0.dietiestate.com",
                username: "roberto.spena@av0.dietiestate.com",
                urlFotoProfilo: null
            },
            immobile: {
                tipologiaImmobile: "APPARTAMENTO",
                metriQuadri: 195,
                classeEnergetica: "A_PLUS_PLUS",
                numeroServizi: 2,
                numeroStanze: 2,
                numeroDiPiani: 0,
                indirizzo: {
                    via: "via delle marmotte",
                    numeroCivico: "402",
                    citta: "Napoli",
                    cap: "97100",
                    provincia: "97100",
                    nazione: "Italia",
                    latitudine: 50,
                    longitudine: 10,
                    vicinoA: ["SCUOLE", "PARCHEGGI", "TRASPORTO_PUBBLICO"]
                },
                caratteristicheAggiuntive: {
                    balconi: true,
                    garage: true,
                    postiAuto: true,
                    giardino: false,
                    ascensore: true,
                    portiere: false,
                    riscaldamentoCentralizzato: true,
                    climatizzatori: false,
                    pannelliSolari: true,
                    cantina: false,
                    soffitta: false
                },
                immagini: [
                    {
                        url: "https://dieti24.blob.core.windows.net/upload/annuncio21-0-2025-03-08.png",
                        descrizione: "questa è una vespa"
                    },
                    {
                        url: "https://dieti24.blob.core.windows.net/upload/annuncio23-2-2025-03-08.png",
                        descrizione: "questo la seconda immagine ora è un appartamento non piu il logo dell'uni"
                    }
                ]
            },
            contratto: {
                tipoContratto: "VENDITA",
                contrattoVenditaResponse: {
                    prezzoVendita: 300000,
                    mutuoEstinto: true
                },
                contrattoAffittoResponse: null
            },
            "proposte": [
    {
      "idProposta": 1,
      "prezzoProposta": 150000.50,
      "controproposta": 140000.75,
      "stato": "in attesa",
      "datiProponente": {
        "email": "utente@example.com",
        "nome": "Mario",
        "cognome": "Rossi",
        "contatto": {
          "tipo": "telefono",
          "valore": "+393331234567"
        }
      }
    },
    {
      "idProposta": 2,
      "prezzoProposta": 200000.00,
      "controproposta": 190000.00,
      "stato": "accettata",
      "datiProponente": {
        "email": "cliente@example.com",
        "nome": "Luca",
        "cognome": "Bianchi",
        "contatto": {
          "tipo": "email",
          "valore": "luca.bianchi@example.com"
        }
      }
    }
  ]
        };
  
  
  </script>