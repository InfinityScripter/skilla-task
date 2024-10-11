import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Pause, Play, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { fetchCallRecord } from "@/lib/services/callService";
import { formatTimePlayer } from "@/lib/utils.ts";

interface CallRecordProps {
    recordId: string;
    partnershipId: string;
    onPlayStateChange?: (isPlaying: boolean) => void;
}


const CallRecord = ({ recordId, partnershipId }: CallRecordProps) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {
        const loadRecord = async () => {
            try {
                if (!recordId) {
                    return;
                }

                const audioBlob = await fetchCallRecord(recordId, partnershipId);
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                const newAudio = new Audio(audioUrl);

                newAudio.onloadedmetadata = () => {
                    setProgress(0);
                };

                newAudio.ontimeupdate = () => {
                    setCurrentTime(newAudio.currentTime);
                    setProgress((newAudio.currentTime / newAudio.duration) * 100);
                };

                newAudio.onended = () => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                    setProgress(0);
                };

                setAudio(newAudio);
            } catch (error) {
                console.error("Ошибка при получении записи:", error);
            }
        };

        loadRecord();
    }, [recordId, partnershipId]);

    const handlePlayPause = () => {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleDownload = () => {
        if (!audioUrl) return;
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = `record_${recordId}.mp3`;
        link.click();
    };

    const handleReset = () => {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
    };

    if (!audioUrl) {
        return null;
    }

    return (
        <div className="flex items-center bg-[#eaf0fa] rounded-[48px] p-1.5">
            <span className="text-sm text-gray-700 mx-2 ">
                {formatTimePlayer(currentTime)}
            </span>
            <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className={`mx-2 rounded-full bg-white hover:bg-white`}
            >
                {isPlaying ? (
                    <Pause size={20} className="text-blue-600 fill-current" />
                ) : (
                    <Play size={20} className="text-blue-600 fill-current" />
                )}
            </Button>
            <div className="flex-grow mx-2">
                <Progress value={progress} className="bg-gray-200 h-[4px] w-[80px] rounded-full" />
            </div>
            <Button
                size="icon"
                variant="ghost"
                onClick={handleDownload}
            >
                <Download size={20} className="text-gray-400 hover:text-blue-600" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                onClick={handleReset}
            >
                <X size={20} className="text-gray-400 hover:text-blue-600" />
            </Button>
        </div>
    );
};

export default CallRecord;
