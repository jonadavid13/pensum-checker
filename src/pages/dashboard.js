import React, { useState } from "react";
import pensumData from "../utilities/pensumData.json"
import { MateriaCard } from "../components/MateriaCard";
import { Dropdown, Alert, Button } from "react-bootstrap";

const semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

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
    const [alerta, setAlerta] = useState({
        variant: "success",
        header: null,
        message: "Alerta inicial. ",
        emphasis: "fw-normal",
        show: false
    })

    const addTempUc = (num) => setUcTemporales((prevUc) => prevUc + num)
    const removeTempUc = (num) => setUcTemporales((prevUc) => prevUc - num)

    const restaurarCartasBloqueadas = () => {
        userData.materias.forEach(materia => {
            if(materia.estatus === "bloqueada"){
                const indice = userData.materias.map((mat) => mat.id).indexOf(materia.id)
                setUserData({
                    ...userData,
                    materias: [
                        ...userData.materias,
                        ...userData.materias[indice].estatus = "inicial"
                    ]
                })
            }
        })
    }

    const verificarMateria = (tempMateria, indice, units) => {
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
                    const indices = []
                    restantes.map((index) => {
                        materias.push(userData.materias.find((materia)=> materia.id===index))
                        indices.push(userData.materias.findIndex((mat) => mat.id===index) )
                        return null
                    })
                    setAlerta({
                        variant: "danger", 
                        header: "No se ha aprobado: ", 
                        message: materias.map((materia) => materia.nombre +" "),
                        emphasis: "fw-semibold",
                        show: true
                    })
                    
                    // Resaltar las materias que están pendientes por aprobar primeramente (por prelaciones)
                    indices.map((ind) => {
                        userData.materias[ind].estatus = "bloqueada"
                        return null
                    })
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

    const reiniciarAlerta = () => {
        setAlerta({
            show: false,
            variant: "success",
            header: null,
            message: "",
            emphasis: "fw-normal"
        })
    }
    
    const handleCheck = (id, units) => {
        restaurarCartasBloqueadas()
        reiniciarAlerta()
        const tempMateria = userData.materias.filter((materia) => materia.id===id)[0]
        const indice = userData.materias.map((materia) => materia.id).indexOf(id)
        
        if(tempMateria.condicion !== "N/A" && tempMateria.condicion !== "C2"){
            userData.ucAprobadas >= 114
                ? verificarMateria(tempMateria, indice, units)
                : setAlerta({
                    variant: "danger",
                    header: null,
                    message: "Se necesita tener 114"
                })
        } else if(tempMateria.condicion === "C2") {
            const inglesV = userData.materias.find((materia) => materia.nombre === "Inglés V")

            inglesV.estatus === "aprobada"
                ? verificarMateria(tempMateria, indice, units)
                : setAlerta({
                    variant: "danger",
                    header: null,
                    message: "Se necesita aprobar Inglés V primero. ",
                    show: true
                })
        } else {
            verificarMateria(tempMateria, indice, units)
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
                    <div className="contador-uc fs-3 fw-semibold">{
                        !(ucTemporales > 0) ? `UC Aprobadas: ${userData.ucAprobadas}` : `UC Aprobadas: ${userData.ucAprobadas}+${ucTemporales}` 
                    }</div>
                    <button className="btn btn-primary">Cargar Pensum</button>
                    <Button className="btn btn-success" 
                        href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData))} 
                        download={"data.json"}>
                        Descargar respaldo
                    </Button>
                </div>
            </section>

            <section className="main-container container-fluid">
                <Alert className="mx-5 my-4" dismissible
                    show={alerta.show}
                    variant={alerta.variant}
                    onClose={() => {
                        restaurarCartasBloqueadas()
                        setAlerta({ ...Alert, show: false })
                    }}>
                    {alerta.header && (<span className="alertHeader">{alerta.header}</span>)}
                    <span className={`alertMessage ${alerta.emphasis}`}>{alerta.message}</span>
                </Alert>
                <div className="pensum-container d-flex">
                    {
                        semestres.map(semestre => (
                            <div key={semestre} className={`columna-semestre sem-${semestre} d-flex flex-column`}>
                                <span className="column-header fw-semibold">{determinarSemestre(semestre)}</span>
                                {
                                    userData.materias.filter((materia) => (materia.semestre === semestre))
                                        .map((materia) => (
                                            <>
                                                <div className="materiaContainer" key={`card-${materia.id}`}>
                                                    <MateriaCard
                                                        key={materia.id}
                                                        nombre={materia.nombre}
                                                        uc={materia.uc}
                                                        condicion={materia.condicion}
                                                        status={materia.estatus}
                                                        tipo={materia.tipo}
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