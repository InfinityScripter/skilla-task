import './App.css'
import Home from "@/pages/home";
import {CallProvider} from "@/context/CallContext.tsx";

function App() {

    return (
        <CallProvider>
            <Home />
        </CallProvider>
    )
}

export default App
