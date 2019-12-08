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
      </div>
      <nav class="screen-controls container">
        <button v-on:click="component = 'List'" v-bind:class="{active: isActive}" class="screen-controls__btn" id="table">Table</button>
        <button v-on:click="component = 'Stats'" v-bind:class="{active: isActive}" class="screen-controls__btn" id="stat">Stats</button>
      </nav>
    </header>
    <main class="page-main">
      <div class="page-main__container container">
        <div v-if="component == 'Stats'" class="charts-container">
          <div class="stats-container">
            <Stats   :chartdata="chartDataSpeed"  :options="chartOptionsSpeed"></Stats>
          </div>
          <div class="stats-container">
           <PieChart  :chartdata="chartDataPie"  :options="chartOptionsPie"></PieChart>
          </div>
          <div class="stats-container">
           <Stats :chartdata="chartDataTemperature"  :options="chartOptionsTemperature"></Stats>
          </div>
          <div class="stats-container">
            <Stats   :chartdata="chartDataDailyMileage"  :options="chartOptionsDailyMileage"></Stats>
           </div>
        </div>
        <List v-if="component == 'List'" :objects="objects"></List>


        <Message v-bind:message="currentMessage" v-bind:onClose="closeMessage"></Message>
        <Info v-bind:info="info" v-bind:onClose="closeInfo"></Info>
        <ShortMessage></ShortMessage>
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
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import ShortMessage from './components/ShortMessage'


const session = wialon.core.Session.getInstance();
const UPDATE_INTERVAL = 60000; //time interval to refresh data, ms


function getUnitMovingState(elem) {
  let info = {
    isMoving: false, // by real-time sensor or speed
    isIgnitionOn: null, // Boolean | null

    isLbs: false,
    isStale: true, // expired `unitMovingTimeout`

    isPositionPresent: false,
    isIgnitionPresent: false,
    isRealTimeSensorPresent: false
  };

  let pos = elem.getPosition();

  if (!pos) {
    return "--";
  }

  info.isPositionPresent = true;

  // LBS
  info.isLbs = !!(
    pos.s <= 0 &&
    typeof pos.f === "number" &&
    wialon.util.Number.and(pos.f, wialon.item.Unit.dataMessageFlag.lbsFlag)
  );

  let serverTime = session.getServerTime();
  let currentUser = session.getCurrUser();

  // Stale position
  let unitMovingTimeout = parseInt(
    currentUser.getCustomProperty("mu_move_durr", "3600"),
    10
  );
  if (!isFinite(unitMovingTimeout)) unitMovingTimeout = 3600;

  info.isStale = unitMovingTimeout < serverTime - pos.t;

  // Sensors
  let sensors = elem.getSensors();

  let realTimeSensor, ignitionSensor;

  for (let prop in sensors)
    if (sensors[prop].t === "real-time motion sensor") {
      realTimeSensor = sensors[prop];
      break;
    }
  for (let prop in sensors)
    if (sensors[prop].t === "engine operation") {
      ignitionSensor = sensors[prop];
      break;
    }

  // Ignition
  let ignitionSensorValue = null;

  if (ignitionSensor) {
    ignitionSensorValue = elem.calculateSensorValue(ignitionSensor,elem.getLastMessage());

    if (typeof ignitionSensorValue === "number") {
      info.isIgnitionPresent = true;
    }
  }

  info.isIgnitionOn = !!ignitionSensorValue;

  // Moving state
  let realTimeSensorValue = null;

  if (realTimeSensor) {
    realTimeSensorValue = elem.calculateSensorValue(realTimeSensor, elem.getLastMessage());

    if (typeof realTimeSensorValue === "number") {
      info.isRealTimeSensorPresent = true;
    }
  }

  if (typeof realTimeSensorValue === "number") {
    info.isMoving = realTimeSensorValue !== 0;
  } else {
    info.isMoving = pos.s > 0;
  }

  let movingState;

  if (info.isMoving) {
    movingState = "YES";
  }
  else {
    movingState = "NO";
  }
  return movingState;
}

