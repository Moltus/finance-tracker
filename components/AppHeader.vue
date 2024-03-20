<template>
  <header class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold"> Finance Tracker </NuxtLink>
    <div class="flex gap-2">
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
