import CallFilter from "@/components/Call/CallFilter";
import CallList from "@/components/Call/CallList";

const Home = () => {
    return (
            <div className="w-auto">
                <CallFilter/>
                <CallList/>
            </div>
    );
};

export default Home;
