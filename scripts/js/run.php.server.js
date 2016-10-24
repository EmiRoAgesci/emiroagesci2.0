var shell = require('shelljs');
var fs = require('fs');
var chalk = require('chalk');
var emoji = require('node-emoji');
var path = require('path');

var enviroment = process.env.npm_package_config_enviroment;
var port = process.env.npm_package_config_port;
var serverurl = 'http://' + process.env.npm_package_config_server + ":" + port;

process.stdout.write(chalk.gray(emoji.emojify('[  ] Run Wordpress Server (' + enviroment + ")")) + "\n");


var contentStart = "#!/bin/bash\n";
//contentStart = contentStart + "phpbrew use 5.6.8\n";
contentStart = contentStart + "nohup /usr/bin/php -S 127.0.0.1:$1 -t server > php.server.out 2>&1 &\n";
contentStart = contentStart + "echo $!\n";
fs.writeFileSync('./scripts/start.sh', contentStart, { mode:0755, flag:'w+' });

createServer = shell.exec('./scripts/start.sh '+port,{silent:true});

if ( createServer.code !== 0 ){
  process.stderr.write(chalk.gray(createServer.stdout+"\n"));
  process.stderr.write(chalk.red(createServer.stderr+"\n"));
  process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore creazione server")) + "\n");
  process.exit(1);
}

// process.stderr.write(chalk.gray('Create "php_theme_server" screen session detached')+"\n");
//
// //screen -r php_theme_server -X stuff $'nohup /usr/bin/php -S dev.emiroagesci.local:8080 -t server > php.server.out 2>&1 &\n'
// // /usr/bin/php -S dev.emiroagesci.local:8080 -t server > php.server.out 2>&1 &
// commandserver = "screen -x php_theme_server -X stuff $'nohup /usr/bin/php -S "+ process.env.npm_package_config_server  + ":" + port + " -t server > php.server.out 2>&1 &\n'";
//
// // server = shell.exec("screen -r php_theme_server -X stuff $'"+commandserver+"\n'", {silent:true});
//
// serverExec = shell.exec(commandserver, {silent:true});
//
// process.stderr.write(chalk.gray('Execute '+commandserver+' on screen session') + "\n");
//
// if ( serverExec.code !== 0 ){
//   process.stderr.write(chalk.gray(serverExec.stdout+"\n"));
//   process.stderr.write(chalk.red(serverExec.stderr+"\n"));
//   process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore lancio server")) + "\n");
//   process.exit(1);
// }
//
// //process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore avvio server"))+ "\n");
//
// pidsearch = shell.exec("echo $!", {silent:true});

var pid = createServer.stdout.trim();

fs.writeFileSync('./scripts/server.pid', pid);

process.stdout.write(chalk.bgGreen.black(emoji.emojify('[:heavy_check_mark: ] Wordpress server UP [' + pid + '] go to ' + serverurl + '!'))+ "\n");
