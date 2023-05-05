import React from "react";
import pensumData from "../utilities/pensumData.json"
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/styles/styles.scss'

function Dashboard() {
    return (
        <div className="container-fluid my-3 mx-3">
            <span>
                Hola soy: {pensumData.nombre} y ya cursé {pensumData.materias[0].nombre}
            </span>
            <button className="btn btn-primary">Click</button>
        </div>
        // <div>Hola soy: {pensumData.nombre} y ya cursé {pensumData.materias[0].nombre}</div>
    )
}

export { Dashboard }
