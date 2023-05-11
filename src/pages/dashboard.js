import React, { useState } from "react";
import pensumData from "../utilities/pensumData.json"
import { MateriaCard } from "../components/MateriaCard";
import { Dropdown, Alert } from "react-bootstrap";

function determinarSemestre(num) {
    switch(num){
        case(1):
            return "I";
        case(2):
            return "II";
        case(3):
            return "III";
        case(4):
            return "IV";
        case(5):
            return "V";
        case(6):
            return "VI";
        case(7):
            return "VII";
        case(8):
            return "VIII";
        case(9):
            return "IX";
        case(10):
            return "X";
        case(11):
            return "XI";
        case(12):
            return "XII";
        default:
            return "?";
    }
}

function Dashboard() {
    const [userData, setUserData] = useState(pensumData)
    const [ucTemporales, setUcTemporales] = useState(0)
    const semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [alert, setAlert] = useState({
        variant: "success",
        message: "Alerta inicial. ",
        show: false
    })
    const resetAlert = () => {
        setAlert({
            variant: "success",
            message: "Alerta vacía. ",
        })
    }

    const addTempUc = (num) => setUcTemporales((prevUc) => prevUc + num)
    const removeTempUc = (num) => setUcTemporales((prevUc) => prevUc - num)
    
    const [showAlert, setShowAlert] = useState(false) 
    
    const handleCheck = (id, units) => {
        const tempMateria = userData.materias.filter((materia) => materia.id===id)[0]
        const indice = userData.materias.map((materia) => materia.id).indexOf(id)

        if(tempMateria.estatus !== "aprobada"){
            if(tempMateria.prelacion === false) {
                if(tempMateria.estatus === "cursando"){
                    setUserData({
                        ...userData,
                        materias: [
                            ...userData.materias,
                            ...userData.materias[indice].estatus = "aprobada"
                        ],
                        ucAprobadas: userData.ucAprobadas + units
                    })
                    removeTempUc(units)
                } else {
                    setUserData({
                        ...userData,
                        materias: [
                            ...userData.materias,
                            ...userData.materias[indice].estatus = "aprobada"
                        ],
                        ucAprobadas: userData.ucAprobadas + units
                    })
                }
            } else {
                if(verificarPrelaciones(tempMateria.prelaciones) !== true){
                    const restantes = verificarPrelaciones(tempMateria.prelaciones)
                    const materias = []
                    restantes.map((index) => {
                        materias.push(userData.materias.find((materia)=> materia.id===index))
                        return null
                    })
                    setAlert({variant: "danger", message: `No se ha aprobado: ${materias[0].nombre}`, show: true})
                    console.log(materias)
                } else {
                    if(tempMateria.estatus === "cursando"){
                        setUserData({
                            ...userData,
                            materias: [
                                ...userData.materias,
                                ...userData.materias[indice].estatus = "aprobada"
                            ],
                            ucAprobadas: userData.ucAprobadas + units
                        })
                        removeTempUc(units)
                    } else {
                        setUserData({
                            ...userData,
                            materias: [
                                ...userData.materias,
                                ...userData.materias[indice].estatus = "aprobada"
                            ],
                            ucAprobadas: userData.ucAprobadas + units
                        })
                    }
                }
            }
        } 
    }

    const handleCursando = (id, units) => {
        const tempMateria = userData.materias.filter((materia) => materia.id===id)[0]

        if(tempMateria.estatus !== "cursando"){
            if(tempMateria.estatus === "aprobada"){
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
        const tempMateria = userData.materias.filter((materia) => materia.id===id)[0]

        if(tempMateria.estatus !== "inicial"){
            if(tempMateria.estatus === "aprobada"){
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

    const verificarPrelaciones = (array) => {
        let materiasRestantes = []
        let continuar = false

        array.map((idMateria) => {
            const materia = userData.materias.filter((element) => element.id === idMateria)
            if(materia[0].estatus === "aprobada"){
                continuar = true
            } else {
                materiasRestantes.push(idMateria)
                continuar = false
            }
            return null
        })
        
        if(continuar === true){
            return true;
        } else {
            return materiasRestantes;
        }
    }

    return (
        <div className="dashboard">
            <section className="header sticky-top d-flex justify-content-between align-items-center">
                <span className="header-title fw-semibold">PensumChecker</span>
                <div className="user-info d-flex">
                    <span className="fs-3 fw-semibold">{
                        !(ucTemporales > 0) ? `UC Aprobadas: ${userData.ucAprobadas}` : `UC Aprobadas: ${userData.ucAprobadas}+${ucTemporales}` 
                    }</span>
                    <button className="btn btn-primary">Cargar Pensum</button>
                    <button className="btn btn-success">Descargar respaldo</button>
                </div>
            </section>

            <section className="main-container container-fluid">
                <Alert className="mx-5 my-4" show={alert.show} variant={alert.variant} onClose={() => setAlert({...Alert, show: false})} dismissible>
                    <p>{alert.message}</p>
                </Alert>
                <div className="pensum-container d-flex">
                    {
                        semestres.map(semestre => (
                            <div key={semestre} className={`columna-semestre sem-${semestre} d-flex flex-column`}>
                                <span className="column-header fw-semibold">{determinarSemestre(semestre)}</span>
                                {
                                    userData.materias.filter((materia) => (materia.semestre === semestre && materia.tipo !== "optativa"))
                                        .map((materia) => (
                                            <>
                                                <div className="materiaContainer" key={`card-${materia.id}`}>
                                                    <MateriaCard
                                                        key={materia.id}
                                                        nombre={materia.nombre}
                                                        uc={materia.uc}
                                                        condicion={materia.condicion}
                                                        status={materia.estatus}
                                                    />
                                                    <Dropdown className="dropdown">
                                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="dropdown-toggle"></Dropdown.Toggle>
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
            </section>
        </div>
    )
}

export { Dashboard }