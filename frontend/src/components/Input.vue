<template>
    <label>
        <span class="label">{{label}}</span>
        <input @input="$emit('input', $event.target.value)" class="input" :type="type" :placeholder="placeholder" :value="value" />
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

<style>
.label {
    font-size: 18px;
}

.input {
    border: none;
    outline: none;
    border-bottom: solid 1px #eeeeee;
    padding: 5px;
    font-size: 18px;
    color: #cccccc;
    background-color: #333333;
    width: 100%;
}
</style>