function getPlateNumber(profileData) {
  let plateNumbers = Object.values(profileData).find(value => value.n === "registration_plate");
  let plateNumber = "--";
  if (plateNumbers) {
    plateNumber = Object.values(plateNumbers)[2];
  }
  return plateNumber;
}

function getFuelLevel(elem) {
  const fuelLevelSensor = Object.values(elem.getSensors()).find(value => value.t === "fuel level");
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
  return fuelLevel;
}

function getTemperatureLevel(elem) {
  const temperatureSensor = Object.values(elem.getSensors()).find(value => value.t === "temperature");
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
  return temperatureLevel;
}

function getMileageLevel(elem) {
  const mileageSensor = Object.values(elem.getSensors()).find(value => value.t === "mileage");
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
  return mileageLevel;
}

function getEngineLevel(elem) {
  const engineSensor = Object.values(elem.getSensors()).find(value => value.t === "engine operation");
  let engineLevel = "N/S";
  if (engineSensor) {
    engineLevel = (elem.calculateSensorValue(engineSensor, elem.getLastMessage()));
    if (engineLevel === -348201.3876) {
      engineLevel = "N/A";
    }
    if (engineLevel === 0) {
      engineLevel = "off";
    }
    if (engineLevel === 1) {
      engineLevel = "on";
    }
  }
  return engineLevel;
}


