<template>
  <p>This is a MultipleChoiceQuestion</p>
  <input v-for="q in question.choices" type="checkbox" :value="q" v-model="choices" />
  <button @click="teamVote">Voter !</button>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { MultipleChoiceQuestion } from "../../../server/types/questions";

export default defineComponent({
  name: "MultipleChoiceQuestion",
  props: {
    question: {
      type: MultipleChoiceQuestion,
      required: true,
    },
  },
  setup: () => {
    let choices = ref<string[]>([]);
    let teamVote = () => {
      console.log(choices.value);
    };

    return {
      choices,
      teamVote,
    };
  },
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
