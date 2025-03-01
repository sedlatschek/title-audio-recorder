<template>
  <button
    class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 p-2 text-white shadow-md transition-all duration-200 hover:from-amber-600 hover:to-yellow-500 hover:shadow-lg focus:ring-2 focus:ring-amber-300 focus:outline-none active:scale-95 active:from-amber-700 active:to-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:from-amber-500 disabled:hover:to-yellow-400 disabled:active:from-amber-500 disabled:active:to-yellow-400 dark:shadow-amber-900/30 dark:hover:shadow-amber-900/40 dark:focus:ring-amber-500"
    type="button">
    <slot />
  </button>
</template>
