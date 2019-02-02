<template>
    <Button @click="leaveRoom" label="Leave" color="blue" />
</template>

<script>
import Button from "@/components/Button";
import videoConstraintsService from "@/services/video-constraints-service";
import iceServersService from "@/services/ice-servers-service";

export default {
    props: {
        room: String
    },
    data() {
        return {
            peerConnection: new RTCPeerConnection(iceServersService),
            localStream: {}
        };
    },
    created() {
        
    },
    methods: {
        leaveRoom() {
            this.$router.replace("/");
        }
    },
    components: {
        Button
    }
};
</script>

<style scoped>

</style>