export default {
  components: {
    'List': List,
    'Auth': Auth,
    'Stats': Stats,
    'Message': Message,
    'Info': Info,
    'LineChart': LineChart,
    'PieChart': PieChart,
    'ShortMessage': ShortMessage
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
      image: "./assets/question.png",
      info: false,
      component: 'List',
      isActive: true,
    }
  },

  computed: {
    chartDataSpeed() {
      let data = this.objects
      .filter(elem => elem.speed != "--")
      .sort((a, b) => b.speed - a.speed)
      .slice(0, 5);

      return {
        labels: data.map(elem => elem.name),
        datasets: [{
          label: "Speed, km/h",
          backgroundColor: '#E6E6E6',
          borderColor: 'rgb(255, 99, 132)',
          data: data.map(elem => elem.speed)
        }]
      }
    },
    chartOptionsSpeed() {
      return {
        title: {
          display: true,
          text: 'Top-5 vehicles by speed',
          fontSize: 22,
          padding: 20
        }
      }
    },
    chartDataPie() {
      let data = this.objects
      .filter(elem => elem.speed != "--")
      .sort((a, b) => b.speed - a.speed)
      .slice(0, 5);

      return {
        labels: data.map(elem => elem.name),
        datasets: [{
          label: "Objects, %",
          backgroundColor: ['#64FE2E','#BDBDBD'],
          borderColor: '#E6E6E6',
          data: data.map(elem => elem.speed)
        }]
      }
    },
    chartOptionsPie() {
      return {
        title: {
          display: true,
          text: 'Objects in motion',
          fontSize: 22,
          padding: 20
        }
      }
    },
    chartDataTemperature() {
      let data = this.objects
      .filter(elem => elem.speed != "--")
      .sort((a, b) => b.speed - a.speed)
      .slice(0, 5);

      return {
        labels: data.map(elem => elem.name),
        datasets: [{
          label: "Temperature, °C",
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: '#E6E6E6',
          data: data.map(elem => elem.speed)
        }]
      }
    },
    chartOptionsTemperature() {
      return {
        title: {
          display: true,
          text: 'Top-5 by temperature',
          fontSize: 22,
          padding: 20
        }
      }
    },
    chartDataDailyMileage() {
      let data = this.objects
      .filter(elem => elem.speed != "--")
      .sort((a, b) => b.speed - a.speed)
      .slice(0, 5);

      return {
        labels: data.map(elem => elem.name),
        datasets: [{
          label: "Mileage, km",
          backgroundColor: '#81BEF7',
          borderColor: 'rgb(255, 99, 132)',
          data: data.map(elem => elem.speed)
        }]
      }
    },
    chartOptionsDailyMileage() {
      return {
        title: {
          display: true,
          text: 'Top-5 vehicles by daily mileage',
          fontSize: 22,
          padding: 20
        }
      }
    },
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
      session.loadLibrary("unitTripDetector");

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
                      wialon.item.Unit.dataFlag.restricted


      session.searchItems(searchSpec, true, dataFlags, 0, 0, (code, data) => {
        if (code) {
          this.showMessage(`Error ${code} - ${wialon.core.Errors.getErrorText(code)}`);
          return;
        }
        console.log(data);
        const locationsToGet = [];

        const partialData = data.items.map(elem => {
          const sensors = elem.getSensors();
          const profileData = elem.getProfileFields();

          // Get vehicle moving state
          const movingState = getUnitMovingState(elem);

          // Get unit plate number
          const plateNumber = getPlateNumber(profileData);

          // Get an array of coordinates of all units for later getting current unit position (address)
          let pos = elem.getPosition();
          let locationIndex = null;
          if(pos) {
            locationsToGet.push({lon:pos.x, lat:pos.y});
            locationIndex = locationsToGet.length - 1;
          }

          //Get fuel sensor value
          const fuelLevel = getFuelLevel(elem);

          //Get temperature sensor value
          const temperatureLevel = getTemperatureLevel(elem);

          //Get total mileage sensor value
          const mileageLevel = getMileageLevel(elem);

          //Get engine sensor value
          const engineLevel = getEngineLevel(elem);

          return {
            lastMessage: elem.getPosition()? wialon.util.DateTime.formatTime((elem.getPosition()).t): "--",
            speed: elem.getPosition()? elem.getPosition().s: "--",
            name: elem.getName(),
            icon: elem.getIconUrl(),
            sensors: elem.getSensors(),
            mileageCounter:elem.getMileageCounter()? elem.getMileageCounter().toLocaleString(): "--",
            locationIndex,
            fuelLevel,
            temperatureLevel,
            mileageLevel,
            engineLevel,
            plateNumber,
            movingState,
            movingToday: "N/A"
          }
        });
        wialon.util.Gis.getLocations(locationsToGet, (code, addresses) => {
          if (code) {
            this.showMessage(`Error ${code} - ${wialon.core.Errors.getErrorText(code)}`);
          } else {
            const finalData = partialData.map(elem => {
              if (elem.locationIndex !== null) {
                elem.address = addresses[elem.locationIndex];
              } else {
                elem.address = "--"
              }
              return elem;
            });
            this.objects = finalData;
          }
        });
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
  padding-bottom: 10px;
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
  background: #F2F2F2;
  border: 2px solid gray;
}

.info__btn:focus,
.info__btn:hover {
  background: #FAFAFA;
  color: #0000FF;
}

.logout__btn {
  background: linear-gradient(to bottom, #F2F2F2 0%, #E6E6E6 100%);
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  font-family: inherit;
  border-radius: 15px;
  padding: 5px;
}

.logout__btn:focus,
.logout__btn:hover {
  background: linear-gradient(to bottom, #F2F2F2 0%, #E0F8E6 100%);
  color: #0000FF;
}

.logout__span {
  margin-left: 10px;
  color: #fff;
  font-family: Comic Sans MS;
  font-size: 17px;
}

.main-header__content {
  width: 100%;
}


.charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.stats-container {
  width: 500px;

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

.screen-controls__btn {
 width: 80px;
 cursor: pointer;
 padding: 10px;
 color: #fff;
 font-size: 20px;
 font-weight: 700;
 background-color: #078ff0;
 border: none;
 outline: none;
}

.active {
  text-decoration: underline;
  font-size: 22px;
}
</style>
