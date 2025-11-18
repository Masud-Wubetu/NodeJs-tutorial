const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

const writable = fs.createWriteStream('payments.log', {flags: 'a'});

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

eventEmitter.on('paymentSuccess', (user, amount)=>{
   console.log('✓ payment successful');
   console.log(`User: ${user}, Amount: $${amount}\n`);
});

function logPayment(user, amount){
   const log = `User: ${user}, Amount: $${amount}, Date: ${new Date().toLocaleTimeString()}\n`;
   writable.write(log);
   eventEmitter.emit('paymentSuccess', user, amount);
}

rl.question(`Enter Your Name: `,(name)=>{
   rl.question(`Enter Payment Amount: `, (amount)=>{
      logPayment(name, amount);
      rl.close();

      console.log(`\nPayment Log:\n`);
      const readable = fs.createReadStream('payments.log','utf8');

      readable.on('data',(chunk)=>{
         console.log(chunk);
      });

      readable.on('end', ()=>{
         console.log('__End of log__')
      });
   });
});