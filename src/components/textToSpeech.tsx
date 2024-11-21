import { Box, Button, Container, Typography } from "@mui/material";

import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
const textToSpeech = () => {
  const [value, setValue] = useState("");
  const { speak } = useSpeechSynthesis();
  return (
    <Container>
      <Box className="title">
        <Typography variant="h3">Text to Speech</Typography>
      </Box>
      <Box className="textarea">
        <textarea
          aria-label="minimum height"
          rows={5}
          placeholder="Enter the text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Box>
      <Button onClick={() => speak({ text: value })}>Speech</Button>
    </Container>
  );
};

export default textToSpeech;
