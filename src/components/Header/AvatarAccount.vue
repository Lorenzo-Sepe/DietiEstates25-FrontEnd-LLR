<template>
  <div class="profile-avatar">
    <Avatar 
@click="$emit('avatarclick')"
      :image="avatarUrl"
      :label="initials"
      shape="circle"
      size="48"
      class="avatar cursor-pointer"
    />
    <div v-if="!props.onlyAvatar" class="info">
      <div class="nome-visualizzato">{{ nomeVisualizzato }}</div>
      <div v-if="nomeAzienda" class="nome-azienda">{{ nomeAzienda }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed ,defineProps} from 'vue'
import { Avatar } from 'primevue'

const props= defineProps({
  avatarUrl: {
    type: String,
    default: 'https://placehold.co/400x400/4B00B4/FFFFFF?text=P'
  },
  nomeVisualizzato: {
    type: String,
    required: true,
    default: 'Nome Visualizzato'
  },
  nomeAzienda: {
    type: String,
    default: ''
  },
  onlyAvatar: {
    type: Boolean,
    default: false
  }
})


const initials = computed(() => {
  if (props.avatarUrl) return ''
  const names = props.nomeVisualizzato.split(' ')
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  } else {
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
  }
})
</script>

<style scoped>
.profile-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.avatar {
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nome-visualizzato {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.nome-azienda {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 2px;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .profile-avatar {
    gap: 0.5rem;
  }
  .nome-visualizzato {
    font-size: 0.9rem;
  }
  .nome-azienda {
    font-size: 0.75rem;
  }
}
</style>
