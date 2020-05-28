import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { commands } from '../utils/printer.command.util';
import EscPosEncoder from 'esc-pos-encoder-ionic';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  devices: any[] = [];
  connectedDevice: any = null;
  constructor(private bluetoothSerial: BluetoothSerial,
              private alertControler: AlertController, private toastControler: ToastController) {}

  ngOnInit() {
    this.scanningDevices();
  }

  private scanningDevices() {
    this.bluetoothSerial.discoverUnpaired().then((devices) => {
      this.devices = devices;
    }, (err) => {
      console.log(err);
    });
  }

  private async connectDevice(deviceAddress: string) {
    const alertMessage = await this.alertControler.create({
      header: 'Warning',
      message: 'Anda yakin ingin print struk ini?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.bluetoothSerial.connect(deviceAddress).subscribe((result) => {
              this.showToast('Berhasil');
              this.printData((message) => {
                this.bluetoothSerial.write(message)
                .then(res => {
                  console.log(res);
                });
              });
            }, (err) => {
              console.log(err);
            });
          }
        }
      ]
    });
    alertMessage.present();
  }

  private async showToast(data: string) {
    const toastMessage = await this.toastControler.create({
      header: 'Info',
      message: data
    });
    toastMessage.present();
  }

  private printData(cb) {
    const image = new Image();
    image.src = 'assets/img/logo.jpeg';
    image.onload = () => {
      const encoder = new EscPosEncoder();
      encoder
        .initialize()
        .codepage('cp936')
        .align('center')
        .image(image, 128, 128, 'atkinson')
        .newline()
        .newline()
        .newline()
        .text('------------')
        .newline()
        .text('M')
        .newline()
        .text('A')
        .newline()
        .text('W')
        .newline()
        .text('A')
        .newline()
        .text('N')
        .newline()
        .text('ASUUUUU....')
        .newline()
        .newline()
        .newline()
        .align('left')
        .line('INI MAKANAN BUSUK')
        .newline()
        .text('*****************************')
        .newline()
        .newline()
        .newline();
      cb(encoder.encode());
    };
  }
}
