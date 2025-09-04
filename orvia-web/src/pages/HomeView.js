import { FaBell, FaQuestionCircle, FaUserCircle } from "react-icons/fa";
import "../styles/HomeStyle.css"

export default function HomeView(){
    return(
    <section className="home">
      <header className="home-header">
        <h1>¡HOLA, BIENVENIDO A ORVIA!</h1>
        <div className="header-icons">
          <FaQuestionCircle className="icon" />
          <FaBell className="icon" />
          <FaUserCircle className="icon profile" />
        </div>
      </header>
    </section>
    );
}