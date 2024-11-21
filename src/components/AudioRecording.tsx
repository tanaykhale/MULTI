import { Box, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";

const AudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied or unavailable.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDownloadAudio = () => {
    if (audioURL) {
      const link = document.createElement("a");
      link.href = audioURL;
      link.download = "recording.webm";
      link.click();
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h3" sx={styles.title}>
        Audio Recorder
      </Typography>
      <Box>
        {!isRecording ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartRecording}
            sx={styles.button}
          >
            Start Recording
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={handleStopRecording}
            sx={styles.button}
          >
            Stop Recording
          </Button>
        )}
      </Box>

      {audioURL && (
        <Box sx={styles.audioContainer}>
          <Typography variant="h5" sx={styles.subtitle}>
            Recorded Audio
          </Typography>
          <audio controls src={audioURL} style={styles.audioPlayer} />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDownloadAudio}
            sx={styles.button}
          >
            Download Audio
          </Button>
        </Box>
      )}
    </Box>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    marginBottom: "10px",
    fontWeight: "500",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    margin: "10px",
    borderRadius: "5px",
    textTransform: "none",
  },
  audioContainer: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  audioPlayer: {
    marginBottom: "20px",
    width: "100%",
    maxWidth: "500px",
  },
};

export default AudioRecording;
