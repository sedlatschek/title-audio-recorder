<template>
  <div
    class="bg-amber-100 border-l-4 border-amber-500 text-amber-800 px-4 py-2 rounded"
    role="alert"
  >
    <p class="font-bold">
      <slot name="headline" />
    </p>
    <p><slot /></p>
  </div>
</template>
