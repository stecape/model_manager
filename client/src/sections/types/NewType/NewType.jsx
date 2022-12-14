import { useState, useEffect, useContext } from "react"
import { ExpansionPanel } from "@react-md/expansion-panel"
import { Grid, GridCell } from '@react-md/utils'
import FieldsList from './FieldsList'
import NewField from './NewField'
import NewTypeName from './NewTypeName'
import gridStyles from "../../../styles/Grid.module.scss"
import axios from 'axios'

import {SocketContext} from "../../../Helpers/socket"

function NewType (props) {
  const socket = useContext(SocketContext)
  const [newTypeFieldsList, setNewTypeFieldsList] = useState([])
  const [fieldName, setFieldName] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [init, setInit] = useState({types: false, newTypeFields: false})
  const [expanded, setExpanded] = useState(false);

  //State management
  useEffect(() => {
    //On component load request the lists
    if(init.newTypeFields === false){
      axios.post('http://localhost:3001/api/getAll', {table: "NewTypeTmp", fields:["name", "type", "id"]})
        .then(response => {
          setNewTypeFieldsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
          setInit((prevState) => ({ ...prevState, newTypeFields: true}))
        })
    }

    //On (re)connection request the lists
    socket.on("connect", () => {
      axios.post('http://localhost:3001/api/getAll', {table: "NewTypeTmp", fields:["name", "type", "id"]})
        .then(response => {
          setNewTypeFieldsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
          setInit((prevState) => ({ ...prevState, vars: true}))
        })
    })

    //Error logging
    socket.on("error", (error) => {
      console.log(error)
    })

    //react on update
    socket.on("update", (value) => {
      console.log(value)
      if (value.table === "NewTypeTmp" && value.operation === 'INSERT') {
        var fields = newTypeFieldsList
        fields.push(value.data)
        console.log(value, fields)
        setNewTypeFieldsList([...fields])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'DELETE') {
        setNewTypeFieldsList([...newTypeFieldsList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'TRUNCATE') {
        setNewTypeFieldsList([...[]])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'UPDATE') {
        var updFields = newTypeFieldsList
        var index = updFields.findIndex(i => i.id === value.data.id)
        updFields[index] = value.data
        setNewTypeFieldsList([...updFields])
      }
    })

    //dismantling listeners
    return () => {
      socket.off("connect")
      socket.off("error")
      socket.off("update")
    }
  },[init, newTypeFieldsList, socket])
  return (
  <>
    <ExpansionPanel
      id="new-var"
      expanded={expanded}
      onExpandClick={() => setExpanded(!expanded)}
      header="Create new type"
    >
      <Grid>
        <GridCell colSpan={12} className={gridStyles.item}>
          <NewTypeName 
            typesList={props.typesList}
            reset={()=>{
              setFieldName('')
              setFieldType('')
            }}
            create={(name)=>{
              return new Promise((innerResolve, innerReject) => {
                axios.post('http://localhost:3001/api/add', {table: "Type", fields:["name"], values:[name]}).then((res)=>{
                  console.log(res)
                  axios.post('http://localhost:3001/api/addMany', {table: "TypeDependencies", fields: ["type","dependent_type"], id: res.data.result[0], values: newTypeFieldsList.map(field => {return field.type})})
                    .then((value)=>{innerResolve(value)})
                    .catch((error)=>{innerReject(error)})
                }).catch((error)=>{innerReject(error)})
              })
            }}
          />
        </GridCell>
        <GridCell colSpan={12} className={gridStyles.item}>
          <NewField 
            typesList={props.typesList}
            fieldName={fieldName}
            setFieldName={(name)=>setFieldName(name)}
            fieldType={fieldType}
            setFieldType={(type)=>setFieldType(type)}
          />
        </GridCell>
        <GridCell colSpan={12} className={gridStyles.item}>
          <FieldsList typesList={props.typesList} newTypeFieldsList={newTypeFieldsList}/>
        </GridCell>
      </Grid>
    </ExpansionPanel>
  </>
)}

export default NewType