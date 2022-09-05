<script lang="ts">
import { defineComponent } from "vue";
import type { Grid, Square } from "./types.d";
import { addNotes, getSquare, solve, solveOneStep } from "./utils";

export default defineComponent({
  mounted() {
    document.onkeydown = this.pressKey;
  },
  data() {
    let squares: Square[] = [];

    for (let i = 0; i < 9 * 9; i++) {
      squares = [{ value: 0, notes: [], solved: false }, ...squares];
    }

    const grid: Grid = {
      squares,
    };
    console.log(grid);
    return {
      grid,
      selectedCol: null as number | null,
      selectedLin: null as number | null,
    };
  },

  methods: {
    getSquare(lin: number, col: number) {
      return getSquare(this.grid, lin - 1, col - 1);
    },
    addNotes() {
      addNotes(this.grid);
    },
    solveOneStep() {
      solveOneStep(this.grid);
    },
    solve() {
      solve(this.grid);
    },
    pressKey(e: any) {
      if (!this.selectedLin || !this.selectedCol) return;

      if (/^[0-9]$/i.test(e.key)) {
        this.getSquare(this.selectedLin, this.selectedCol).value =
          Number.parseInt(e.key);
      } else {
        console.log(e.key);
        switch (e.key) {
          case "ArrowUp":
            this.selectedLin = Math.max(1, this.selectedLin - 1);
            break;
          case "ArrowDown":
            this.selectedLin = Math.min(9, this.selectedLin + 1);
            break;
          case "ArrowRight":
            this.selectedCol = Math.min(9, this.selectedCol + 1);
            break;
          case "ArrowLeft":
            this.selectedCol = Math.max(1, this.selectedCol - 1);
            break;
          case "Backspace":
            this.getSquare(this.selectedLin, this.selectedCol).value = 0;
            break;
        }
      }
    },
  },
});
</script>

<template>
  <main>
    <h1>Sudoku</h1>

    <div class="cols">
      <div class="lins" v-for="lin in 9" :key="lin">
        <div
          class="square"
          :class="{ selected: col === selectedCol && lin === selectedLin }"
          :style="{
            'border-top-width': lin % 3 === 1 ? '2px' : '',
            'border-right-width': col % 3 === 0 ? '2px' : '',
            'border-left-width': col === 1 ? '2px' : '',
            'border-bottom-width': lin === 9 ? '2px' : '',
            color: getSquare(lin, col).solved ? 'blue' : 'black',
          }"
          v-for="col in 9"
          :key="col"
          @click="
            () => {
              selectedLin = lin;
              selectedCol = col;
            }
          "
        >
          {{
            getSquare(lin, col).value === 0
              ? "\u00A0"
              : getSquare(lin, col).value
          }}
        </div>
      </div>
    </div>

    <div
      v-if="
        selectedCol &&
        selectedLin &&
        getSquare(selectedLin, selectedCol).notes.length > 0
      "
    >
      {{ getSquare(selectedLin, selectedCol).notes }}
    </div>

    <div v-if="selectedCol && selectedLin">
      <button
        v-for="b in 9"
        :key="b"
        @click="
          () => {
            if (selectedCol && selectedLin) {
              getSquare(selectedLin, selectedCol).value = b;
            }
          }
        "
      >
        {{ b }}
      </button>
      <button
        @click="
          () => {
            if (selectedCol && selectedLin) {
              getSquare(selectedLin, selectedCol).value = 0;
            }
          }
        "
      >
        X
      </button>
    </div>

    <button @click="addNotes">Add notes</button>
    <button @click="solveOneStep">Solve one step</button>
    <button @click="solve">Solve</button>
  </main>
</template>

<style scoped>
.square {
  font-family: "Courier New", Courier, monospace;
  border-width: 0.5px;
  border-style: solid;
  border-color: black;
  width: 25px;
  height: 25px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}

.cols {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.lins {
  display: flex;
  flex-direction: row;
  gap: 0;
}

.selected {
  background: gray;
}
</style>
