# Usage
```js
import mineflayer from 'mineflayer';
import Dashboard from 'mineflayer-dashboard-express';

const bot = mineflayer.createBot({
  username: 'username',
  host: 'server-ip',
  auth: 'microsoft/offline'
})

Dashboard.init(bot, 3000, 3001)
```
