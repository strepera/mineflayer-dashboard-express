import express from 'express';
import { WebSocketServer } from 'ws';

const Dashboard = {
  init: (bot, websitePort, websocketPort) => {
    const wss = new WebSocketServer({ port: (websocketPort || 3001) });
    const clients = [];
    wss.on('connection', (ws) => {
      clients.push(ws);
      ws.send(JSON.stringify(log))
    })
    bot.on('messagestr', (msg) => {
      log.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      clients.forEach(ws => {
        ws.send(JSON.stringify(log));
      })
    })

    let log = [];

    const app = express();
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', `https://localhost:${websitePort}`);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });
    app.set('view engine', 'ejs');
    app.set('views', './views');
    app.use(express.static('./public'));
    
    app.get('/', (req, res) => {
      res.render('home', {log, bot, websitePort, websocketPort});
    });

    app.get('/say', (req, res) => {
      const msg = req.url.match(/\/say\?msg=(\S+)/)?.[1]?.replaceAll('%27', "'").replaceAll('%22', '"').replaceAll("%3C", "<").replaceAll("%3E", ">").replaceAll("%20", " ");
      res.send('Success');
      if (!msg) return;
      console.log("[Website Command] " + msg);
      bot.chat(msg);
    })
    
    const PORT = websitePort || 3000;
    app.listen(PORT, () => {
      console.log(`Website running on http://localhost:${PORT}`);
    });
  }
}

export default Dashboard;