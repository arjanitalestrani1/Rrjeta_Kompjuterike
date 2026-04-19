# Rrjeta Kompjuterike - Projekti 2

**Protocol:** TCP  
**Language:** Node.js  

## Group Members
- Arjanita Lestrani  
- Eliona Muja  
- Elira Bytyqi  
- Fatjona Gashi  

---

## Project Description

Ky projekt implementon një **TCP server-client sistem** në Node.js që lejon:

- Komunikim mes klientëve dhe serverit  
- Menaxhim të lidhjeve  
- Ekzekutim komandash për menaxhim file-sh  
- Monitorim statistikash përmes një HTTP serveri  

---

## How to Run

### 1. Install Node.js
Sigurohu që ke Node.js të instaluar:

```bash
node -v
```

---

### 2. Start Server

```bash
node server.js
```

Server starton:
- TCP server në port 5000  
- HTTP server në port 8080  

---

### 3. Start Client

```bash
node client.js
```

Pastaj shkruaj IP e serverit:
- ENTER → localhost  
- ose IP të serverit për rrjet  

---

## Authentication

```bash
/login admin
```

Password:
```bash
1234
```

```bash
/login user
```

- Admin → akses i plotë  
- User → vetëm `/read`  

---

## Features

### TCP Server
- Pranon lidhje nga shumë klientë (max clients 10)
- Menaxhon role: Admin / User
- Ruan mesazhe dhe komanda
- Timeout për klientët joaktivë
- Logging i mesazheve

### Client
- Lidhet me serverin përmes IP + port
- Dërgon mesazhe dhe komanda
- Auto-reconnect nëse shkëputet

---

## File Commands

```bash
/list
/read filename
/upload filename
/download filename
/delete filename
/search keyword
/info filename
```

User ka vetëm akses `/read`  
Admin ka akses të plotë  

---

## HTTP Server (Stats)

Endpoint:

```bash
http://localhost:8080/stats
```

Kthen:
- activeClients  
- clientIPs  
- roles  
- totalMessages  
- uptime  
- messages  

---

## Project Structure

```bash
├── server.js
├── client.js
├── fileCommands.js
├── files/
├── client_downloads/
├── logs/
└── README.md
```

---

## Example Workflow

```bash
node server.js
node client.js

/login admin
/list
/upload test.txt HelloWorld
/download test.txt
```

---

## Notes

- Server përdor `0.0.0.0` → pranon lidhje nga rrjeti  
- Client kërkon IP manualisht  
- HTTP stats përdoret për monitoring  
- Timeout = 60 sekonda  

---

## Technologies Used

- Node.js  
- TCP sockets (`net`)  
- HTTP module  
- File system (`fs`)  

---
