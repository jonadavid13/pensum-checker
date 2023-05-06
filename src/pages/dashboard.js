import React, { useState } from "react";
import pensumData from "../utilities/pensumData.json"
import { MateriaCard } from "../components/MateriaCard";
import { Dropdown } from "react-bootstrap";


function determinarSemestre(num) {
    switch(num){
        case(1):
            return "I";
            break;
        case(2):
            return "II";
            break;
        case(3):
            return "III";
            break;
        case(4):
            return "IV";
            break;
        case(5):
            return "V";
            break;
        case(6):
            return "VI";
            break;
        case(7):
            return "VII";
            break;
        case(8):
            return "VIII";
            break;
        case(9):
            return "IX";
            break;
        case(10):
            return "X";
            break;
        case(11):
            return "XI";
            break;
        case(12):
            return "XII";
            break;
        default:
            return "?";
            break;
    }
}


function Dashboard() {
    const [userData, setUserData] = useState(pensumData)
    const semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [ucTemporales, setUcTemporales] = useState(0)

    const addTempUc = (num) => setUcTemporales((prevUc) => prevUc + num)
    const removeTempUc = (num) => setUcTemporales((prevUc) => prevUc - num)
    
    const handleCheck = (id, units) => {
        const tempMateria = userData.materias.filter((materia) => materia.id===id)

        if(tempMateria[0].estatus !== "aprobada"){
            if(tempMateria[0].estatus === "cursando"){
                setUserData({
                    ...userData,
                    materias: [
                        ...userData.materias,
                        ...userData.materias[id-1].estatus = "aprobada"
                    ],
                    ucAprobadas: userData.ucAprobadas + units
                })
                removeTempUc(units)
            } else {
                setUserData({
                    ...userData,
                    materias: [
                        ...userData.materias,
                        ...userData.materias[id-1].estatus = "aprobada"
                    ],
                    ucAprobadas: userData.ucAprobadas + units
                })
            }
        } 
    }

    const handleCursando = (id, units) => {
        const tempMateria = userData.materias.filter((materia) => materia.id===id)

        if(tempMateria[0].estatus !== "cursando"){
            if(tempMateria[0].estatus === "aprobada"){
                addTempUc(units)
                setUserData({
                    ...userData,
                    materias: [
                        ...userData.materias,
                        ...userData.materias[id-1].estatus = "cursando"

                    ],
                    ucAprobadas: userData.ucAprobadas - units
                })
            } else {
                addTempUc(units)
                setUserData({
                    ...userData,
                    materias: [
                        ...userData.materias,
                        ...userData.materias[id-1].estatus = "cursando"

                    ]
                })
            }
        }
    }
    const handleDesmarcar = (id, units) => {
        const tempMateria = userData.materias.filter((materia) => materia.id===id)

        if(tempMateria[0].estatus !== "inicial"){
            if(tempMateria[0].estatus === "aprobada"){
                setUserData({
                    ...userData,
                    materias: [
                        ...userData.materias,
                        ...userData.materias[id-1].estatus = "inicial"
                    ],
                    ucAprobadas: userData.ucAprobadas - units
                })
            } else {
                setUserData({
                    ...userData,
                    materias: [
                        ...userData.materias,
                        ...userData.materias[id-1].estatus = "inicial"
                    ]
                })
                removeTempUc(units)
            }
        }

    }

    return (
        <div className="dashboard">
            <div className="header d-flex py-3 px-3">
                <span className="header-title fw-semibold ps-2">PensumChecker</span>
                <div className="user-info d-flex">
                    <span className="fs-3 fw-semibold">{
                        !(ucTemporales > 0) ? `UC Aprobadas: ${userData.ucAprobadas}` : `UC Aprobadas: ${userData.ucAprobadas}+${ucTemporales}` 
                    }</span>
                </div>
            </div>
            <div className="main-container container-fluid">
                <div className="pensum-container d-flex my-5 mx-5">
                    {
                        semestres.map(semestre => (
                            <div key={`S${semestre}`} className={`columna-semestre sem-${semestre} d-flex flex-column`}>
                                <span key={`Header-${semestre}`} className="column-header fw-semibold">{determinarSemestre(semestre)}</span>
                                {
                                    userData.materias.filter((materia) => (materia.semestre === semestre && materia.tipo !== "optativa"))
                                        .map((materia) => (
                                            <>
                                                <div className="materiaContainer" key={`m-${materia.id}`}>
                                                    <MateriaCard
                                                        key={materia.id}
                                                        nombre={materia.nombre}
                                                        uc={materia.uc}
                                                        condicion={materia.condicion}
                                                        status={materia.estatus}
                                                    />
                                                    <Dropdown key={`dd-${materia.id}`} className="dropdown">
                                                        <Dropdown.Toggle key={`dt-${materia.id}`} variant="secondary" id="dropdown-basic"></Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item className="dropdown-link checked" onClick={() => handleCheck(materia.id, materia.uc)}>Aprobada</Dropdown.Item>
                                                            <Dropdown.Item className="dropdown-link cursando" onClick={() => handleCursando(materia.id, materia.uc)}>Cursando</Dropdown.Item>
                                                            <Dropdown.Item className="dropdown-link desmarcada" onClick={() => handleDesmarcar(materia.id, materia.uc)}>Desmarcar</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </>
                                        ))
                                }
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
        // <div>Hola soy: {pensumData.nombre} y ya cursé {pensumData.materias[0].nombre}</div>
    )
}

export { Dashboard }