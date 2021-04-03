<template>
  <p>
    <label>
      Réponse (insensible à la case)
      <input type="text" v-model.trim="answer" :disabled="hasTeamVoted" />
      <button @click="teamVote">Voter !</button>
    </label>
  </p>
</template>

<script lang="ts">
import { ref, defineComponent, PropType, Prop, watch, toRefs } from "vue";
import { Question, TextualQuestion } from "../../../server/types/questions";
import { socket } from "../../main";

export default defineComponent({
  name: "TextualQuestion",
  sockets: {
    vote(data: string) {
      this.hasTeamVoted = true;
      this.answer = data;
    },
  },
  props: {
    question: {
      type: Object as PropType<TextualQuestion>,
      required: true,
    },
  },
  setup: (props, ctx) => {
    let answer = ref("");
    let hasTeamVoted = ref(false);
    let { question } = toRefs(props);
    watch(question, () => {
      hasTeamVoted.value = false;
      answer.value = "";
    });
    let teamVote = () => {
      hasTeamVoted.value = true;
      ctx.emit("vote", answer.value);
    };

    return {
      answer,
      hasTeamVoted,
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
