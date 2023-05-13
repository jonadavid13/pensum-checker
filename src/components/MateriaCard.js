import React from "react";
import 'bootstrap/dist/css/bootstrap.css';

function MateriaCard({nombre, uc, condicion, status, tipo}){
    return(
        <>
            <div className={`materia-card card ${status} d-flex`}>
                
                <span className="materia-nombre">{nombre}</span>
                <div className="materia__elements-container d-flex align-items-center justify-content-between">
                    <span className="materia-uc">{uc}</span>
                    
                    { 
                        (tipo==="optativa") && (
                            condicion === "C2" 
                            ? <span className="materia-badge optativa badge rounded-pill text-bg-danger">Opt.</span>
                            : <span className="materia-badge optativa badge rounded-pill text-bg-danger">Optativa</span>
                        )
                    }
                    {
                        condicion !== "N/A" &&
                        <span className={`materia-badge ${condicion.toString().toLowerCase()} badge rounded-pill text-bg-primary`}>{condicion}</span>
                    }
                </div>
            </div>
        </>
    );
}

export { MateriaCard }