<template>
  <header class="flex justify-between items-center mt-5">
    <NuxtLink to="/" class="text-xl font-bold"> Finance Tracker </NuxtLink>
    <div class="flex gap-2 items-center">
      <ClientOnly>
        <ColorModeSelector />
      </ClientOnly>
      <UAvatar
        src="https://avatars.githubusercontent.com/u/739984?v=4"
        alt="Avatar"
      />
    </div>
  </header>
</template>
