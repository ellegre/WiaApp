<template>
  <div v-if="token" class="general-container">
    <header class="main-header">
    <div class="main-header__container container">
      <img class="main-header__logo" src="./assets/tank_icon.png" width="62" height="62" alt="App logo">
      <h1 class="page-header__title">App Name</h1>
      <div class="logout-container">
        <button class="logout__btn">Logout</button>
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
        <Message></Message>
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
session.initSession('https://hst-api.wialon.com');
session.loadLibrary("itemIcon");
session.loadLibrary("unitSensors");

const UPDATE_INTERVAL = 60000; //time interval to refresh data

function msg(text) {
  document.querySelector('.error-message').showErrorMessage(text);
}

function showErrorMessage(text) {

}


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
      objects: [],
      feature: [],
    }
  },
  methods: {
    updateToken(token) {
      this.token = token;
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
    showObjects(){
      const searchSpec = {
        itemsType:"avl_unit", // тип искомых элементов системы Wialon
        propName: "sys_name", // имя свойства, по которому будет осуществляться поиск
        propValueMask: "*",   // значение свойства — могут быть использованы * | , > < =
        sortType: "!sys_id"  // имя свойства, по которому будет осуществляться сортировка ответа
        };
      const dataFlags = wialon.item.Item.dataFlag.base |
                      wialon.item.Unit.dataFlag.sensors |        // флаг базовых свойств
                      wialon.item.Unit.dataFlag.lastMessage  // флаг данных последнего сообщения

      // запрос поиска объектов
      session.searchItems(searchSpec, true, dataFlags, 0, 0, (code, data) => {
        if (code) {
          msg(wialon.core.Errors.getErrorText(code));
          return;
        }
        console.log(data);
        this.objects = data.items.map(elem => {
          return {
            position: elem.getPosition()? wialon.util.DateTime.formatTime((elem.getPosition()).t): "нет данных",
            speed: elem.getPosition()? elem.getPosition().s: "нет данных",
            name: elem.getName(),
            icon: elem.getIconUrl(),
            sensors: elem.getSensors()
          }
        })
      });
    },
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
    },
    updateSensors() {

      const unit = session.getItem();
      const sens = unit.getSensors();
      // calculate sensor value
     const result = unit.calculateSensorValue(sens, unit.getLastMessage());

      console.log(result)
      // print result message
      //msg("Value of "+ unit.getName() +" <b>'"+ sens.n +"'</b> sensor ("+ sens.t +"): "+ result + " ("+ sens.m +")");

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
