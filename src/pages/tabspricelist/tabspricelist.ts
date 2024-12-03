import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  Navbar,
  ViewController,
  LoadingController,
  ToastController,
} from 'ionic-angular';

import { ConnectProvider } from '../../providers/connect/connect';
import { ListmotorPage } from '../listmotor/listmotor';

@Component({
  selector: 'page-tabspricelist',
  templateUrl: 'tabspricelist.html',
})
export class TabspricelistPage {

  @ViewChild(Navbar) navBar:Navbar;

  isSearchBarOpened = false;
  param = {
    "token":"",
    "id": 0,
    "sales_organizational_id": 0
  };
  responseData: any;
  listLeasing: any[];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public connect: ConnectProvider,
    public navParams: NavParams) {
    this.init()
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.viewCtrl.dismiss({},"",{
        animate: true,
        animation: 'ios-transition'
      });
    };
  }

  presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();
  }

  doRefresh(refresher){
    this.init();
    refresher.complete();
  }

  opendetail(item) {
    this.navCtrl.push(ListmotorPage,{ item: item },{
      animate: true,
      animation: 'ios-transition'
    });
  }

  init(){
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });

    loadingPopup.present();
    const localdata = JSON.parse(localStorage.getItem('userData'));

    this.param.token = localdata.userData.token;
    this.param.id = localdata.userData.id;
    this.param.sales_organizational_id = localdata.userData.sales_organizational_id

    this.connect.getData(this.param.token, `getLeasing`)
      .then(data=>{
      this.responseData = data;
      if(this.responseData){
        this.listLeasing = this.responseData;
        loadingPopup.dismiss();
      }else{
        loadingPopup.dismiss();
        this.presentToast('Data Tidak Ditemukan')
      }
    },(err)=>{
      loadingPopup.dismiss();
      this.presentToast("Koneksi Bermasalah");
    })
  }
}
