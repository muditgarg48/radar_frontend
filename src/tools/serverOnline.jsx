import store from "../store/store.js";
import { statusInitialising, statusOnline, statusOffline } from "../store/features/sessionSlice.js";

export default function serverOnline() {
    const serverStatus = store.getState().session.serverStatus;
    if (serverStatus === statusOffline) {
        return false;
    } else if (serverStatus === statusInitialising) {
        return false;
    } else if (serverStatus !== statusOnline) {
        console.log("Server unknown status: " + serverStatus);
        return false;
    } else {
        return true;
    }
}