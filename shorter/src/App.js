import React, { useState, useEffect } from "react";
import {
  Button,
  CustomProvider,
  Container,
  Toggle,
  Grid,
  Row,
  Col,
  Notification,
  Input,
  Divider,
} from "rsuite";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Import db
import "rsuite/dist/rsuite.min.css";
import "./App.css";
import whiteBackground from "./Assets/b.jpg";
import DarkBackground from "./Assets/v1.jpg";
import LoadingOverlay from "./overlay";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(
    //get actual theme
    JSON.parse(localStorage.getItem("darkMode"))
  );
  const [iscustom, setIsCustm] = useState("false");
  const [custom, setcustm] = useState("");
  const [oldLink, setOldLink] = useState("");
  const [newLink, setNewLink] = useState("");
  const [resolve, setResolve] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [status, Setstatus] = useState(0); //0: nothing, 1:success, 2:error

  //get page/link from databse
  const resolveLink = async (code) => {
    let linkCustom=window.location.pathname.substring(1).includes('-')
    const docRef = doc(db, (linkCustom===false?("links"):("linksCustom")), (linkCustom===false?(window.location.pathname.substring(1)):(window.location.pathname.substring(2))));
    const docSnap = await getDoc(docRef);
    if (docSnap.data(["URL"])) {
      window.location.replace(docSnap.data()["URL"], "_blank");
    } else {
      alert("code doesn't exist");
      setIsLoading(false);
    }
  };

  function nextID(lastID) {
    // Si el último ID es null o vacío, regresar el primer ID posible
    if (!lastID) return "AAAAAA";
    // Convertir el último ID a un array de caracteres
    let idArray = lastID.split("");
    // Iterar sobre cada posición del ID de derecha a izquierda
    for (let i = idArray.length - 1; i >= 0; i--) {
      // Si la posición actual es una letra
      if (/[A-Y]/.test(idArray[i])) {
        // Incrementar la letra
        idArray[i] = String.fromCharCode(idArray[i].charCodeAt(0) + 1);
        break; // Salir del ciclo, hemos terminado
      } else if (idArray[i] === "Z") {
        // Si la posición actual es Z, cambiarla a 0 y seguir iterando
        idArray[i] = "0";
      } else if (/[0-9]/.test(idArray[i])) {
        // Si la posición actual es un número del 0 al 8, incrementarlo
        idArray[i] = String(Number(idArray[i]) + 1);
        break; // Salir del ciclo, hemos terminado
      }
    }
    // Unir los caracteres del array para formar el nuevo ID
    return idArray.join("");
  }

  const convertLink = async () => {
    // setResolve(true);
    if (oldLink === "") {
      alert("Please type any link in the text box");
      setResolve(false);
      return false;
    }
    if (iscustom === true && custom.trim().length > 1) {
      if (!/^[a-zA-Z0-9]+$/.test(custom)) {
        alert("Please only type any letter or number in the custom box");
        setResolve(false);
        return false;
      }
      try {
        console.log("entrE?")
        const docRef = doc(db, "linksCustom", custom);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResolve(false);
          alert("Code is already in use, try another diferente.")
          return false;          
        } else {
          setDoc(doc(db, "linksCustom", custom), {
            URL: oldLink,
          });        
          setShowResult(true);
          setNewLink(window.location.hostname + "/-" + custom);
          //setNewLink("http://localhost:3000/" + newCode);
          setResolve(false);
          showStatus(1);
        }
      } catch (error) {
        console.log(error);
        setResolve(false);
        showStatus(2);
      }
    } else {
      //for no custom
       try {
        const docRef = doc(db, "lastUsed", "Main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let newCode = nextID(docSnap.data()["ID"]);
          setDoc(doc(db, "links", newCode), {
            URL: oldLink,
          });
          setDoc(doc(db, "lastUsed", "Main"), {
            ID: newCode,
          });
          setShowResult(true);
          setNewLink(window.location.hostname + "/" + newCode);
          //setNewLink("http://localhost:3000/" + newCode);
          setResolve(false);
          showStatus(1);
        } else {
          console.log(docSnap.data()["ID"]);
          console.log("No such document!");
          showStatus(2);
          setResolve(false);
        }
      } catch (error) {
        console.log(error);
        setResolve(false);
        showStatus(2);
      }
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(newLink);
  };
  const backgroundMode = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("darkMode", JSON.stringify("dark"));
    } else {
      setTheme("light");
      localStorage.setItem("darkMode", JSON.stringify("light"));
    }
  };
  const reset = () => {
    setOldLink("");
    setShowResult(false);
    setNewLink("");
    setResolve(false);
    setOldLink("");
    setcustm("");
    document.getElementById("old").value = "";
    document.getElementById("old1").value = "";
  };
  const showStatus = (typeStatus) => {
    Setstatus(typeStatus);
    setTimeout(() => Setstatus(0), 2000);
  };
  useEffect(() => {
    //try to valid link before load the webpage
    const code = window.location.pathname.substring(1);
    if (code !== "") {      
     resolveLink(code);
     setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, []);
  return (
    <CustomProvider theme={theme}>
      {isLoading && <LoadingOverlay />}
      <Container
        id="main"
        style={{
          backgroundImage:
            String(theme) === "light"
              ? `url(${whiteBackground})`
              : `url(${DarkBackground})`,
        }}
      >
        {status !== 0 && (
          <Notification
            id="notification"
            type={status === 1 ? "success" : "error"}
            header={`Operation(${status === 1 ? "successful" : "failed"})`}
          >
            {status === 1
              ? "The link has shorter successfully, please check take it."
              : "The proccess has failed, please contact the webpage owner."}
          </Notification>
        )}
        <Grid id="Content">
          <Row className="show-grid">
            <Col xs={22} xsOffset={1} sm={20} id="col">
              <p id="tittle">URL-Shorterner</p>
            </Col>
            <Col xs={24} sm={2} id="light">
              <Toggle
                size="lg"
                checkedChildren="Dark"
                unCheckedChildren="Light"
                checked={theme !== "light"}
                onClick={() => backgroundMode()}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24} id="col">
              <Toggle
                size="lg"
                checkedChildren="Doing a custom"
                unCheckedChildren="Doing a random"
                checked={iscustom === true ? true : false}
                onClick={() => setIsCustm(!iscustom)}
              />
            </Col>
          </Row>
          <Row className="show-grid" hidden={iscustom === true ? false : true}>
            <Col xs={20} xsOffset={2} smOffset={4} sm={14} id="col">
              <Input
                id="old1"
                type="text"
                placeholder="Insert your word for custom link, also can be numbers, no special charaters"
                size="lg"
                onChange={(value) => {
                  setcustm(value);
                }}
              />
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={20} xsOffset={2} smOffset={4} sm={14} id="col">
              <Input
                id="old"
                type="text"
                placeholder="Insert link to convert"
                size="lg"
                onChange={(value) => {
                  setOldLink(value);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24} id="col">
              <Button
                color="blue"
                appearance="primary"
                size="lg"
                onClick={() => convertLink()}
                loading={resolve}
              >
                Convert
              </Button>
            </Col>
          </Row>
          <Row
            className="show-grid"
            id="resp"
            hidden={showResult === false ? true : false}
          >
            <Divider />
            <h1>Result:</h1>
            <Col xs={20} xsOffset={2} smOffset={8} sm={8} id="col">
              <p id="result">
                {newLink}
              </p>
            </Col>
            <Col xs={12} smOffset={6} sm={6} id="col">
              <Button
                id="send"
                color="green"
                appearance="primary"
                size="lg"
                onClick={reset}
              >
                New Code
              </Button>
            </Col>
            <Col xs={12} sm={6} id="col">
              <Button
                id="send"
                color="orange"
                appearance="primary"
                size="lg"
                onClick={copy}
              >
                copy
              </Button>
            </Col>
          </Row>
        </Grid>
      </Container>
    </CustomProvider>
  );
}

export default App;
