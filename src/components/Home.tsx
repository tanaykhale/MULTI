import { Button, Container } from "@mui/material";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/texttospeech");
  };
  return (
    <>
      <Container>
        <Button onClick={handleNavigate}>Text to Speech</Button>
        <Button
          onClick={() => {
            navigate("/videorec");
          }}
        >
          Video Recording{" "}
        </Button>
        <Button
          onClick={() => {
            navigate("/audiorec");
          }}
        >
          Audio Recording
        </Button>
      </Container>
    </>
  );
};

export default Home;
