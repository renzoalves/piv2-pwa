<template>
  <div class="box-whatsapp">
    <a
      target="_blank"
      title="Chat WhatsApp"
      :href="
        assinante
          ? 'https://api.whatsapp.com/send?l=pt&phone=5516981440170'
          : 'https://api.whatsapp.com/send?l=pt&phone=5516981440284'
      "
    >
      <img src="@/assets/images/whatsapp.png" alt="chat-whatsapp" />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    assinante: Boolean,
  },
};
</script>

<style scoped>
.box-whatsapp {
  width: 60px;
  height: 60px;
  position: fixed;

  bottom: 15px;
  right: 20px;

  z-index: 1080 !important;
}

.box-whatsapp img {
  width: 60px;
  height: 60px;
}
</style>
