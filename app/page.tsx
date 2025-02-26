import Welcome from "./components/Welcome";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import UpdateInfo from "./components/UpdateInfo";
import Aurora from './components/Aurora/Aurora';


export default function HomePage() {
  return (
    <div>

      <Welcome />
      <Services />
      <Testimonials />
      <UpdateInfo />
    </div>
  );
}
