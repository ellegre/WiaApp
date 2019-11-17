<template>
  <div v-if="token" class="general-container">
    <header class="main-header">
    <div class="main-header__container container">
      <img class="main-header__logo" src="./assets/tank_icon.png" width="62" height="62" alt="App logo">
      <h1 class="page-header__title">App Name</h1>
      <div class="logout-container">
        <button v-on:click="showInfo" type="button" class="info__btn" :style="{backgroundImage: 'url(' + image +')'}">?</button>
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
          <Stats></Stats>

        </section>
        <Message v-bind:message="currentMessage" v-bind:onClose="closeMessage"></Message>
        <Info v-bind:onCloseInfo="closeInfo"></Info>
      </div>
    </main>
  </div>
  <Auth v-else v-bind:onSuccess="updateToken"></Auth>
</template>

<script>
import List from './components/List'
import Stats from './components/Stats'
import Auth from './components/Auth'
import Message from './components/Message'
import Info from './components/Info'

const session = wialon.core.Session.getInstance();
const UPDATE_INTERVAL = 600000; //time interval to refresh data, ms


let a = document.querySelector('.units__table--fuel');

          console.log(a)

export default {
  components: {
    'List': List,
    'Auth': Auth,
    'Stats': Stats,
    'Message': Message,
    'Info': Info
  },
  data () {
    return {
      title: 'Go to gurtam.com',
      token: null,
      user: {
        name: null
      },
      currentMessage: null,
      objects: [],
      feature: [],
      image: "./assets/question.png",
      info: false
    }
  },
  methods: {
    updateToken(token) {
      this.token = token;
      session.initSession('https://hst-api.wialon.com');
      session.loadLibrary("itemIcon");
      session.loadLibrary("unitSensors");
      session.loadLibrary("unitEvents");
      session.loadLibrary("itemCustomFields");
      session.loadLibrary("itemProfileFields");
      session.loadLibrary("resourceReports");

      session.loginToken(token, (code) => {
        this.removeClass()
        const user = session.getCurrUser()
        this.user.name = user.getName()
        this.startAutoRefresh()
      });
    },
    logout() {

      wialon.core.Session.getInstance().logout(
        (code) => { // logout callback
          if (code) {
            this.showMessage(code)
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
      )
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
    showInfo() {
      console.log(`hhhhh`)
      this.info = true;
    },
    closeInfo() {
      this.info = null;
    },
    showObjects(){
      const searchSpec = {
        itemsType:"avl_unit",
        propName: "sys_name",
        propValueMask: "*",
        sortType: "sys_name",

      };

      const dataFlags = wialon.item.Item.dataFlag.base |
                      wialon.item.Unit.dataFlag.sensors |
                      wialon.item.Unit.dataFlag.lastMessage |
                      wialon.item.Unit.dataFlag.customProps |
                      wialon.item.Unit.dataFlag.messageParams |
                      wialon.item.Item.dataFlag.profileFields |
                      wialon.item.Resource.dataFlag.reports  |
                      wialon.item.Unit.dataFlag.restricted |
                      wialon.item.Unit.dataFlag.other

      session.searchItems(searchSpec, true, dataFlags, 0, 0, (code, data) => {
        if (code) {
          this.showMessage(`Error ${code} - ${wialon.core.Errors.getErrorText(code)}`);
          return;
        }
        console.log(data);

        this.objects = data.items.map(elem => {
          const sensors = elem.getSensors();
          const profileData = elem.getProfileFields();

          //getting unit plate number
          const plateNumbers = Object.values(profileData).find(value => value.n === "registration_plate");
          let plateNumber = "-";
          if (plateNumbers) {
            plateNumber = Object.values(plateNumbers)[2]
          }
          else plateNumber = "-";

          //getting messages from determined interval
          const units = session.getItems("avl_unit");
          const to = session.getServerTime();
          const from = to - 3600 + 24;
          const unit = elem.getId();
          const ml = session.getMessagesLoader();
          ml.loadInterval(unit, from, to, 0, 0, 100, (code, data) => {
            if (code) {
                this.showMessage(`Error ${code} - ${wialon.core.Errors.getErrorText(code)}`);
            }
          })


          //CAN mileage total
          const canMileageSensor = Object.values(sensors).find(value => value.n === "CAN - Mileage Total" || value.n === "CAN - Общий пробег");
          let canMileageLevel = "N/S";
          if (canMileageSensor) {
            canMileageLevel = (elem.calculateSensorValue(canMileageSensor, elem.getLastMessage()));
            if (canMileageLevel === -348201.3876) {
              canMileageLevel = "N/A";
           }
            if (canMileageLevel !== "N/A" && canMileageLevel !== "N/S" ) {
             canMileageLevel = Math.round(canMileageLevel);
            }
          }


          //CAN Air Temperature
          const canAirTemperatureSensor = Object.values(sensors).find(value => value.n === "CAN - Air Temperature" || value.n === "CAN - Температура воздуха");
          let canAirTemperature = "N/S";
          if (canAirTemperatureSensor) {

          canAirTemperature = (elem.calculateSensorValue(canAirTemperatureSensor, elem.getLastMessage()));
            if (canAirTemperature === -348201.3876) {
              canAirTemperature = "N/A";
            }
            if (canAirTemperature !== "N/A" && canAirTemperature !== "N/S" ) {
             canAirTemperature = Math.round(canAirTemperature);
            }
          }

          //CAN ignition

          const canIgnitionSensor = Object.values(sensors).find(value => value.n === "CAN - Ignition" || value.n === "CAN - Зажигание");
          let canIgnition = "N/S"

          if (canIgnitionSensor) {
            canIgnition = (elem.calculateSensorValue(canIgnitionSensor, elem.getLastMessage()));
            if (canIgnition === -348201.3876) {
              canIgnition = "N/A";
            }
            if (canIgnition === 0) {
              canIgnition = "off";
            }
            if (canIgnition !== "N/A" && canIgnition !== "N/S" && canIgnition !== 0) {
              canIgnition = "on";
            }
          }


          //CAN tacho
          const canTachoSensor = Object.values(sensors).find(value => value.t === "CAN - Tacho" || "CAN - Тахограф");
          let canTacho = "N/S";

            canTacho = (elem.calculateSensorValue(canTachoSensor, elem.getLastMessage()));

          // CAN fuel level
          const canFuelLevelSensor = Object.values(sensors).find(value => value.t === "fuel level");
          let canFuelLevel = "N/S";
          if (canFuelLevelSensor) {
            canFuelLevel = (elem.calculateSensorValue(canFuelLevelSensor, elem.getLastMessage()));
            if (canFuelLevel === -348201.3876) {
              canFuelLevel = "N/A";
              //fuelLevel.style.color = 'blue';
            }
            if (canFuelLevel !== "N/A" && canFuelLevel !== "N/S" ) {
              canFuelLevel = Math.round(canFuelLevel);
            }
          }

          //getting fuel sensor value
          const fuelLevelSensor = Object.values(sensors).find(value => value.t === "fuel level");
          let fuelLevel = "N/S";
          if (fuelLevelSensor) {
            fuelLevel = (elem.calculateSensorValue(fuelLevelSensor, elem.getLastMessage()));
            if (fuelLevel === -348201.3876) {
              fuelLevel = "N/A";
              //fuelLevel.style.color = 'blue';
            }
            if (fuelLevel !== "N/A" && fuelLevel !== "N/S" ) {
              fuelLevel = Math.round(fuelLevel);
              //fuelLevel.style.color = 'black';
            }
          }

          //getting temperature sensor value
          const temperatureSensor = Object.values(sensors).find(value => value.t === "temperature");
            let temperatureLevel = "N/S";
            if (temperatureSensor) {
              temperatureLevel = (elem.calculateSensorValue(temperatureSensor, elem.getLastMessage()));
              if (temperatureLevel === -348201.3876) {
                temperatureLevel = "N/A";
              }
              if (temperatureLevel !== "N/A" && temperatureLevel !== "N/S" ) {
                temperatureLevel = Math.round(temperatureLevel);
              }
            }

          //getting total mileage sensor value
          const mileageSensor = Object.values(sensors).find(value => value.t === "mileage");
          let mileageLevel = "N/S";
            if (mileageSensor) {
              mileageLevel = (elem.calculateSensorValue(mileageSensor, elem.getLastMessage()));
              if (mileageLevel === -348201.3876) {
                mileageLevel = "N/A";
              }
              if (mileageLevel !== "N/A" && mileageLevel !== "N/S" ) {
                mileageLevel = Math.round(mileageLevel);
              }
            }

          //getting engine sensor value
          const engineSensor = Object.values(sensors).find(value => value.t === "engine operation");
          let engineLevel = "N/S";
            if (engineSensor) {
              engineLevel = (elem.calculateSensorValue(mileageSensor, elem.getLastMessage()));
              if (engineLevel === -348201.3876) {
                engineLevel = "N/A";
              }
              if (engineLevel === 0) {
                engineLevel = "off";
              }
              if (engineLevel !== "N/A" && engineLevel !== "N/S" && engineLevel !== 0) {
                engineLevel = "on";
              }
            }

          //getting unit address
          let pos = elem.getPosition();
          let unitAddress = "N/A";
          if (pos) {
            wialon.util.Gis.getLocations([{lon:pos.x, lat:pos.y}], (code, address) => {
              if (code) {
                this.showMessage(`Error ${code} - ${wialon.core.Errors.getErrorText(code)}`);
              }
            unitAddress = address;
            });
          }

          return {
            position: elem.getPosition()? wialon.util.DateTime.formatTime((elem.getPosition()).t): "нет данных",
            speed: elem.getPosition()? elem.getPosition().s: "нет данных",
            name: elem.getName(),
            icon: elem.getIconUrl(),
            sensors: elem.getSensors(),
            fuelLevel,
            temperatureLevel,
            mileageLevel,
            engineLevel,
            plateNumber,
            address: unitAddress,
            canMileageLevel,
            canAirTemperature,
            canIgnition,
            canTacho,
          }
        })
      });
    }
  }
};

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

.gurtam__logo {
  margin-left: 20px;
  display: inline-block;
}

.logout-container {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.info__btn {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
  font-size: 18px;
  background-color: #F2F2F2;
  border: 2px solid gray;
}

.info__btn:focus,
.info__btn:hover {
  background-color: #CEF6CE;
  color: #585858;
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
