import React from "react";
import 'bootstrap/dist/css/bootstrap.css';

function MateriaCard({nombre, uc, condicion, status}){

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