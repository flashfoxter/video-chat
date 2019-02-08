<template>
    <div id="wrapper">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div id="room-id-header">Room: {{room}}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <Button @click="leaveRoom" id="leave-room" label="Leave" color="blue" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-lg-6">
                    <video ref="local-stream" class="video" width="100%" autoplay playsinline />
                </div>
                <div class="col-12 col-lg-6">
                    <video ref="remote-stream" class="video" width="100%" autoplay playsinline />
                </div>
            </div>
        </div>
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
            peerConnection: new RTCPeerConnection(iceServersService),
            localStream: {},
            socket: {},
            remoteStream: {}
        };
    },
    created() {
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
                        this.peerConnection.addTrack(track, this.localStream);
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
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                    .then(() => {
                        this.socket.emit("connection-established");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });

            this.socket.on("get-candidate", (candidate) => {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
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
            this.peerConnection.createOffer()
                .then((offer) => {
                    return this.peerConnection.setLocalDescription(offer);
                })
                .then(() => {
                    this.socket.emit("send-offer", this.peerConnection.localDescription);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        sendAnswer(offer) {
            this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                .then(() => {
                    return this.peerConnection.createAnswer();
                })
                .then((answer) => {
                    return this.peerConnection.setLocalDescription(answer);
                })
                .then(() => {
                    this.socket.emit("send-answer", this.peerConnection.localDescription);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        setPeerConnectionEvents() {
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit("send-candidate", event.candidate);
                }
            };
        },
        getRemoteStream() {
            this.remoteStream = this.peerConnection.getRemoteStreams()[0];
            this.$refs["remote-stream"].srcObject = this.remoteStream;
        },
        resetPeerConnection() {
            this.$refs["remote-stream"].srcObject = null;
            this.socket.disconnect();
            this.peerConnection = new RTCPeerConnection(iceServersService)
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
#wrapper {
    padding: 15px 0px;
}

#room-id-header {
    font-size: 18px;
    margin-bottom: 10px;
}

#leave-room {
    margin-bottom: 15px;
}

.video {
    margin: 7.5px 0px;
}
</style>
