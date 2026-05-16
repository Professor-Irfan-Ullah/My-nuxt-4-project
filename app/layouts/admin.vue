<template>
  <!-- Main layout container adapts from vertical stacking on mobile to side-by-side row on desktop -->
  <div
    class="flex h-screen w-full flex-col bg-slate-50 font-sans text-slate-900 antialiased md:flex-row dark:bg-slate-900 dark:text-slate-50"
  >
    <!-- Navigation: Top Bar on Mobile, Left Sidebar on Desktop -->
    <aside
      class="flex w-full flex-col border-b border-slate-200 bg-white p-4 md:w-64 md:flex-col md:border-b-0 md:border-r dark:border-slate-800 dark:bg-slate-950"
    >
      <!-- Logo + User Quick Row -->
      <div
        class="flex items-center justify-between px-2 pb-3 md:mb-6 md:justify-start md:gap-2 md:pb-0"
      >
        <div class="flex items-center gap-2">
          <div class="h-6 w-6 rounded bg-indigo-600"></div>
          <span
            class="font-semibold tracking-wide text-slate-900 dark:text-white"
            >AdminPortal</span
          >
        </div>

        <!-- Mobile Profile Avatar (hidden on desktop footer) -->
        <div
          class="h-7 w-7 rounded-full bg-slate-300 md:hidden dark:bg-slate-700"
        ></div>
      </div>

      <!-- Navigation Links: Horizontal Scroll on Mobile, Vertical Stack on Desktop -->
      <nav
        class="flex flex-row gap-1 overflow-x-auto no-scrollbar md:flex-1 md:flex-col md:overflow-x-visible"
      >
        <NuxtLink
          to="/admin"
          class="whitespace-nowrap flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          active-class="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/users"
          class="whitespace-nowrap flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          active-class="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
        >
          Users
        </NuxtLink>
        <NuxtLink
          to="/admin/settings"
          class="whitespace-nowrap flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          active-class="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
        >
          Settings
        </NuxtLink>
      </nav>

      <!-- Desktop-only User Profile Footer -->
      <div
        class="mt-auto hidden border-t border-slate-200 pt-4 md:block dark:border-slate-800"
      >
        <div class="flex items-center gap-3 px-2">
          <div
            class="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700"
          ></div>
          <div class="flex flex-col">
            <span class="text-xs font-semibold">Alex Doe</span>
            <span class="text-[10px] text-slate-500">Admin</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Top Navbar Header (Hidden on mobile to save space) -->
      <header
        class="hidden h-14 items-center justify-between border-b border-slate-200 bg-white px-6 md:flex dark:border-slate-800 dark:bg-slate-950"
      >
        <h1 class="text-sm font-medium text-slate-500">Overview</h1>
        <div class="flex items-center gap-4">
          <button
            class="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            🔔
          </button>
        </div>
      </header>

      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Utility to hide scrollbar while keeping horizontal swipe functional on mobile */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
