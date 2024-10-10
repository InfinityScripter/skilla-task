import CallFilter from "@/components/Call/CallFilter.tsx";
import CallList from "@/components/Call/CallList.tsx";
import CallHeader from "@/components/Call/CallHeader.tsx";

const Home = () => {
    return (
        <div>
            <CallFilter/>
            <CallHeader/>
            <CallList/>
        </div>
    );
};

export default Home;
