var shell = require('shelljs');
var fs = require('fs');
var chalk = require('chalk');
var emoji = require('node-emoji');
var path = require('path');

var dest = path.resolve('./theme/assets/icons/');

var enviroment = process.env.npm_package_config_enviroment;
var servername = process.env.npm_package_config_server;

process.stdout.write(chalk.gray(emoji.emojify('[  ] Build Favicons (' + enviroment + ")")) + "\n");

if (!fs.existsSync(dest)) {
  shell.mkdir('-p',[dest]);
}

var favicons = require('favicons'),
    source = path.resolve('./assets/images/logo.png'),  // Source image(s). `string`, `buffer` or array of `string`
    configuration = {
        appName: "Agesci Emilia Romagna",
        appDescription: "Tema Wordpress Agesci Emilia Romagna 2.0",
        developerURL: "https://github.com/EmiRoAgesci/emiroagesci2.0#readme",
        background: "#fff",             // Background colour for flattened icons. `string`
        path: "/assets/icons/",         // Path for overriding default icons path. `string`
        display: "browser",             // Android display: "browser" or "standalone". `string`
        orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
        version: "1.0",                 // Your application's version number. `number`
        logging: false,                 // Print logs to console? `boolean`
        online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
        preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
        icons: {
            android: true,              // Create Android homescreen icon. `boolean`
            appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
            appleStartup: false,        // Create Apple startup images. `boolean`
            coast: { offset: 25 },      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset: offsetInPercentage }`
            favicons: true,             // Create regular favicons. `boolean`
            firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
            windows: true,              // Create Windows 8 tile icons. `boolean`
            yandex: true                // Create Yandex browser icon. `boolean`
        }
    },
    callback = function (error, response) {
        if (error) {
            process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore generazione favicons")) + "\n");
            process.stderr.write(chalk.gray(error.message+"\n"));
            process.stderr.write(chalk.red(error.name+"\n"));
        }
        //console.log(response.images);   // Array of { name: string, contents: <buffer> }
        //console.log(response.files);    // Array of { name: string, contents: <string> }
        //console.log(response.html);     // Array of strings (html elements)
        error = function (error) {
          if (error) {
            console.log(error);
            process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore writing favicons")) + "\n");
            process.stderr.write(chalk.gray(error.message+"\n"));
            process.exit(1);
          }
        };

        var len = response.images.length;
        for (var i = 0; i < len; i++) {
          fs.writeFile(path.join(dest,response.images[i].name), response.images[i].contents, error);
        }
        var logStream = fs.createWriteStream(path.join(dest,'icons.html'), {flags:'a'});
        var lenHtml = response.html.length;
        var html = "";
        for (var j = 0; j < lenHtml; j++) {
          html += response.html[j]+"\n";
        }
        logStream.write(html);

        process.stdout.write(chalk.bgGreen.black(emoji.emojify('[:heavy_check_mark: ] Favicons created!'))+ "\n");
    };

favicons(source, configuration, callback);
