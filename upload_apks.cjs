const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
    console.log('SFTP connected. Uploading APKs...');
    conn.sftp((err, sftp) => {
        if (err) throw err;

        const passengerApk = 'exported_apks/HUM_Passenger.apk';
        const driverApk = 'exported_apks/HUM_Captain.apk';
        
        sftp.fastPut(passengerApk, '/root/passenger.apk', (err) => {
            if (err) throw err;
            console.log('Uploaded passenger.apk');
            
            sftp.fastPut(driverApk, '/root/driver.apk', (err) => {
                if (err) throw err;
                console.log('Uploaded driver.apk');
                
                conn.exec('mkdir -p /var/www/humfleet/apks && mv /root/passenger.apk /var/www/humfleet/apks/HUM_Passenger.apk && mv /root/driver.apk /var/www/humfleet/apks/HUM_Captain.apk && chmod 644 /var/www/humfleet/apks/*.apk', (err, stream) => {
                    if (err) throw err;
                    stream.on('close', (code, signal) => {
                        console.log('Moved APKs successfully');
                        conn.end();
                    }).on('data', (data) => {
                        console.log('STDOUT: ' + data);
                    }).stderr.on('data', (data) => {
                        console.log('STDERR: ' + data);
                    });
                });
            });
        });
    });
}).connect({
    host: '187.127.165.79',
    port: 22,
    username: 'root',
    password: 'SHAFLAlTHAF.1992'
});
