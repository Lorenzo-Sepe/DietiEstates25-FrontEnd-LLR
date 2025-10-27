<template>
  <div
    class="profile-avatar group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition hover:bg-gray-100"
    @click="$emit('avatarClick')"
  >
    <Avatar
      :image="avatarUrl"
      :label="initials"
      shape="circle"
      size="48"
      class="avatar transition-transform group-hover:scale-105"
    />

    <div v-if="!props.onlyAvatar" class="info">
      <div class="nome-visualizzato font-medium text-gray-900 leading-tight">
        {{ nomeVisualizzato }}
      </div>
      <div v-if="nomeAzienda" class="nome-azienda text-sm text-gray-600">
        {{ nomeAzienda }}
      </div>
    </div>
  </div>
</template>

<script setup>
import Avatar from "primevue/avatar";
const props = defineProps({
  avatarUrl: String,
  initials: String,
  nomeVisualizzato: String,
  nomeAzienda: String,
  onlyAvatar: Boolean,
});
</script>

<style scoped>
.profile-avatar {
  user-select: none;
}

/* Effetto click leggero */
.profile-avatar:active {
  transform: scale(0.98);
}
</style>
