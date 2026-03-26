<script setup lang="ts">
/**
 * Memo ASCII Art Component
 */
const asciiArt = `
  __  __  ______  __  __  ______ 
 |  \\/  ||  ____||  \\/  ||  __  |
 | \\  / || |__   | \\  / || |  | |
 | |\\/| ||  __|  | |\\/| || |  | |
 | |  | || |____ | |  | || |__| |
 |_|  |_||______||_|  |_||______|
`;
</script>

<template>
    <div class="memo-ascii-wrapper">
        <pre class="memo-ascii" aria-label="Memo ASCII Art">{{ asciiArt }}</pre>
    </div>
</template>

<style scoped>
.memo-ascii-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: transparent;
}

.memo-ascii {
    font-family: 'Courier New', Courier, monospace;
    font-size: clamp(8px, 2vw, 16px);
    line-height: 1.2;
    white-space: pre;
    color: currentColor;
    margin: 0;
    padding: 1rem;
}
</style>
