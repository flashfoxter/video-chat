<template>
    <div id="wrapper">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div id="header">Video Chat</div>
                </div>
                <div id="room-input" class="col-12">
                    <Input v-model="room" type="text" label="Room" />
                </div>
                <div class="col-12">
                    <Button @click="joinRoom" class="button" label="JOIN" color="blue" />
                    <Button @click="randomizeRoom" class="button" label="RANDOMIZE" color="blue" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Input from "@/components/Input";
import Button from "@/components/Button";
import uuid from "uuid/v4";

export default {
    data() {
        return {
            room: ""
        };
    },
    created() {
        this.getRoom();
    },
    watch: {
        room(newValue) {
            localStorage.setItem("room", newValue);
        }
    },
    methods: {
        getRoom() {
            const room = localStorage.getItem("room");

            if (room) {
                this.room = room;
            }
        },
        randomizeRoom() {
            this.room = uuid();
        },
        joinRoom() {
            this.$router.replace("/room/" + this.room);
        }
    },
    components: {
        Input,
        Button
    }
};
</script>

<style scoped>
#wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
}

#wrapper > * {
    max-width: 600px;
}

#header {
    text-align: center;
    font-size: 35px;
}

#room-input {
    margin: 25px 0px;
}

.button + .button {
    margin-left: 10px;
}
</style>
