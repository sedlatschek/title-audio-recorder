<template>
  <div
    class="bg-opacity-75 rounded border-l-4 border-amber-500 bg-amber-100 px-4 py-2 text-amber-800 dark:border-amber-800 dark:bg-yellow-700/35 dark:text-white"
    role="alert">
    <p class="font-bold">
      <slot name="headline" />
    </p>
    <p><slot /></p>
  </div>
</template>
