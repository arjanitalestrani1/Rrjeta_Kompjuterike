# Rrjeta Kompjuterike - Projekti 2

Rrjeta Kompjuterike - Projekti 2

Protocol: TCP
Language: Node.js

Group Members
Arjanita Lestrani
Eliona Muja
Elira Bytyqi
Fatjona Gashi
Project Description

Ky projekt implementon një TCP server-client sistem në Node.js që lejon:

Komunikim mes klientëve dhe serverit
Menaxhim të lidhjeve
Ekzekutim komandash për menaxhim file-sh
Monitorim statistikash përmes një HTTP serveri
How to Run
1. Install Node.js

Sigurohu që ke Node.js të instaluar

2. Start Server
node server.js
3. Start Client
node client.js

Pastaj shkruaj IP e serverit:

ENTER → localhost
ose IP tjetër për rrjet

(client.js )

Authentication
/login admin → kërkon password (default: 1234)
/login user → akses i limituar
Features
TCP Server
Pranon lidhje nga shumë klientë (max clients limit)
Menaxhon role:
Admin
User
Ruan mesazhe dhe komanda
Timeout për klientët joaktivë
Logging i mesazheve
Client
Lidhet me serverin përmes IP + port
Dërgon mesazhe dhe komanda
Auto-reconnect nëse shkëputet
Mbështet download/upload të file-ve
File Commands

Implementuar në fileCommands.js

Komandat e suportuara:

/list – liston file-t
/read <file> – lexon file
/upload <file> – ngarkon file
/download <file> – shkarkon file
/delete <file> – fshin file
/search <keyword> – kërkon file
/info <file> – info për file

User ka vetëm akses /read
Admin ka akses të plotë

HTTP Server (Stats)

Serveri HTTP në port 8080 ofron:

Endpoint:

/stats

Kthen:

Klientët aktiv
IP-të e klientëve
Rolet (admin/user)
Numrin e mesazheve
Uptime
Lista e mesazheve

Implementimi në server.js

Project Structure
├── server.js
├── client.js
├── fileCommands.js
├── files/
├── client_downloads/
├── logs/
└── README.md
Notes
Server përdor 0.0.0.0 → pranon lidhje nga rrjeti
Client kërkon IP manualisht
HTTP stats përdoret për monitoring
Timeout = 60 sekonda