<template>
  <p>This is a SingleChoiceQuestion</p>
  <p>{{ question }}</p>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { SingleChoiceQuestion } from "../../../server/types/questions";

export default defineComponent({
  name: "SingleChoiceQuestion",
  props: {
    question: {
      type: SingleChoiceQuestion,
      required: true,
    },
  },
  setup: () => {},
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
