<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn color="primary" dark @click.stop="dialogDate = true" data-cy="new-event-cy">New Event</v-btn>
          <v-btn outlined class="mr-4" @click="setToday" data-cy="today-cy">Today</v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title data-cy="title-cy">{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialogDate" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="name" type="text" data-cy="name-calendar-cy" label="event name (required)"></v-text-field>
              <v-text-field v-model="start" type="date" data-cy="start-calendar-cy" label="start (required)"></v-text-field>
              <v-text-field v-model="end" type="date" data-cy="end-calendar-cy" label="end (required)"></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                class="mr-4"
                data-cy="submit-event-cy"
                @click="dialogDate = false"
              >create event</v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:more="viewDay"
          @click:date="setDialogDate"
          @change="updateRange"
          data-cy="calendar-cy"
        >
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import EventService from "../services/EventService.js";

export default {
  data: () => ({
    title: "",
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    name: null,
    details: null,
    start: null,
    end: null,
    color: "#1976D2",
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    dialogDate: false
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.setTitle();
    this.getEvents();
  },
  methods: {
    setTitle() {
      const end = this.end;
      const month = Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(end.date)
      );
      this.title = `${month} ${end.year}`;
    },
    async getEvents() {
      let events = [];
      let eventsService = await new EventService();
      let response = await eventsService.list();
      if (response.status == 200) {
        response.data.forEach(event =>
          events.push({
            name: event.description,
            start: event.start_date,
            end: event.end_date,
            color: "#D9AD2A"
          })
        );
      }
      this.events = events;
    },
    setDialogDate({ date }) {
      this.dialogDate = true;
      this.focus = date;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
      this.setTitle();
    },
    next() {
      this.$refs.calendar.next();
      this.setTitle();
    },
    async addEvent() {
      if (this.name && this.start && this.end) {
        let eventsService = await new EventService();
        await eventsService.create({
          event: {
            description: this.name,
            start_date: this.start,
            end_date: this.end
          }
        });
        this.getEvents();
        this.name = "";
        this.start = "";
        this.end = "";
      } else {
        alert("You must enter event name, start, and end time");
      }
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>