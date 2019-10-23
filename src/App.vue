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
          <Indicators></Indicators>
          <List :objects="objects"></List>

        </section>
        <section class="fuel">
          <Table></Table>

        </section>
      </div>
    </main>
  </div>
  <Auth v-else v-bind:onSuccess="updateToken"></Auth>
</template>

<script>
import List from './components/List'
import Indicators from './components/Indicators'
import Table from './components/Table'
import Auth from './components/Auth'

const session = wialon.core.Session.getInstance();
session.initSession('https://hst-api.wialon.com');
session.loadLibrary("itemIcon");



export default {
  components: {
    'List': List,
    'Indicators': Indicators,
    'Auth': Auth,
    'Table': Table
  },
  data () {
    return {
      token: null,
      user: {
        name: null,
        position: {
           t: null
        }
      },
      objects: [],
      feature: []
    }
  },
  methods: {
    updateToken(token) {
      this.token = token;

      session.loginToken(token, (code) => {
        const user = session.getCurrUser();
        this.user.name = user.getName();
        this.showObjects();
        const feature = session.getFeatures();
        console.log(feature)
      });
    },
    showObjects(){
      const searchSpec = {
        itemsType:"avl_unit", // тип искомых элементов системы Wialon
        propName: "sys_name", // имя свойства, по которому будет осуществляться поиск
        propValueMask: "*",   // значение свойства — могут быть использованы * | , > < =
        sortType: "sys_name"  // имя свойства, по которому будет осуществляться сортировка ответа
    };
      const dataFlags = wialon.item.Item.dataFlag.base |        // флаг базовых свойств
                      wialon.item.Unit.dataFlag.lastMessage;  // флаг данных последнего сообщения

      // запрос поиска объектов
      session.searchItems(searchSpec, true, dataFlags, 0, 0, (code, data) => {
        console.log(data);
        this.objects = data.items.map(elem => ({
          position: elem.getPosition(),

          name: elem.getName(),
          id: elem.getId(),
          icon: elem.getIconUrl()
        }))
      });
    }
  }
}

</script>

<style>
  html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  color: #333;
  font-size: 18px;
  font-family: Comic Sans MS;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.main-header {
  background-color: #078ff0;;
}

.main-header__container {
  padding: 5px 25px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

}

.container {
  width: 1200px;
  padding: 0 10px;
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
  line-height: 21px;
  font-family: inherit;
  border-radius: 15px;
  padding: 8px;
}

.logout__btn:focus,
.logout__btn:hover {
  background: linear-gradient(to bottom, #F2F2F2 0%, #E0F8E6 100%);
  color: #585858;
}

.logout__span {
  color: #fff;
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
