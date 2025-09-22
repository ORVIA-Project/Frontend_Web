import { FaBell, FaQuestionCircle, FaUserCircle } from "react-icons/fa";
import { Empty, Typography  } from 'antd';
import "../styles/HomeStyle.css"

export default function HomeView(){
    return(
    <section className="home">
      <header className="home-header">
        <h1>¡HOLA, BIENVENIDO A ORVIA!</h1>

        <section className="header-icons">
          <FaQuestionCircle className="icon" />
          <FaBell className="icon" />
          <FaUserCircle className="icon profile" />
        </section>

      </header>
      <div className="ContentBox">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            styles={{ image: { height: 60 } }}
            description={
              <Typography.Text>
                Aún no hay citas..
              </Typography.Text>
            }
          ></Empty>
        </div>
    </section>
    );
}