<script setup>
</script>

<template>
  <router-view />
</template>

<style>
html, body, #app {
  height: 100%;
}

textarea,
input[type='text'],
input[type='search'],
input[type='number'],
input[type='email'],
input[type='password'],
input[type='url'],
input[type='tel'],
select {
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;
}

textarea:focus,
input[type='text']:focus,
input[type='search']:focus,
input[type='number']:focus,
input[type='email']:focus,
input[type='password']:focus,
input[type='url']:focus,
input[type='tel']:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary-400, #8a7cff);
  box-shadow: 0 0 0 1px rgba(107, 86, 246, 0.18);
}

textarea:focus-visible,
input[type='text']:focus-visible,
input[type='search']:focus-visible,
input[type='number']:focus-visible,
input[type='email']:focus-visible,
input[type='password']:focus-visible,
input[type='url']:focus-visible,
input[type='tel']:focus-visible,
select:focus-visible {
  outline: none;
}
</style>
