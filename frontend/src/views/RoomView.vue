<template>
    <div>
        <video ref="local-stream" id="local-stream" autoplay playsinline />
        <video ref="remote-stream" id="remote-stream" autoplay playsinline />
        <Button @click="leaveRoom" id="leave-room" label="LEAVE ROOM" color="blue" />
    </div>
</template>

<script>
import Button from "@/components/Button";
import videoConstraintsService from "@/services/video-constraints-service";
import iceServersService from "@/services/ice-servers-service";
import socketServerService from "@/services/socket-server-service";
import io from "socket.io-client";

export default {
    props: {
        room: String
    },
    data() {
        return {
            localStream: {},
            socket: {},
            remoteStream: {}
        };
    },
    created() {
        window.peerConnection = new RTCPeerConnection(iceServersService);
        this.setPeerConnectionEvents();
        this.getLocalStream();
    },
    beforeDestroy() {
        this.localStream.getTracks().forEach((track) => {
            track.stop()
        });

        this.socket.disconnect();
    },
    methods: {
        leaveRoom() {
            this.$router.replace("/");
        },
        getLocalStream() {
            navigator.mediaDevices.getUserMedia(videoConstraintsService)
                .then((stream) => {
                    this.localStream = stream;
                    this.$refs["local-stream"].srcObject = stream;

                    this.localStream.getTracks().forEach((track) => {
                        window.peerConnection.addTrack(track, this.localStream);
                    });

                    this.connectSocket();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        connectSocket() {
            this.socket = io(socketServerService);
            
            this.socket.on("request-room", () => {
                this.socket.emit("set-room", this.room);
            });

            this.socket.on("new-connection", () => {
                this.sendOffer();
            });

            this.socket.on("get-offer", (offer) => {
                this.sendAnswer(offer);
            });

            this.socket.on("get-answer", (answer) => {
                window.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                    .then(() => {
                        this.socket.emit("connection-established");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });

            this.socket.on("get-candidate", (candidate) => {
                window.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    .then(() => {
                        return;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });

            this.socket.on("ready", () => {
                this.getRemoteStream();
            });

            this.socket.on("someone-left", () => {
                this.resetPeerConnection();
            });

            this.socket.on("kick", () => {
                this.leaveRoom();
            });
        },
        sendOffer() {
            window.peerConnection.createOffer()
                .then((offer) => {
                    return window.peerConnection.setLocalDescription(offer);
                })
                .then(() => {
                    this.socket.emit("send-offer", window.peerConnection.localDescription);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        sendAnswer(offer) {
            window.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                .then(() => {
                    return window.peerConnection.createAnswer();
                })
                .then((answer) => {
                    return window.peerConnection.setLocalDescription(answer);
                })
                .then(() => {
                    this.socket.emit("send-answer", window.peerConnection.localDescription);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        setPeerConnectionEvents() {
            window.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit("send-candidate", event.candidate);
                }
            };
        },
        getRemoteStream() {
            this.remoteStream = window.peerConnection.getRemoteStreams()[0];
            this.$refs["remote-stream"].srcObject = this.remoteStream;
        },
        resetPeerConnection() {
            this.$refs["remote-stream"].srcObject = null;
            this.socket.disconnect();
            window.peerConnection = new RTCPeerConnection(iceServersService)
            this.setPeerConnectionEvents();
            this.getLocalStream();
        }
    },
    components: {
        Button
    }
};
</script>

<style scoped>
#local-stream {
    position: fixed;
    top: 15px;
    right: 15px;
    width: 20%;
    border: solid 1.75px black;
    opacity: 0.65;
    z-index: 1;
}

#remote-stream {
    position: fixed;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: cover;
}

#leave-room {
    position: fixed;
    top: 15px;
    left: 15px;
}
</style>
