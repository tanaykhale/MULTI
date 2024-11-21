import React, { useState, useRef } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import RecordRTC from "recordrtc";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const access_key = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secret_key = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

const VideoRecorder: React.FC = () => {
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);

      // Attach the stream to the video element for preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const rec = new RecordRTC(stream, { type: "video" });
      rec.startRecording();
      setRecorder(rec);
      setRecording(true);
    } catch (error) {
      console.error("Error starting video recording:", error);
      alert("Unable to access your camera. Please check your permissions.");
    }
  };

  const stopRecording = async () => {
    if (!recorder) return;

    try {
      recorder.stopRecording(async () => {
        const blob = recorder.getBlob();
        const file = new File([blob], `video-${Date.now()}.webm`, {
          type: "video/webm",
        });

        // Stop the video stream
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop());
          setVideoStream(null);
        }

        setRecording(false);
        await uploadToS3(file);
      });
    } catch (error) {
      console.error("Error stopping video recording:", error);
      alert("An error occurred while stopping the recording.");
    }
  };

  const uploadToS3 = async (file: File) => {
    try {
      setUploading(true);

      const s3 = new S3Client({
        region: "eu-north-1", // Replace with your S3 bucket's region
        credentials: {
          accessKeyId: access_key, // Replace with your Access Key ID
          secretAccessKey: secret_key, // Replace with your Secret Access Key
        },
      });

      const command = new PutObjectCommand({
        Bucket: "tanay-video-bucket", // Replace with your bucket name
        Key: `videos/${Date.now()}.webm`,
        Body: file,
        ContentType: "video/webm",
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
      await fetch(signedUrl, { method: "PUT", body: file });

      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video to S3:", error);
      alert("Failed to upload video. Please check your configuration.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Video Recorder
      </Typography>
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        playsInline
        muted
        sx={{
          width: "80%",
          height: "70vh",
          border: "1px solid #ccc",
          borderRadius: "8px",
          mb: 3,
        }}
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={startRecording}
          disabled={recording || uploading}
        >
          {recording ? "Recording..." : "Start Recording"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={stopRecording}
          disabled={!recording || uploading}
        >
          Stop Recording
        </Button>
      </Box>
      {uploading && (
        <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={24} />
          <Typography>Uploading video, please wait...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default VideoRecorder;
