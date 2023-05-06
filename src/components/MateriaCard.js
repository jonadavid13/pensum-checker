import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown } from "react-bootstrap";
import { handleCheck } from "../pages/Dashboard";

function MateriaCard({nombre, uc, condicion, status, idMateria}){

    return(
        <>
            <div className={`materia-card card ${status} d-flex`}>
                
                <span className="materia-nombre">{nombre}</span>
                <div className="materia__elements-container d-flex align-items-center justify-content-between">
                    <span className="materia-uc">{uc}</span>
                    {
                        condicion !== "N/A" &&
                        <span className="condicion-badge badge rounded-pill text-bg-primary">{condicion}</span>
                    }
                </div>
            </div>
        </>
    );
}

export { MateriaCard }