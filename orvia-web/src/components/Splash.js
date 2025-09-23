import { useEffect } from "react";
import logo from "../assets/LogoV2.png";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // ⏱️ 2 segundos de splash (ajústalo a gusto)

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#051743",
      color: "white"
    }}>
      <img src={logo} alt="Logo" width="10%" />
      
    </div>
  );
}
