import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
const TTS = lazy(() => import("./components/textToSpeech"));
const Home = lazy(() => import("./components/Home"));
const VideoRec = lazy(() => import("./components/VideoRecorder"));
const AudioRec = lazy(() => import("./components/AudioRecording"));
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/texttospeech" element={<TTS></TTS>}></Route>
        <Route path="/videorec" element={<VideoRec></VideoRec>}></Route>
        <Route path="/audiorec" element={<AudioRec></AudioRec>} />
      </>
    ),
    {
      future: {
        v7_normalizeFormMethod: true,
      },
    }
  );
  return (
    <Suspense fallback={<div>Loading..............</div>}>
      <RouterProvider router={router}></RouterProvider>
    </Suspense>
  );
};

export default App;
