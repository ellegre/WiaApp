<template>
  <div class="general-container">
    <header class="main-header">
    <div class="main-header__container container">
      <img class="main-header__logo" src="./assets/tank_icon.png" width="62" height="62" alt="App logo">
      <h1 class="page-header__title">App Name</h1>
      <div class="logout__container">
        <button class="logout__btn">Logout</button>
        <span class="logout__span" id="username">{{message}}</span>
      </div>
      <div class="main-header__content">

        <Filters></Filters>
        <Menu></Menu>
      </div>
    </div>
    </header>
    <main class="page-main">
      <div class="page-main__container container">
        <section class="units">
          <h2 class="visually-hidden">Units</h2>

          <!-- Сортировка -->

          <!-- Контент -->
          <List></List>
        </section>
      </div>
    </main>

  </div>
</template>

<script>
import List from './components/List'


export default {
  components: {
    'List': List
  },
  data () {
    return {
      title: `My application`,
      message: `username`
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
  background-color: #D8D8D8;
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

.logout__container {
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
