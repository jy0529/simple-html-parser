<template>
  <div id="container">
    <textarea id="editor" v-model="source"></textarea>
    <pre id="output"></pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref, watchEffect } from 'vue';
import { parse } from './parser';

export default defineComponent({
  name: 'App',
  setup() {
    let source: Ref = ref('');

    onMounted(() => {
      source.value = `
        <html>
          <body>
            <h1>Title</h1>
            <div id="main" class="test">
              <p>Hello <em>world</em>!</p>
            </div>
          </body>
        </html>
      `;

      watchEffect(() => {
        let output = document.getElementById('output');
        if (output !== null) {
          try {
            output.innerHTML = JSON.stringify(parse(source.value), null, 2);
          } catch (error) {
            output.innerHTML = error;
          }
        }
      });
    });

    return {
      source,
    }
  }
})
</script>

<style>
html, body{
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px 0;
  height: 100%;
}
#container {
  display: flex;
  width: 100%;
  height: 90%;
  overflow-y: scroll;
}
#editor {
  flex: none;
  width: 40%;
  resize: none;
  overflow-y: scroll;
}
#output {
  flex: 1;
  border: 2px solid black;
  margin-right: 10px;
  overflow-y: scroll;
  margin: 0;
}
</style>
