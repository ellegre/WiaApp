<template>
  <div v-if="token" class="general-container">
    <header class="main-header">
    <div class="main-header__container container">
      <img class="main-header__logo" src="./assets/tank_icon.png" width="62" height="62" alt="App logo">
      <h1 class="page-header__title">App Name</h1>
      <div class="logout-container">
        <button v-on:click="logout" class="logout__btn">Logout</button>
        <span class="logout__span" id="username">{{user.name || `Nobody`}}</span>
      </div>
      <div class="main-header__content">
        <Filters></Filters>
        <Menu></Menu>
      </div>
    </div>
    </header>
    <main class="page-main">
      <div class="page-main__container container">
        <section class="units-data">
          <List :objects="objects"></List>

        </section>
        <section class="fuel">
          <Table></Table>

        </section>
        <Message v-bind:message="currentMessage" v-bind:onClose="closeMessage"></Message>
      </div>
    </main>
  </div>
  <Auth v-else v-bind:onSuccess="updateToken"></Auth>
</template>

<script>
import List from './components/List'
import Table from './components/Table'
import Auth from './components/Auth'
import Message from './components/Message'

const session = wialon.core.Session.getInstance();
const UPDATE_INTERVAL = 60000; //time interval to refresh data


export default {
  components: {
    'List': List,
    'Auth': Auth,
    'Table': Table,
    'Message': Message
  },
  data () {
    return {
      token: null,
      user: {
        name: null
      },
      currentMessage: null,
      objects: [],
      feature: [],
    }
  },
  methods: {
    updateToken(token) {
      this.token = token;
      session.initSession('https://hst-api.wialon.com');
      session.loadLibrary("itemIcon");
      session.loadLibrary("unitSensors");
      session.loadLibrary("unitEvents");
      session.loginToken(token, (code) => {
        this.removeClass()
        const user = session.getCurrUser()
        this.user.name = user.getName()
        const feature = session.getFeatures()
        console.log(feature)
        this.startAutoRefresh()
      });
    },
    startAutoRefresh(){
      this.refresh();
      if(!this.intervalId){
        this.intervalId = setInterval(() => this.refresh(), UPDATE_INTERVAL);
      }
    },
    stopAutoRefresh(){
      clearInterval(this.intervalId);
      this.intervalId = null;
    },
    refresh(){
      console.log("refreshing...");
      this.showObjects();
      this.showMessages();
    },
    removeClass() {
      const body = document.querySelector('.body');
      body.classList.remove('body');
    },
    showMessage(text) {
      this.currentMessage = text;
    },
    closeMessage() {
      this.currentMessage = null;
    },
    showObjects(){
      const searchSpec = {
        itemsType:"avl_unit", // тип искомых элементов системы Wialon
        propName: "sys_name", // имя свойства, по которому будет осуществляться поиск
        propValueMask: "*",   // значение свойства — могут быть использованы * | , > < =
        sortType: "!sys_id"  // имя свойства, по которому будет осуществляться сортировка ответа
        };
      const dataFlags = wialon.item.Item.dataFlag.base |
                      wialon.item.Unit.dataFlag.sensors |
                      wialon.item.Unit.dataFlag.lastMessage

      // запрос поиска объектов
      session.searchItems(searchSpec, true, dataFlags, 0, 0, (code, data) => {
        if (code) {
          this.showMessage(`Код ошибки ${wialon.core.Errors.getErrorText(code)}`);
          return;
        }
        console.log(data);
        this.objects = data.items.map(elem => {
          const sensors = elem.getSensors();
          const fuelLevelSensor = Object.values(sensors).find(value => value.t === "fuel level");
          let fuelLevel = "N/S";
          if (fuelLevelSensor) {
            fuelLevel = (elem.calculateSensorValue(fuelLevelSensor, elem.getLastMessage()));
            if (fuelLevel === -348201.3876) {
              fuelLevel = "N/A";
            }
            if (fuelLevel !== "N/A" && fuelLevel !== "N/S" ) {
              fuelLevel = Math.round(fuelLevel);
            }
          }
          return {
            position: elem.getPosition()? wialon.util.DateTime.formatTime((elem.getPosition()).t): "нет данных",
            speed: elem.getPosition()? elem.getPosition().s: "нет данных",
            name: elem.getName(),
            icon: elem.getIconUrl(),
            sensors: elem.getSensors(),
            fuelLevel,
            id: elem.getId(),
            sens: elem.getSensor(),
            result: elem.calculateSensorValue(elem.getSensor(), elem.getLastMessage()),
            ignition: elem.getMileageCounter(),
            a: this.getSensorValue(elem, elem.getSensor()),
          }
        })
      });
    },

    /*getA() {
      function init() { // Execute after login succeed
        const s = wialon.core.Session.getInstance(); // get instance of current Session
        const r = wialon.core.Remote.getInstance();

        const UNIT_ID = getId();

        r.remoteCall('messages/load_last', {
            itemId: UNIT_ID,
            lastTime: s.getServerTime(),
            lastCount: 1,
            flags: 0,
            flagsMask: 0,
            loadCount: 1
        }, function(error) {
            if (error) { msg(wialon.core.Errors.getErrorText(error)); return; }

            r.remoteCall('unit/calc_sensors', {
                source: '',
                indexFrom: 0,
                indexTo: 1,
                unitId: UNIT_ID,
                sensorId: 0
            }, function(error, data) {
                if (error) { msg(wialon.core.Errors.getErrorText(error)); return; }

                msg('sensor values: ' + JSON.stringify(data, null, 1));
            });
        });
      }
    },*/

    getSensorValue(elem, sensor) {

      //Getting values of all unit sensors:

      var sensors = elem.getSensors();

      for (var i in sensors) {
        if (sensors[i].t == "engine operation") {
          const msg = elem.getLastMessage();
          const result = elem.calculateSensorValue(sensor, msg);
          if (result != -348201.3876) {// constant of invalid value
              return result;
            }
          return "N/A";

        }
      }
    },

    logout() {
     const user = wialon.core.Session.getInstance().getCurrUser();
        if (!user) {
          this.showMessage(`You are not logged, click 'login' button`);
          return;
        }
      wialon.core.Session.getInstance().logout( // if user exist - logout
      (code) => { // logout callback
        if (code) {
          this.showMessage(`Error, code: ${code}`)
          } else {
            setTimeout(() => {
              this.token = null;
              this.closeMessage();
            }, 1500);
            this.user.name = null;
            this.objects = [];
            this.stopAutoRefresh();
            this.showMessage(`Logout successfully`);
          }
        }
      );
    },
    /*getAddress(elem) {
      const pos = elem.getPosition()? elem.getPosition(): this.showMessage(`Location unknown`);
        if (pos) {
          const time = wialon.util.DateTime.formatTime(pos.t);
          wialon.util.Gis.getLocations([{lon:pos.x, lat:pos.y}], function(code, address) {
          if (code) {showMessage(wialon.core.Errors.getErrorText(code));
          return;
          } // exit if error code
          msg(text + "<br/><b>Location of unit</b>: "+ address+"</div>"); // print message to log
          });
        } else // position data not exists, print message
          msg(text + "<br/><b>Location of unit</b>: Unknown</div>");
      }
    },*/

    showMessages() {
      const flags = wialon.item.Item.dataFlag.base;
        wialon.core.Session.getInstance().updateDataFlags( // load items to current session
          [{type: "type", data: "avl_unit", flags: flags, mode: 0}], initData());
      function initData () {
        const units = session.getItems("avl_unit");
        const to = session.getServerTime();
        const from = to - 3600 + 24;
        const unit = 12495637;
        const ml = session.getMessagesLoader();
        ml.loadInterval(unit, from, to, 0, 0, 100, (code, data) => {
          console.log(data);
        })
      }
    }
  }
}


</script>

<style scoped>

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.main-header {
  background-color: #078ff0;
}

.main-header__container {
  padding: 5px 25px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

}

.container {
  padding: 0 30px;
  margin: 0 auto;
}

.page-header__title {
  padding: 0;
  margin: 0;
  margin-left: 10px;
  font-size: 16px;
  font-family: Arial;
  text-transform: uppercase;
  color: #DC143C;
  text-shadow: gray 2px 3px 4px;
}

.logout-container {
  margin-left: auto;
}

.logout__btn {
  background: linear-gradient(to bottom, #F2F2F2 0%, #E6E6E6 100%);
  font-weight: 500;
  font-size: 17px;
  font-family: Comic Sans MS;
  line-height: 21px;
  font-family: inherit;
  border-radius: 15px;
  padding: 5px;
}

.logout__btn:focus,
.logout__btn:hover {
  background: linear-gradient(to bottom, #F2F2F2 0%, #E0F8E6 100%);
  color: #585858;
}

.logout__span {
  margin-left: 5px;
  color: #fff;
  font-family: Comic Sans MS;
  font-size: 17px;
}

.main-header__content {
  width: 100%;

}

.fuel {
  background-color: white;
}

.visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  border: 0;
}

</style>
