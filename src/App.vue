<template>
  <v-app>
    <v-content>
      <EventCalendar/>
    </v-content>
  </v-app>
</template>

<script>
import EventCalendar from './components/EventCalendar';

export default {
  name: 'App',

  components: {
    EventCalendar,
  },

  data: () => ({
    //
  }),
};
</script>
