<template>
    <label>
        <span class="label">{{label}}</span>
        <div class="input-container">
            <input @input="$emit('input', $event.target.value)" class="input" :type="type" :placeholder="placeholder" :value="value" />
        </div>
    </label>
</template>

<script>
export default {
    props: {
        value: String,
        label: String,
        placeholder: String,
        type: String
    }
};
</script>

<style scoped>
.label {
    font-size: 18px;
}

.input-container {
    border-bottom: solid 1px #eeeeee;
}

.input {
    outline: none;
    border: none;
    padding: 5px;
    font-size: 18px;
    color: #cccccc;
    background-color: #333333;
    width: 100%;
}
</style>
