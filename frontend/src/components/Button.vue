<template>
    <button @click="$emit('click')" :class="buttonClasses">{{label}}</button>
</template>

<script>
export default {
    props: {
        label: String,
        color: String
    },
    computed: {
        buttonClasses() {
            const buttonClasses = ["button"];

            if (this.color) {
                buttonClasses.push("button-" + this.color);
            }

            return buttonClasses.join(" ");
        }
    }
};
</script>

<style scoped>
.button {
    padding: 7.5px 20px;
    border: none;
    outline: none;
    font-size: 16px;
}

.button:hover {
    cursor: pointer;
}

.button-blue {
    background-color: rgb(46, 137, 221);
}

.button-blue:hover {
    background-color: rgb(46, 100, 200);
}
</style>
