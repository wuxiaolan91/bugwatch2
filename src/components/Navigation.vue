<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/user-timeline">User Timeline</router-link></li>
      <li><router-link to="/user-list">User List</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
}

nav li {
  display: inline;
}
</style>